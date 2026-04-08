import api from './api';

export const buyerPreBookingService = {
  async getPreBookings(filters: { status?: string; page?: number; limit?: number }, token: string) {
    const response = await axios.get(`${API_URL}/buyer/pre-bookings`, {
      params: filters,
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  },

  async getPreBookingById(id: string, token: string) {
    const response = await axios.get(`${API_URL}/buyer/pre-bookings/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  },

  async createPreBooking(data: {
    bulkProductId: string;
    quantity: number;
    pricePerUnit: number;
    targetDate: Date;
    notes?: string;
  }, token: string) {
    const response = await axios.post(`${API_URL}/buyer/pre-bookings`, data, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  },

  async updatePreBooking(id: string, data: any, token: string) {
    const response = await axios.put(`${API_URL}/buyer/pre-bookings/${id}`, data, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  },

  async cancelPreBooking(id: string, token: string) {
    const response = await axios.delete(`${API_URL}/buyer/pre-bookings/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  }
};
