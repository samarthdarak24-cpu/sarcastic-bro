import { useState, useCallback } from 'react';
import { 
  analyticsService, 
  FarmerAnalytics, 
  BuyerAnalytics, 
  FPOAnalytics 
} from '../services/analyticsService';
import { toast } from 'react-hot-toast';

export const useAnalytics = () => {
  const [farmerData, setFarmerData] = useState<FarmerAnalytics | null>(null);
  const [buyerData, setBuyerData] = useState<BuyerAnalytics | null>(null);
  const [fpoData, setFPOData] = useState<FPOAnalytics | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchFarmerAnalytics = useCallback(async (timeRange: string = '30d') => {
    setLoading(true);
    setError(null);
    try {
      const data = await analyticsService.getFarmerAnalytics(timeRange);
      setFarmerData(data);
      return data;
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Failed to fetch analytics';
      setError(msg);
      toast.error(msg);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchBuyerAnalytics = useCallback(async (timeRange: string = '30d') => {
    setLoading(true);
    setError(null);
    try {
      const data = await analyticsService.getBuyerAnalytics(timeRange);
      setBuyerData(data);
      return data;
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Failed to fetch analytics';
      setError(msg);
      toast.error(msg);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchFPOAnalytics = useCallback(async (timeRange: string = '30d') => {
    setLoading(true);
    setError(null);
    try {
      const data = await analyticsService.getFPOAnalytics(timeRange);
      setFPOData(data);
      return data;
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Failed to fetch analytics';
      setError(msg);
      toast.error(msg);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    farmerData,
    buyerData,
    fpoData,
    loading,
    error,
    fetchFarmerAnalytics,
    fetchBuyerAnalytics,
    fetchFPOAnalytics,
  };
};
