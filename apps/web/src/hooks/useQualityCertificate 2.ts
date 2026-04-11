import { useState, useEffect } from 'react';
import { qualityCertificateService, QualityCertificate, UploadCertificateData } from '../services/qualityCertificate';

export const useQualityCertificate = () => {
  const [certificates, setCertificates] = useState<QualityCertificate[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchMyCertificates = async () => {
    setLoading(true);
    setError(null);
    try {
      console.log('Fetching certificates...');
      const data = await qualityCertificateService.getMyCertificates();
      console.log('Certificates fetched:', data);
      setCertificates(Array.isArray(data) ? data : []);
    } catch (err: any) {
      console.error('Fetch certificates error:', err);
      console.error('Error response:', err.response);
      console.error('Error message:', err.message);
      
      // Provide more specific error messages
      if (err.status === 401 || err.message?.includes('Authentication required')) {
        setError('Please log in to view your certificates');
      } else if (err.isNetworkError || err.message?.includes('Network error')) {
        setError('Unable to connect to server. Please check your connection.');
      } else {
        setError(err.message || 'Failed to fetch certificates');
      }
      
      // Set empty array on error so UI doesn't break
      setCertificates([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchCertificatesForCrop = async (cropId: string) => {
    setLoading(true);
    setError(null);
    try {
      const data = await qualityCertificateService.getCertificatesForCrop(cropId);
      setCertificates(data);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch certificates');
    } finally {
      setLoading(false);
    }
  };

  const fetchCertificatesForLot = async (lotId: string) => {
    setLoading(true);
    setError(null);
    try {
      const data = await qualityCertificateService.getCertificatesForLot(lotId);
      setCertificates(data);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch certificates');
    } finally {
      setLoading(false);
    }
  };

  const uploadCertificate = async (data: UploadCertificateData) => {
    setLoading(true);
    setError(null);
    try {
      const result = await qualityCertificateService.uploadCertificate(data);
      await fetchMyCertificates(); // Refresh list
      return result.certificate;
    } catch (err: any) {
      setError(err.message || 'Failed to upload certificate');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const verifyCertificate = async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      const result = await qualityCertificateService.verifyCertificate(id);
      await fetchMyCertificates(); // Refresh list
      return result.certificate;
    } catch (err: any) {
      setError(err.message || 'Failed to verify certificate');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteCertificate = async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      await qualityCertificateService.deleteCertificate(id);
      await fetchMyCertificates(); // Refresh list
    } catch (err: any) {
      setError(err.message || 'Failed to delete certificate');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const generateAIScore = async (cropId: string, images: File[]) => {
    setLoading(true);
    setError(null);
    try {
      const result = await qualityCertificateService.generateAIScore(cropId, images);
      await fetchMyCertificates(); // Refresh list
      return result;
    } catch (err: any) {
      setError(err.message || 'Failed to generate AI score');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    certificates,
    loading,
    error,
    fetchMyCertificates,
    fetchCertificatesForCrop,
    fetchCertificatesForLot,
    uploadCertificate,
    verifyCertificate,
    deleteCertificate,
    generateAIScore,
  };
};
