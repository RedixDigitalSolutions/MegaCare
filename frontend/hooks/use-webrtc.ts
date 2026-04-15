import { useEffect, useRef, useState, useCallback } from "react";
import type { Socket } from "socket.io-client";

const ICE_SERVERS: RTCConfiguration = {
  iceServers: [
    { urls: "stun:stun.l.google.com:19302" },
    { urls: "stun:stun1.l.google.com:19302" },
    // TURN server — required for peers behind symmetric NAT (production).
    // Set VITE_TURN_URL, VITE_TURN_USERNAME, VITE_TURN_CREDENTIAL in .env.
    ...(import.meta.env.VITE_TURN_URL
      ? [
        {
          urls: import.meta.env.VITE_TURN_URL as string,
          username: import.meta.env.VITE_TURN_USERNAME as string,
          credential: import.meta.env.VITE_TURN_CREDENTIAL as string,
        },
      ]
      : []),
  ],
};

interface UseWebRTCOptions {
  socket: Socket | null;
  partnerId: string;
  /** true = this side creates the offer (doctor initiates) */
  initiator: boolean;
}

export function useWebRTC({ socket, partnerId, initiator }: UseWebRTCOptions) {
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const pcRef = useRef<RTCPeerConnection | null>(null);
  const localStreamRef = useRef<MediaStream | null>(null);
  const offerSentRef = useRef(false);
  const joinSoundPlayedRef = useRef(false);
  /** Timestamp when this user entered the room (local stream started) */
  const roomEnteredAtRef = useRef(0);

  const [cameraOn, setCameraOn] = useState(true);
  const [micOn, setMicOn] = useState(true);
  const [connected, setConnected] = useState(false);
  const [mediaError, setMediaError] = useState<string | null>(null);

  /**
   * Play the partner-joined sound, but ONLY if this user has been
   * in the room for at least 3 seconds (i.e. they were genuinely waiting).
   * The joining user will have entered < 1s ago, so they stay silent.
   */
  const playJoinSound = useCallback(() => {
    if (joinSoundPlayedRef.current) return;
    const waitMs = Date.now() - roomEnteredAtRef.current;
    if (roomEnteredAtRef.current === 0 || waitMs < 3000) return;
    joinSoundPlayedRef.current = true;
    const src = initiator
      ? "/sounds/patient-joined.mp3"
      : "/sounds/doctor-joined.mp3";
    const audio = new Audio(src);
    audio.volume = 0.7;
    audio.play().catch(() => { });
  }, [initiator]);

  // Get local media
  const startLocalStream = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });
      localStreamRef.current = stream;
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
      }
      setMediaError(null);
      return stream;
    } catch (err: any) {
      console.error("[WebRTC] media error:", err);
      // Try audio-only fallback
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: false,
          audio: true,
        });
        localStreamRef.current = stream;
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = stream;
        }
        setMediaError("Caméra inaccessible — audio uniquement");
        return stream;
      } catch {
        setMediaError("Impossible d'accéder à la caméra et au micro");
        return null;
      }
    }
  }, []);

  // Create peer connection
  const createPeerConnection = useCallback(
    (stream: MediaStream) => {
      if (!socket || !partnerId) return null;

      const pc = new RTCPeerConnection(ICE_SERVERS);
      pcRef.current = pc;

      // Add local tracks
      stream.getTracks().forEach((track) => {
        pc.addTrack(track, stream);
      });

      // ICE candidates
      pc.onicecandidate = (e) => {
        if (e.candidate) {
          socket.emit("webrtc:ice-candidate", {
            to: partnerId,
            candidate: e.candidate,
          });
        }
      };

      // Remote stream
      pc.ontrack = (e) => {
        if (remoteVideoRef.current && e.streams[0]) {
          remoteVideoRef.current.srcObject = e.streams[0];
          setConnected(true);
        }
      };

      pc.oniceconnectionstatechange = () => {
        if (
          pc.iceConnectionState === "disconnected" ||
          pc.iceConnectionState === "failed"
        ) {
          setConnected(false);
        }
      };

      return pc;
    },
    [socket, partnerId],
  );

  // Initiator: create and send offer (guarded against duplicates)
  const sendOffer = useCallback(async () => {
    if (offerSentRef.current) return;
    offerSentRef.current = true;

    const stream = localStreamRef.current || (await startLocalStream());
    if (!stream || !socket || !partnerId) {
      offerSentRef.current = false;
      return;
    }

    // Close any stale peer connection
    if (pcRef.current) {
      pcRef.current.close();
      pcRef.current = null;
    }

    const pc = createPeerConnection(stream);
    if (!pc) {
      offerSentRef.current = false;
      return;
    }

    const offer = await pc.createOffer();
    await pc.setLocalDescription(offer);
    socket.emit("webrtc:offer", { to: partnerId, offer });
  }, [startLocalStream, createPeerConnection, socket, partnerId]);

  // Handle incoming offer (receiver side — guarded)
  const handleOffer = useCallback(
    async (data: { from: string; offer: RTCSessionDescriptionInit }) => {
      if (data.from !== partnerId) return;

      // If we already have a connection, ignore the duplicate offer
      if (pcRef.current && pcRef.current.signalingState !== "closed") return;

      // Patient was waiting → play "doctor joined"
      playJoinSound();

      const stream = localStreamRef.current || (await startLocalStream());
      if (!stream) return;

      const pc = createPeerConnection(stream);
      if (!pc) return;

      await pc.setRemoteDescription(new RTCSessionDescription(data.offer));
      const answer = await pc.createAnswer();
      await pc.setLocalDescription(answer);
      socket?.emit("webrtc:answer", { to: partnerId, answer });
    },
    [partnerId, startLocalStream, createPeerConnection, socket, playJoinSound],
  );

  // Handle incoming answer (initiator side)
  const handleAnswer = useCallback(
    async (data: { from: string; answer: RTCSessionDescriptionInit }) => {
      if (data.from !== partnerId) return;
      const pc = pcRef.current;
      if (!pc) return;
      await pc.setRemoteDescription(new RTCSessionDescription(data.answer));
    },
    [partnerId],
  );

  // Handle ICE candidate
  const handleIceCandidate = useCallback(
    async (data: { from: string; candidate: RTCIceCandidateInit }) => {
      if (data.from !== partnerId) return;
      const pc = pcRef.current;
      if (!pc) return;
      try {
        await pc.addIceCandidate(new RTCIceCandidate(data.candidate));
      } catch (e) {
        console.error("[WebRTC] addIceCandidate error:", e);
      }
    },
    [partnerId],
  );

  // Handle call end from remote
  const handleEnd = useCallback(
    (data: { from: string }) => {
      if (data.from !== partnerId) return;
      cleanup();
      setConnected(false);
    },
    [partnerId],
  );

  // Toggle camera
  const toggleCamera = useCallback(() => {
    const stream = localStreamRef.current;
    if (!stream) return;
    const videoTrack = stream.getVideoTracks()[0];
    if (videoTrack) {
      videoTrack.enabled = !videoTrack.enabled;
      setCameraOn(videoTrack.enabled);
    }
  }, []);

  // Toggle mic
  const toggleMic = useCallback(() => {
    const stream = localStreamRef.current;
    if (!stream) return;
    const audioTrack = stream.getAudioTracks()[0];
    if (audioTrack) {
      audioTrack.enabled = !audioTrack.enabled;
      setMicOn(audioTrack.enabled);
    }
  }, []);

  // Clean up
  const cleanup = useCallback(() => {
    localStreamRef.current?.getTracks().forEach((t) => t.stop());
    localStreamRef.current = null;
    pcRef.current?.close();
    pcRef.current = null;
    if (localVideoRef.current) localVideoRef.current.srcObject = null;
    if (remoteVideoRef.current) remoteVideoRef.current.srcObject = null;
  }, []);

  // End call
  const endCall = useCallback(() => {
    socket?.emit("webrtc:end", { to: partnerId });
    cleanup();
    setConnected(false);
  }, [socket, partnerId, cleanup]);

  // Wire up socket listeners + auto-start
  useEffect(() => {
    if (!socket || !partnerId) return;

    // Reset offer guard on fresh mount
    offerSentRef.current = false;

    socket.on("webrtc:offer", handleOffer);
    socket.on("webrtc:answer", handleAnswer);
    socket.on("webrtc:ice-candidate", handleIceCandidate);
    socket.on("webrtc:end", handleEnd);

    // Record room entry time
    roomEnteredAtRef.current = Date.now();

    if (initiator) {
      // Doctor side: listen for patient's "ready" signal to send offer
      const handlePartnerReady = (data: { from: string }) => {
        if (data.from !== partnerId) return;
        console.log("[WebRTC] partner ready, sending offer");
        playJoinSound(); // Doctor was waiting → play "patient joined"
        sendOffer();
      };
      socket.on("webrtc:ready", handlePartnerReady);

      // Also try after 1.5s as fallback (patient might already be there)
      const timeout = setTimeout(() => {
        sendOffer();
        socket.emit("webrtc:call", { to: partnerId });
      }, 1500);

      return () => {
        clearTimeout(timeout);
        socket.off("webrtc:offer", handleOffer);
        socket.off("webrtc:answer", handleAnswer);
        socket.off("webrtc:ice-candidate", handleIceCandidate);
        socket.off("webrtc:end", handleEnd);
        socket.off("webrtc:ready", handlePartnerReady);
      };
    }

    // Patient side: get local stream, then signal "ready" to doctor
    startLocalStream().then(() => {
      // Tell the doctor we're ready to receive the offer
      socket.emit("webrtc:ready", { to: partnerId });

      // Re-emit ready periodically in case doctor joins later.
      // Stops automatically once the ICE connection is established.
      let readyInterval: ReturnType<typeof setInterval>;
      readyInterval = setInterval(() => {
        const iceState = pcRef.current?.iceConnectionState;
        if (iceState === "connected" || iceState === "completed") {
          clearInterval(readyInterval);
          return;
        }
        if (!pcRef.current || pcRef.current.signalingState === "closed") {
          socket.emit("webrtc:ready", { to: partnerId });
        }
      }, 3000);

      // Store interval id for cleanup
      (socket as any).__readyInterval = readyInterval;
    });

    return () => {
      const interval = (socket as any).__readyInterval;
      if (interval) clearInterval(interval);
      socket.off("webrtc:offer", handleOffer);
      socket.off("webrtc:answer", handleAnswer);
      socket.off("webrtc:ice-candidate", handleIceCandidate);
      socket.off("webrtc:end", handleEnd);
    };
  }, [
    socket,
    partnerId,
    initiator,
    handleOffer,
    handleAnswer,
    handleIceCandidate,
    handleEnd,
    sendOffer,
    startLocalStream,
  ]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      cleanup();
    };
  }, [cleanup]);

  return {
    localVideoRef,
    remoteVideoRef,
    cameraOn,
    micOn,
    connected,
    mediaError,
    toggleCamera,
    toggleMic,
    endCall,
  };
}
