import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';

const API_URL = 'http://localhost:3001/api/kyc';

export type KYCStatus = 'NOT_SUBMITTED' | 'PENDING' | 'VERIFIED' | 'REJECTED';

export interface KYCDocument {
  id: string;
  type: string;
  documentUrl: string;
  verifiedAt: string | null;
  createdAt: string;
}

export interface KYCProfile {
  id: string;
  kycStatus: KYCStatus;
  rejectionReason: string | null;
  aadhaar: string | null;
  gst: string | null;
  pan: string | null;
  bankAccount: string | null;
  ifsc: string | null;
  bankName: string | null;
  kycDocuments: KYCDocument[];
}

export const useKYC = () => {
  const [data, setData] = useState<KYCProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchKYC = useCallback(async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const res = await axios.get(API_URL, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setData(res.data);
      setError(null);
    } catch (err: any) {
      console.error("KYC Fetch Error:", err);
      setError(err.response?.data?.error || 'Failed to fetch KYC profile');
    } finally {
      setLoading(false);
    }
  }, []);

  const submitDetails = async (details: Partial<KYCProfile>) => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.post(`${API_URL}/submit`, details, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('KYC details submitted!');
      fetchKYC();
      return res.data;
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'Submission failed');
      throw err;
    }
  };

  const uploadDocuments = async (files: File[], types: string[]) => {
    try {
      const token = localStorage.getItem('token');
      const formData = new FormData();
      
      files.forEach(file => formData.append('documents', file));
      formData.append('documentTypes', JSON.stringify(types));

      const res = await axios.post(`${API_URL}/upload`, formData, {
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });
      toast.success('Documents uploaded successfully!');
      fetchKYC();
      return res.data;
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'Upload failed');
      throw err;
    }
  };

  useEffect(() => {
    fetchKYC();
  }, [fetchKYC]);

  return { data, loading, error, refetch: fetchKYC, submitDetails, uploadDocuments };
};
