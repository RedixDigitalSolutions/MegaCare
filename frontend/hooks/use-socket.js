import { useEffect, useState } from "react";
import { io } from "socket.io-client";
export function useSocket() {
    const [socket, setSocket] = useState(null);
    useEffect(() => {
        const token = localStorage.getItem("megacare_token");
        if (!token)
            return;
        const s = io("http://localhost:5000", {
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
