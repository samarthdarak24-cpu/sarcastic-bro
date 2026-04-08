import { io, Socket } from "socket.io-client";

const SOCKET_URL = process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || "http://localhost:3001";

let socket: Socket | null = null;
const getAuthFromStorage = (): { token?: string; userId?: string } => {
  if (typeof window === 'undefined') return {};

  try {
    const token = localStorage.getItem('token') || undefined;
    const userRaw = localStorage.getItem('user');
    const userId = userRaw ? JSON.parse(userRaw)?.id : undefined;
    if (token) return { token, userId };
  } catch {}

  // Backward compatibility with older auth store format
  try {
    const raw = localStorage.getItem('auth-storage');
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    return {
      token: parsed?.state?.token,
      userId: parsed?.state?.user?.id
    };
  } catch {
    return {};
  }
};

export const getSocket = (): Socket => {
  if (!socket || !socket.connected) {
    const { token, userId } = getAuthFromStorage();

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
      // Optional explicit join for compatibility with older event handlers.
      if (userId) socket?.emit('join-user-room', userId);
    });

    socket.on("disconnect", (reason) => {
      console.log("[Socket] ❌ Disconnected:", reason);
    });

    socket.on("connect_error", (err) => {
      // Silently handle connection errors - this is normal when not authenticated
      if (err.message !== 'websocket error') {
        console.warn("[Socket] Connection error:", err.message);
      }
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
