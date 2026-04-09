import api from './api';

export interface Tender {
  id: string;
  title: string;
  description: string;
  category: string;
  quantity: number;
  unit: string;
  budget: number;
  deadline: string;
  status: 'OPEN' | 'CLOSED' | 'AWARDED';
  buyerId: string;
  requirements?: any;
  createdAt: string;
  updatedAt: string;
  buyer?: any;
  applications?: TenderApplication[];
}

export interface TenderApplication {
  id: string;
  tenderId: string;
  farmerId: string;
  proposedPrice: number;
  message?: string;
  status: 'PENDING' | 'ACCEPTED' | 'REJECTED';
  createdAt: string;
  farmer?: any;
}

export const tenderService = {
  // Get all open tenders
  async getOpenTenders(filters?: { category?: string }): Promise<Tender[]> {
    const params = new URLSearchParams();
    if (filters?.category) params.append('category', filters.category);
    const response = await api.get(`/tenders?${params.toString()}`);
    return response.data;
  },

  // Get my tenders (buyer)
  async getMyTenders(): Promise<Tender[]> {
    const response = await api.get("/tenders/my-tenders");
    return response.data;
  },

  // Get my applications (farmer)
  async getMyApplications(): Promise<TenderApplication[]> {
    const response = await api.get("/tenders/my-applications");
    return response.data;
  },

  // Get single tender
  async getTender(id: string): Promise<Tender> {
    const response = await api.get(`/tenders/${id}`);
    return response.data;
  },

  // Create tender (buyer)
  async createTender(data: {
    title: string;
    description: string;
    category: string;
    quantity: number;
    unit: string;
    budget: number;
    deadline: string;
    requirements?: any;
  }): Promise<Tender> {
    const response = await api.post('/tenders', data);
    return response.data;
  },

  // Apply to tender (farmer)
  async applyToTender(tenderId: string, data: {
    proposedPrice: number;
    message?: string;
  }): Promise<TenderApplication> {
    const response = await api.post(`/tenders/${tenderId}/apply`, data);
    return response.data;
  },

  // Update application status (buyer)
  async updateApplicationStatus(applicationId: string, status: 'ACCEPTED' | 'REJECTED'): Promise<TenderApplication> {
    const response = await api.patch(`/tenders/applications/${applicationId}`, { status });
    return response.data;
  },

  // Close tender (buyer)
  async closeTender(id: string): Promise<Tender> {
    const response = await api.patch(`/tenders/${id}/close`);
    return response.data;
  }
};

