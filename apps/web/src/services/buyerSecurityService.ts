import api from './api';

export const buyerSecurityService = {
  async getSecurityStatus(token: string) {
    const response = await axios.get(`${API_URL}/buyer/security`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  },

  async getSecurityEvents(filters: { eventType?: string; riskLevel?: string; page?: number; limit?: number }, token: string) {
    const response = await axios.get(`${API_URL}/buyer/security/events`, {
      params: filters,
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  },

  async getSessions(token: string) {
    const response = await axios.get(`${API_URL}/buyer/security/sessions`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  },

  async terminateSession(sessionId: string, token: string) {
    const response = await axios.delete(`${API_URL}/buyer/security/sessions/${sessionId}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  }
};
