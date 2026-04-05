import { io, Socket } from "socket.io-client";

const SOCKET_URL = process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || "http://localhost:3001";

let socket: Socket | null = null;

export const getSocket = (): Socket => {
  if (!socket || !socket.connected) {
    // Get token safely without calling hooks outside React
    let token: string | undefined;
    try {
      if (typeof window !== 'undefined') {
        const raw = localStorage.getItem('auth-storage');
        if (raw) token = JSON.parse(raw)?.state?.token;
      }
    } catch {}

    socket = io(SOCKET_URL, {
      auth: { token },
      transports: ["websocket", "polling"],
      reconnection: true,
      reconnectionAttempts: 3,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
    });

    socket.on("connect", () => {
      console.log("[Socket] ✅ Connected:", socket?.id);
      // Auto-join user room
      try {
        if (typeof window !== 'undefined') {
          const raw = localStorage.getItem('auth-storage');
          if (raw) {
            const userId = JSON.parse(raw)?.state?.user?.id;
            if (userId) socket?.emit('join-user-room', userId);
          }
        }
      } catch {}
    });

    socket.on("disconnect", (reason) => {
      console.log("[Socket] ❌ Disconnected:", reason);
    });

    socket.on("connect_error", (err) => {
      console.warn("[Socket] Connection error:", err.message);
      // Don't throw error, just log it
    });

    socket.on("error", (err) => {
      console.warn("[Socket] Error:", err);
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
