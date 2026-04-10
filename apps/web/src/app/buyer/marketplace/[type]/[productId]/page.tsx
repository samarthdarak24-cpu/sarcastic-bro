'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import buyerAPI, { MarketplaceProduct } from '@/services/buyer';
import { 
  Loader2, MapPin, Star, ArrowLeft, Package, User, 
  FileText, Shield, ChevronDown, ChevronUp, ShoppingCart 
} from 'lucide-react';

export default function ProductDetailsPage() {
  const router = useRouter();
  const params = useParams();
  const productId = params.productId as string;
  const productType = params.type as 'crop' | 'lot';

  const [product, setProduct] = useState<any>(null);
  const [certificates, setCertificates] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCertViewer, setShowCertViewer] = useState(false);
  const [selectedCert, setSelectedCert] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(10);
  const [showOrderForm, setShowOrderForm] = useState(false);

  useEffect(() => {
    fetchProductDetails();
    fetchCertificates();
  }, [productId, productType]);

  const fetchProductDetails = async () => {
    try {
      const response = await buyerAPI.getProductDetails(productType, productId);
      setProduct(response.data.data);
    } catch (error: any) {
      console.error('Failed to fetch product:', error);
      alert(error.message || 'Failed to load product details');
      router.push('/buyer/marketplace');
    } finally {
      setLoading(false);
    }
  };

  const fetchCertificates = async () => {
    try {
      const response = await buyerAPI.getProductQuality(productType, productId);
      setCertificates(response.data.data || []);
    } catch (error) {
      console.error('Failed to fetch certificates:', error);
    }
  };

  const handlePlaceOrder = () => {
    if (!product) return;
    
    const maxQuantity = product.totalQuantity || product.quantity;
    if (quantity <= 0 || quantity > maxQuantity) {
      alert(`Quantity must be between 1 and ${maxQuantity} kg`);
      return;
    }

    // Navigate to order page
    router.push(`/buyer/marketplace/${productType}/${productId}/order?quantity=${quantity}`);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-green-600" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Package className="w-16 h-16 mx-auto text-gray-400 mb-4" />
          <p className="text-gray-600 text-lg">Product not found</p>
          <button
            onClick={() => router.push('/buyer/marketplace')}
            className="mt-4 text-green-600 hover:text-green-700"
          >
            Back to Marketplace
          </button>
        </div>
      </div>
    );
  }

  const totalPrice = quantity * product.pricePerKg;
  const maxQuantity = product.totalQuantity || product.quantity;

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      {/* Back Button */}
      <button
        onClick={() => router.push('/buyer/marketplace')}
        className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Marketplace
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column - Product Info */}
        <div>
          {/* Product Image */}
          <div className="bg-gray-200 rounded-lg overflow-hidden mb-6 h-96">
            <img
              src="/images/crops/default.jpg"
              alt={product.cropName}
              className="w-full h-full object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).style.background = '#e5e7eb';
              }}
            />
          </div>

          {/* Basic Info */}
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h1 className="text-3xl font-bold mb-2">{product.cropName}</h1>
                {product.variety && (
                  <p className="text-gray-600">Variety: {product.variety}</p>
                )}
              </div>
              {product.grade && (
                <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                  product.grade === 'A' ? 'bg-green-100 text-green-800' :
                  product.grade === 'B' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-orange-100 text-orange-800'
                }`}>
                  Grade {product.grade}
                </span>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600 mb-1">Price</p>
                <p className="text-2xl font-bold text-green-600">₹{product.pricePerKg}/kg</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600 mb-1">Available Quantity</p>
                <p className="text-2xl font-bold">{maxQuantity} kg</p>
              </div>
            </div>

            {product.averageGrade && (
              <div className="mb-4">
                <p className="text-sm text-gray-600">Average Grade</p>
                <p className="font-semibold">Grade {product.averageGrade}</p>
              </div>
            )}

            {product.numberOfFarmers && (
              <div className="mb-4">
                <p className="text-sm text-gray-600">Number of Farmers</p>
                <p className="font-semibold">{product.numberOfFarmers} farmers</p>
              </div>
            )}

            {(product.location?.district || product.fpo?.district) && (
              <div className="flex items-center gap-2 text-gray-600">
                <MapPin className="w-5 h-5" />
                <span>{product.location?.district || product.fpo?.district}, {product.location?.state || product.fpo?.state}</span>
              </div>
            )}
          </div>

          {/* Certificates */}
          {certificates.length > 0 && (
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <Shield className="w-5 h-5 text-green-600" />
                Quality Certificates
              </h2>
              
              <div className="space-y-3">
                {certificates.map((cert: any, index: number) => (
                  <div key={cert.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <FileText className="w-4 h-4 text-blue-600" />
                          <p className="font-semibold">Certificate #{index + 1}</p>
                        </div>
                        
                        {cert.aiScore && (
                          <div className="mb-2">
                            <span className="text-sm text-gray-600">AI Quality Score: </span>
                            <span className={`font-bold ${
                              cert.aiScore >= 80 ? 'text-green-600' :
                              cert.aiScore >= 60 ? 'text-yellow-600' :
                              'text-red-600'
                            }`}>
                              {cert.aiScore}/100
                            </span>
                          </div>
                        )}

                        {cert.certifiedBy && (
                          <p className="text-sm text-gray-600">
                            Certified by: {cert.certifiedBy}
                          </p>
                        )}

                        <p className="text-sm text-gray-500 mt-1">
                          Uploaded: {new Date(cert.uploadedAt).toLocaleDateString()}
                        </p>
                      </div>

                      {cert.certificateUrl && (
                        <button
                          onClick={() => {
                            setSelectedCert(cert.certificateUrl);
                            setShowCertViewer(true);
                          }}
                          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm"
                        >
                          View PDF
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Column - Seller Info & Order */}
        <div>
          {/* Seller Information */}
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <User className="w-5 h-5 text-green-600" />
              Seller Information
            </h2>

            {product.type === 'AGGREGATED' && product.fpo ? (
              <div>
                <p className="font-semibold text-lg mb-2">{product.fpo.name}</p>
                <p className="text-sm text-gray-600 mb-1">
                  Registration: {product.fpo.registrationNo || 'N/A'}
                </p>
                <p className="text-sm text-gray-600">
                  Location: {product.fpo.district}, {product.fpo.state}
                </p>
              </div>
            ) : (
              <div>
                <p className="font-semibold text-lg mb-2">{product.supplier?.name || 'Farmer'}</p>
                {product.supplier?.farm && (
                  <p className="text-sm text-gray-600">
                    Farm: {product.supplier.farm.district}, {product.supplier.farm.state}
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Order Form */}
          <div className="bg-white rounded-lg shadow p-6 sticky top-4">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <ShoppingCart className="w-5 h-5 text-green-600" />
              Place Order
            </h2>

            <div className="space-y-4">
              {/* Quantity Selector */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Quantity (kg)
                </label>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setQuantity(q => Math.max(10, q - 10))}
                    className="px-3 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
                  >
                    -
                  </button>
                  <input
                    type="number"
                    value={quantity}
                    onChange={(e) => setQuantity(Math.max(1, Math.min(maxQuantity, parseInt(e.target.value) || 1)))}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-center"
                    min="1"
                    max={maxQuantity}
                  />
                  <button
                    onClick={() => setQuantity(q => Math.min(maxQuantity, q + 10))}
                    className="px-3 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
                  >
                    +
                  </button>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Min: 1 kg | Max: {maxQuantity} kg
                </p>
              </div>

              {/* Price Calculator */}
              <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Price per kg:</span>
                  <span>₹{product.pricePerKg}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Quantity:</span>
                  <span>{quantity} kg</span>
                </div>
                <div className="border-t border-gray-300 pt-2 mt-2">
                  <div className="flex justify-between font-bold text-lg">
                    <span>Total:</span>
                    <span className="text-green-600">₹{totalPrice.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              {/* Place Order Button */}
              <button
                onClick={handlePlaceOrder}
                disabled={quantity <= 0 || quantity > maxQuantity}
                className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition-colors font-bold text-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Proceed to Order
              </button>

              <p className="text-xs text-gray-500 text-center">
                Payment will be held in escrow until delivery is confirmed
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Certificate Viewer Modal */}
      {showCertViewer && selectedCert && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b">
              <h3 className="text-lg font-bold">Quality Certificate</h3>
              <button
                onClick={() => {
                  setShowCertViewer(false);
                  setSelectedCert(null);
                }}
                className="text-gray-600 hover:text-gray-900"
              >
                ✕
              </button>
            </div>
            <div className="h-[calc(90vh-120px)] overflow-auto">
              <iframe
                src={selectedCert}
                className="w-full h-full border-0"
                title="Certificate Viewer"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
