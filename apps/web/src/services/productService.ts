import api from './api';

export interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  quantity: number;
  unit: string;
  description?: string;
  imageUrls?: string[];
  qualityGrade?: string;
  qualityScore?: number;
  isActive: boolean;
  district?: string;
  state?: string;
  farmerId: string;
  farmer?: {
    id: string;
    name: string;
    email?: string;
  };
  minimumOrder?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateProductData {
  name: string;
  category: string;
  price: number;
  quantity: number;
  unit: string;
  description?: string;
  imageUrls?: string[];
  district?: string;
  state?: string;
}

export const productService = {
  // Get all products (alias for compatibility)
  async getAll(): Promise<Product[]> {
    try {
      const response = await api.get("/products");
      const data = response.data.data || response.data || [];
      return Array.isArray(data) ? data : (data.products || []);
    } catch (error) {
      console.error('getAll products error:', error);
      return [];
    }
  },

  // Get all products for current farmer
  async getMyProducts(): Promise<Product[]> {
    try {
      // Use the standard products endpoint (which exists)
      const response = await api.get("/products");
      const data = response.data.data || response.data || [];
      return Array.isArray(data) ? data : (data.products || []);
    } catch (error) {
      // Silently return empty array
      return [];
    }
  },

  // Get all products (for buyers)
  async getAllProducts(filters?: {
    category?: string;
    minPrice?: number;
    maxPrice?: number;
    district?: string;
    state?: string;
  }): Promise<Product[]> {
    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value) params.append(key, value.toString());
      });
    }
    const response = await api.get(`/products?${params.toString()}`);
    return response.data;
  },

  // Get single product
  async getProduct(id: string): Promise<Product> {
    const response = await api.get(`/products/${id}`);
    return response.data;
  },

  // Get single product (alias)
  async getById(id: string): Promise<Product> {
    return this.getProduct(id);
  },

  // Get buyer products (active products)
  async getBuyerProducts(query?: string): Promise<{ data: Product[] }> {
    try {
      const response = await api.get(`/products${query || ''}`);
      const data = response.data.data || response.data || [];
      return { data: Array.isArray(data) ? data : (data.products || []) };
    } catch (error) {
      console.error('getBuyerProducts error:', error);
      return { data: [] };
    }
  },

  // Create product (alias)
  async create(data: any): Promise<Product> {
    const isFormData = data instanceof FormData;
    const response = await api.post('/products', data, {
      headers: isFormData ? { 'Content-Type': undefined } : {}
    });
    return response.data.data || response.data;
  },

  // Create product
  async createProduct(data: any): Promise<Product> {
    const isFormData = data instanceof FormData;
    const response = await api.post('/products', data, {
      headers: isFormData ? { 'Content-Type': undefined } : {}
    });
    return response.data;
  },

  // Update product (alias)
  async update(id: string, data: Partial<CreateProductData> | FormData): Promise<Product> {
    const isFormData = data instanceof FormData;
    const response = await api.patch(`/products/${id}`, data, {
      headers: isFormData ? { 'Content-Type': undefined } : {}
    });
    return response.data.data || response.data;
  },

  // Update product
  async updateProduct(id: string, data: Partial<CreateProductData> | FormData): Promise<Product> {
    const isFormData = data instanceof FormData;
    const response = await api.put(`/products/${id}`, data, {
      headers: isFormData ? { 'Content-Type': undefined } : {}
    });
    return response.data;
  },

  // Delete product
  async deleteProduct(id: string): Promise<void> {
    await api.delete(`/products/${id}`);
  },

  // Toggle product active status
  async toggleProductStatus(id: string): Promise<Product> {
    const response = await api.patch(`/products/${id}/toggle-status`);
    return response.data;
  },

  // Get product analytics
  async getProductAnalytics(id: string): Promise<any> {
    const response = await api.get(`/products/${id}/analytics`);
    return response.data;
  },

  // Update product price
  async updatePrice(id: string, price: number): Promise<Product> {
    const response = await api.patch(`/products/${id}`, { price });
    return response.data.data || response.data;
  }
};

