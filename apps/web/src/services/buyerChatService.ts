import api from './api';

export const buyerChatService = {
  async sendMessage(message: string, token: string) {
    const response = await axios.post(`${API_URL}/buyer/chat`, { message }, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  },

  async getChatHistory(limit: number = 50, token: string) {
    const response = await axios.get(`${API_URL}/buyer/chat/history`, {
      params: { limit },
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  },

  async clearChatHistory(token: string) {
    const response = await axios.delete(`${API_URL}/buyer/chat/history`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  }
};
