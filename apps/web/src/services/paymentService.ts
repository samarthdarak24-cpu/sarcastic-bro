import api from "./api";

export const paymentService = {
  getHistory: async () => {
    const response: any = await api.get("/payments/history");
    return response.data || response;
  },

  createOrder: async (data: { amount: number, orderId?: string, farmerId: string }) => {
    const response: any = await api.post("/payments/create-order", data);
    return response.data || response;
  },

  verifyPayment: async (data: any) => {
    const response: any = await api.post("/payments/verify", data);
    return response.data || response;
  },

  requestEarlyRelease: async (paymentId: string) => {
    const response: any = await api.post("/payments/early-release", { paymentId });
    return response.data || response;
  },
};
