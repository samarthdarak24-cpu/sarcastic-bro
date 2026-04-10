// ========================================================================
// Marketplace Store - Zustand State Management
// ========================================================================

import { create } from 'zustand';

interface Crop {
  id: string;
  cropName: string;
  category: string;
  variety: string;
  quantity: number;
  pricePerKg: number;
  grade: string;
  status: string;
  qualityCertUrl?: string;
}

interface AggregatedLot {
  id: string;
  cropName: string;
  totalQuantity: number;
  pricePerKg: number;
  qualityCertUrl?: string;
  status: string;
  fpo: {
    name: string;
    district: string;
  };
}

interface Filters {
  crop?: string;
  grade?: string;
  district?: string;
  minQty?: number;
  maxPrice?: number;
}

interface MarketplaceState {
  lots: AggregatedLot[];
  crops: Crop[];
  filters: Filters;
  loading: boolean;
  
  // Actions
  setLots: (lots: AggregatedLot[]) => void;
  setCrops: (crops: Crop[]) => void;
  setFilters: (filters: Filters) => void;
  setLoading: (loading: boolean) => void;
  clearFilters: () => void;
}

export const useMarketplaceStore = create<MarketplaceState>((set) => ({
  lots: [],
  crops: [],
  filters: {},
  loading: false,

  setLots: (lots) => set({ lots }),
  setCrops: (crops) => set({ crops }),
  setFilters: (filters) => set((state) => ({ filters: { ...state.filters, ...filters } })),
  setLoading: (loading) => set({ loading }),
  clearFilters: () => set({ filters: {} }),
}));
