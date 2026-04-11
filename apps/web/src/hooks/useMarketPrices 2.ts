import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export interface MarketPrice {
  id: string;
  cropName: string;
  variety: string;
  district: string;
  state: string;
  minPrice: number;
  maxPrice: number;
  modalPrice: number;
  arrivalQuantity: number;
  date: string;
}

export interface Recommendation {
  status: 'SELL' | 'WAIT' | 'STABLE' | 'HOLD';
  message: string;
  trend: 'UPWARD' | 'DOWNWARD' | 'STABLE' | 'NEUTRAL';
  change?: string;
}

export const useMarketPrices = (selectedCrop?: string, selectedDistrict?: string) => {
  const [prices, setPrices] = useState<MarketPrice[]>([]);
  const [trends, setTrends] = useState<MarketPrice[]>([]);
  const [recommendation, setRecommendation] = useState<Recommendation | null>(null);
  const [crops, setCrops] = useState<string[]>([]);
  const [districts, setDistricts] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchFilters = useCallback(async () => {
    try {
      const [cropsRes, districtsRes] = await Promise.all([
        axios.get(`${API_URL}/api/market-prices/crops`),
        axios.get(`${API_URL}/api/market-prices/districts`)
      ]);
      setCrops(cropsRes.data);
      setDistricts(districtsRes.data);
    } catch (err: any) {
      console.error('Failed to fetch market filters:', err.message);
    }
  }, []);

  const fetchData = useCallback(async () => {
    if (!selectedCrop || !selectedDistrict) return;
    
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('token');
      const headers = { Authorization: `Bearer ${token}` };

      const [pricesRes, trendsRes] = await Promise.all([
        axios.get(`${API_URL}/api/market-prices`, {
          params: { cropName: selectedCrop, district: selectedDistrict },
          headers
        }),
        axios.get(`${API_URL}/api/market-prices/trends`, {
          params: { cropName: selectedCrop, district: selectedDistrict },
          headers
        })
      ]);

      setPrices(pricesRes.data);
      setTrends(trendsRes.data.trends);
      setRecommendation(trendsRes.data.recommendation);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch market data');
    } finally {
      setLoading(false);
    }
  }, [selectedCrop, selectedDistrict]);

  useEffect(() => {
    fetchFilters();
  }, [fetchFilters]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
    prices,
    trends,
    recommendation,
    crops,
    districts,
    loading,
    error,
    refresh: fetchData
  };
};
