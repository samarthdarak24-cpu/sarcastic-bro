import api from './api';

export interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  quantity: number;
  unit: string;
  qualityGrade: string;
  harvestDate: string;
  lat: number;
  lng: number;
  district?: string;
  state?: string;
  status?: string;
}

export const productService = {
  async getAll() {
    const response: any = await api.get('/products');
    return response.data; // Assuming response.data contains the array
  },

  async getById(id: string) {
    const response: any = await api.get(`/products/${id}`);
    return response.data;
  },

  async create(data: any) {
    return await api.post('/products', data);
  },

  async update(id: string, data: any) {
    return await api.put(`/products/${id}`, data);
  },

  async delete(id: string) {
    return await api.delete(`/products/${id}`);
  },
};
