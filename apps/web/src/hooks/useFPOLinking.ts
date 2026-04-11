import { useState, useCallback } from 'react';
import api from '../services/api';

export interface FPO {
  id: string;
  name: string;
  registrationNo: string;
  district: string;
  state: string;
  bankAccount: string;
  ifsc: string;
  commissionRate: number;
  farmerCount: number;
  adminName: string;
  adminPhone: string;
}

export interface LinkRequest {
  id: string;
  fpoId: string;
  farmerId: string;
  farmerName: string;
  farmerPhone: string;
  farmerDistrict: string;
  farmerAadhaar: string;
  message: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  rejectionReason?: string;
  createdAt: string;
  reviewedAt?: string;
  farmerDetails?: any;
}

export interface FPOStatus {
  status: 'NONE' | 'PENDING' | 'LINKED';
  fpo?: {
    id: string;
    name: string;
    registrationNo: string;
    district: string;
    state: string;
    commissionRate: number;
  };
  pendingRequests: LinkRequest[];
}

export interface LinkedFarmer {
  id: string;
  name: string;
  phone: string;
  aadhaar: string;
  district: string;
  bankAccount?: string;
  ifsc?: string;
  isActive: boolean;
  cropsCount: number;
  crops: any[];
  createdAt: string;
}

export function useFPOLinking() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Search FPOs by district
  const searchFPOs = useCallback(async (district?: string): Promise<FPO[]> => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get('/fpo-link/farmer/fpo/search', {
        params: { district }
      });
      const fpos = response.data.fpos || response.data || [];
      return Array.isArray(fpos) ? fpos : [];
    } catch (err: any) {
      const message = err.response?.data?.error || 'Failed to search FPOs';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Create link request
  const createLinkRequest = useCallback(async (fpoId: string, message?: string) => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.post('/fpo-link/farmer/fpo/link-request', {
        fpoId,
        message
      });
      return response.data;
    } catch (err: any) {
      const message = err.response?.data?.error || 'Failed to create link request';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Get farmer's FPO status
  const getMyFPOStatus = useCallback(async (): Promise<FPOStatus> => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get('/fpo-link/farmer/fpo/my-status');
      return response.data;
    } catch (err: any) {
      const message = err.response?.data?.error || 'Failed to get FPO status';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Unlink from FPO
  const unlinkFromFPO = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.delete('/fpo-link/farmer/fpo/unlink');
      return response.data;
    } catch (err: any) {
      const message = err.response?.data?.error || 'Failed to unlink from FPO';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // FPO: Get link requests
  const getFPOLinkRequests = useCallback(async (status?: string): Promise<LinkRequest[]> => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get('/fpo-link/fpo/link-requests', {
        params: { status }
      });
      const requests = response.data.requests || response.data || [];
      return Array.isArray(requests) ? requests : [];
    } catch (err: any) {
      const message = err.response?.data?.error || 'Failed to get link requests';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // FPO: Approve link request
  const approveLinkRequest = useCallback(async (requestId: string) => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.post(`/fpo-link/fpo/link-requests/${requestId}/approve`);
      return response.data;
    } catch (err: any) {
      const message = err.response?.data?.error || 'Failed to approve request';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // FPO: Reject link request
  const rejectLinkRequest = useCallback(async (requestId: string, reason?: string) => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.post(`/fpo-link/fpo/link-requests/${requestId}/reject`, {
        reason
      });
      return response.data;
    } catch (err: any) {
      const message = err.response?.data?.error || 'Failed to reject request';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // FPO: Get linked farmers
  const getLinkedFarmers = useCallback(async (): Promise<LinkedFarmer[]> => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get('/fpo-link/fpo/linked-farmers');
      const farmers = response.data.farmers || response.data || [];
      return Array.isArray(farmers) ? farmers : [];
    } catch (err: any) {
      const message = err.response?.data?.error || 'Failed to get linked farmers';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // FPO: Toggle farmer status
  const toggleFarmerStatus = useCallback(async (farmerId: string) => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.put(`/fpo-link/fpo/farmers/${farmerId}/toggle-status`);
      return response.data;
    } catch (err: any) {
      const message = err.response?.data?.error || 'Failed to toggle farmer status';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    loading,
    error,
    searchFPOs,
    createLinkRequest,
    getMyFPOStatus,
    unlinkFromFPO,
    getFPOLinkRequests,
    approveLinkRequest,
    rejectLinkRequest,
    getLinkedFarmers,
    toggleFarmerStatus
  };
}
