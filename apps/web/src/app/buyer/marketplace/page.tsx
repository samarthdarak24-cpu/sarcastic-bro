'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import buyerAPI, { MarketplaceProduct } from '@/services/buyer';
import { Loader2, MapPin, Star, Filter, Package, Search, SlidersHorizontal } from 'lucide-react';

export default function MarketplacePage() {
  const router = useRouter();
  const [products, setProducts] = useState<MarketplaceProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    cropName: '',
    category: '',
    minGrade: '',
    district: '',
    state: '',
    minQuantity: '',
    maxPrice: '',
  });
  const [showFilters, setShowFilters] = useState(false);
  const [availableFilters, setAvailableFilters] = useState<any>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchFilters();
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [page, filters]);

  const fetchFilters = async () => {
    try {
      const response = await buyerAPI.getAvailableFilters();
      setAvailableFilters(response.data.data);
    } catch (error) {
      console.error('Failed to fetch filters:', error);
    }
  };

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const params: any = { page, limit: 20 };
      
      if (filters.cropName) params.cropName = filters.cropName;
      if (filters.category) params.category = filters.category;
      if (filters.minGrade) params.minGrade = filters.minGrade;
      if (filters.district) params.district = filters.district;
      if (filters.minQuantity) params.minQuantity = parseFloat(filters.minQuantity);
      if (filters.maxPrice) params.maxPrice = parseFloat(filters.maxPrice);

      const response = await buyerAPI.getProducts(params);
      const data = response.data.data;
      
      // Combine aggregated lots and individual crops
      const allProducts = [
        ...data.aggregatedLots.map((lot: any) => ({ ...lot, type: 'AGGREGATED' as const })),
        ...data.individualCrops.map((crop: any) => ({ ...crop, type: 'INDIVIDUAL' as const }))
      ];
      
      setProducts(allProducts);
      setTotalPages(data.pagination.totalPages);
    } catch (error) {
      console.error('Failed to fetch products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setPage(1); // Reset to first page on filter change
  };

  const clearFilters = () => {
    setFilters({
      cropName: '',
      category: '',
      minGrade: '',
      district: '',
      state: '',
      minQuantity: '',
      maxPrice: '',
    });
    setPage(1);
  };

  const getGradeColor = (grade?: string) => {
    switch (grade) {
      case 'A': return 'bg-green-100 text-green-800';
      case 'B': return 'bg-yellow-100 text-yellow-800';
      case 'C': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getProductImage = (product: MarketplaceProduct) => {
    // Use placeholder images based on crop name
    const cropImages: Record<string, string> = {
      'Wheat': '/images/crops/wheat.jpg',
      'Rice': '/images/crops/rice.jpg',
      'Tomato': '/images/crops/tomato.jpg',
      'Potato': '/images/crops/potato.jpg',
      'Onion': '/images/crops/onion.jpg',
    };
    
    return cropImages[product.cropName] || '/images/crops/default.jpg';
  };

  if (loading && products.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-green-600" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Aggregated Marketplace</h1>
        <p className="text-gray-600">Browse quality crops from farmers and FPOs</p>
      </div>

      <div className="flex gap-6">
        {/* Filters Sidebar */}
        <div className={`w-64 flex-shrink-0 ${showFilters ? 'block' : 'hidden lg:block'}`}>
          <div className="bg-white rounded-lg shadow p-6 sticky top-4">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold flex items-center gap-2">
                <Filter className="w-5 h-5" />
                Filters
              </h2>
              <button
                onClick={clearFilters}
                className="text-sm text-green-600 hover:text-green-700"
              >
                Clear All
              </button>
            </div>

            <div className="space-y-4">
              {/* Crop Name Search */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Crop Name
                </label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    value={filters.cropName}
                    onChange={(e) => handleFilterChange('cropName', e.target.value)}
                    placeholder="Search crops..."
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                  />
                </div>
              </div>

              {/* Category */}
              {availableFilters?.categories && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category
                  </label>
                  <select
                    value={filters.category}
                    onChange={(e) => handleFilterChange('category', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                  >
                    <option value="">All Categories</option>
                    {availableFilters.categories.map((cat: string) => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
              )}

              {/* Quality Grade */}
              {availableFilters?.grades && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Minimum Grade
                  </label>
                  <select
                    value={filters.minGrade}
                    onChange={(e) => handleFilterChange('minGrade', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                  >
                    <option value="">All Grades</option>
                    {availableFilters.grades.map((grade: string) => (
                      <option key={grade} value={grade}>Grade {grade} & Above</option>
                    ))}
                  </select>
                </div>
              )}

              {/* Location */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  District
                </label>
                <select
                  value={filters.district}
                  onChange={(e) => handleFilterChange('district', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                >
                  <option value="">All Locations</option>
                  {availableFilters?.locations?.map((loc: any) => (
                    <option key={loc.district} value={loc.district}>
                      {loc.district}, {loc.state}
                    </option>
                  ))}
                </select>
              </div>

              {/* Min Quantity */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Min Quantity (kg)
                </label>
                <input
                  type="number"
                  value={filters.minQuantity}
                  onChange={(e) => handleFilterChange('minQuantity', e.target.value)}
                  placeholder="e.g., 100"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                />
              </div>

              {/* Max Price */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Max Price (₹/kg)
                </label>
                <input
                  type="number"
                  value={filters.maxPrice}
                  onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
                  placeholder="e.g., 50"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Products Grid */}
        <div className="flex-1">
          {/* Mobile Filter Toggle */}
          <div className="lg:hidden mb-4">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg"
            >
              <SlidersHorizontal className="w-4 h-4" />
              {showFilters ? 'Hide Filters' : 'Show Filters'}
            </button>
          </div>

          {products.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-lg shadow">
              <Package className="w-16 h-16 mx-auto text-gray-400 mb-4" />
              <p className="text-gray-600 text-lg">No products available</p>
              <p className="text-gray-500 mt-2">Try adjusting your filters</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {products.map((product) => (
                  <div
                    key={product.id}
                    className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow cursor-pointer"
                    onClick={() => router.push(`/buyer/marketplace/${product.type === 'AGGREGATED' ? 'lot' : 'crop'}/${product.id}`)}
                  >
                    {/* Product Image */}
                    <div className="h-48 bg-gray-200 relative overflow-hidden">
                      <img
                        src={getProductImage(product)}
                        alt={product.cropName}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = '/images/crops/default.jpg';
                        }}
                      />
                      <div className="absolute top-2 right-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                          product.type === 'AGGREGATED' ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800'
                        }`}>
                          {product.type === 'AGGREGATED' ? 'FPO Lot' : 'Individual'}
                        </span>
                      </div>
                    </div>

                    {/* Product Info */}
                    <div className="p-4">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="font-bold text-lg flex-1">{product.cropName}</h3>
                        {product.grade && (
                          <span className={`px-2 py-1 rounded text-xs font-semibold ${getGradeColor(product.grade)}`}>
                            Grade {product.grade}
                          </span>
                        )}
                      </div>

                      {product.variety && (
                        <p className="text-sm text-gray-600 mb-2">{product.variety}</p>
                      )}

                      <div className="space-y-2 mb-4">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-600">Price:</span>
                          <span className="font-bold text-green-600">₹{product.pricePerKg}/kg</span>
                        </div>
                        
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-600">Quantity:</span>
                          <span className="font-semibold">{(product.totalQuantity || product.quantity)} kg</span>
                        </div>

                        {product.averageGrade && (
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-600">Avg Grade:</span>
                            <span className="font-semibold">Grade {product.averageGrade}</span>
                          </div>
                        )}

                        {product.numberOfFarmers && (
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-600">Farmers:</span>
                            <span className="font-semibold">{product.numberOfFarmers}</span>
                          </div>
                        )}

                        {(product.location?.district || product.fpo?.district) && (
                          <div className="flex items-center gap-1 text-sm text-gray-600">
                            <MapPin className="w-4 h-4" />
                            <span>{product.location?.district || product.fpo?.district}, {product.location?.state || product.fpo?.state}</span>
                          </div>
                        )}
                      </div>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          router.push(`/buyer/marketplace/${product.type === 'AGGREGATED' ? 'lot' : 'crop'}/${product.id}`);
                        }}
                        className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition-colors font-medium"
                      >
                        View Details
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 mt-8">
                  <button
                    onClick={() => setPage(p => Math.max(1, p - 1))}
                    disabled={page === 1}
                    className="px-4 py-2 bg-white border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                  >
                    Previous
                  </button>
                  
                  <span className="px-4 py-2">
                    Page {page} of {totalPages}
                  </span>

                  <button
                    onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                    disabled={page === totalPages}
                    className="px-4 py-2 bg-white border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                  >
                    Next
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
