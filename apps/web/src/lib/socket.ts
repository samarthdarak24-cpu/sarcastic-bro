import { io, Socket } from "socket.io-client";
import { useAuthStore } from "@/store/authStore";

const SOCKET_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

let socket: Socket | null = null;

export const getSocket = () => {
    if (!socket) {
        const token = useAuthStore.getState().user?.token;
        socket = io(SOCKET_URL, {
            auth: { token },
            transports: ["websocket", "polling"],
        });

        socket.on("connect", () => {
            console.log("[Socket] Connected to server:", socket?.id);
        });

        socket.on("disconnect", () => {
            console.log("[Socket] Disconnected");
        });

        socket.on("connect_error", (err) => {
            console.error("[Socket] Connection error:", err.message);
        });
    }
    return socket;
};

export const disconnectSocket = () => {
    if (socket) {
        socket.disconnect();
        socket = null;
    }
};
