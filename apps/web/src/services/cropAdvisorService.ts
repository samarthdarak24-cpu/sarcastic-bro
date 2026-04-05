import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export const cropAdvisorService = {
  async getRecommendations(userId: string) {
    try {
      const response = await axios.get(`${API_URL}/api/crop-advisor/recommendations`, {
        params: { userId }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching recommendations:', error);
      return null;
    }
  }
};
