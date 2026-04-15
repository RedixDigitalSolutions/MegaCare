import { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";

export function useSocket(): Socket | null {
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("megacare_token");
    if (!token) return;

    const s = io(import.meta.env.VITE_SOCKET_URL ?? "", {
      auth: { token },
    });

    s.on("connect", () => {
      console.log("[MegaCare Socket] connected, id:", s.id);
      setSocket(s);
    });

    s.on("connect_error", (err) => {
      console.error("[MegaCare Socket] connect_error:", err.message);
    });

    return () => {
      s.disconnect();
    };
  }, []);

  return socket;
}
