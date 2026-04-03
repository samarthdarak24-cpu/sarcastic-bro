import api from "./api";

export interface ChatMessage {
  id: string;
  conversationId: string;
  senderId: string;
  content: string;
  type: string;
  createdAt: string;
  senderName?: string;
}

export interface ChatConversation {
  id: string;
  userId: string;
  name: string;
  avatar?: string;
  lastMessage?: string;
  lastMessageTime?: string;
  unreadCount: number;
  isOnline: boolean;
  role: string;
}

export const messageService = {
  async getConversations(page = 1, limit = 20) {
    const response: any = await api.get("/messages/conversations", {
      params: { page, limit }
    });
    return response.data;
  },

  async getMessages(userId: string, page = 1, limit = 50) {
    const response: any = await api.get(`/messages/with/${userId}`, {
      params: { page, limit }
    });
    return response.data;
  },

  async sendMessage(receiverId: string, content: string, type = "text") {
    const response: any = await api.post("/messages", { receiverId, content, type });
    return response.data;
  },

  async markAsRead(messageId: string) {
    const response: any = await api.patch(`/messages/${messageId}/read`);
    return response.data;
  }
};
