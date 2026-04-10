'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams, useSearchParams } from 'next/navigation';
import buyerAPI from '@/services/buyer';
import { Loader2, ArrowLeft, Wallet, MapPin, CheckCircle, AlertCircle } from 'lucide-react';

export default function OrderPlacementPage() {
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();
  
  const productId = params.productId as string;
  const productType = params.type as 'crop' | 'lot';
  const initialQuantity = parseInt(searchParams.get('quantity') || '10');

  const [product, setProduct] = useState<any>(null);
  const [wallet, setWallet] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [placingOrder, setPlacingOrder] = useState(false);
  
  const [formData, setFormData] = useState({
    quantity: initialQuantity,
    deliveryAddress: '',
    deliveryDate: '',
    notes: '',
  });

  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    fetchProductDetails();
    fetchWalletBalance();
  }, [productId, productType]);

  const fetchProductDetails = async () => {
    try {
      const response = await buyerAPI.getProductDetails(productType, productId);
      setProduct(response.data.data);
    } catch (error: any) {
      console.error('Failed to fetch product:', error);
      alert(error.message || 'Failed to load product details');
      router.push('/buyer/marketplace');
    }
  };

  const fetchWalletBalance = async () => {
    try {
      const response = await buyerAPI.getWallet();
      setWallet(response.data.data);
    } catch (error) {
      console.error('Failed to fetch wallet:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validation
    const maxQuantity = product?.totalQuantity || product?.quantity || 0;
    if (formData.quantity <= 0 || formData.quantity > maxQuantity) {
      setError(`Quantity must be between 1 and ${maxQuantity} kg`);
      return;
    }

    if (!formData.deliveryAddress.trim()) {
      setError('Delivery address is required');
      return;
    }

    const totalAmount = formData.quantity * (product?.pricePerKg || 0);
    if (wallet && wallet.balance < totalAmount) {
      setError(`Insufficient wallet balance. Required: ₹${totalAmount.toLocaleString()}, Available: ₹${wallet.balance.toLocaleString()}`);
      return;
    }

    setPlacingOrder(true);

    try {
      const orderData = {
        productId,
        productType,
        quantity: formData.quantity,
        deliveryAddress: formData.deliveryAddress,
        deliveryDate: formData.deliveryDate || undefined,
        notes: formData.notes || undefined,
      };

      const response = await buyerAPI.placeOrder(orderData);
      
      setSuccess(true);
      
      // Redirect to orders page after 2 seconds
      setTimeout(() => {
        router.push('/buyer/orders');
      }, 2000);
    } catch (error: any) {
      console.error('Order placement failed:', error);
      setError(error.response?.data?.message || error.message || 'Failed to place order');
    } finally {
      setPlacingOrder(false);
    }
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
        <p className="text-gray-600">Product not found</p>
      </div>
    );
  }

  if (success) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center max-w-md mx-auto p-8">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-12 h-12 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold mb-4">Order Placed Successfully!</h1>
          <p className="text-gray-600 mb-6">
            Your order has been placed and payment is held in escrow. You will be redirected to your orders page.
          </p>
          <button
            onClick={() => router.push('/buyer/orders')}
            className="bg-green-600 text-white px-8 py-3 rounded-lg hover:bg-green-700 font-medium"
          >
            View Orders
          </button>
        </div>
      </div>
    );
  }

  const totalAmount = formData.quantity * product.pricePerKg;
  const platformFee = totalAmount * 0.02; // 2% platform fee
  const finalAmount = totalAmount + platformFee;
  const hasSufficientBalance = wallet && wallet.balance >= finalAmount;

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* Back Button */}
      <button
        onClick={() => router.push(`/buyer/marketplace/${productType}/${productId}`)}
        className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Product
      </button>

      <h1 className="text-3xl font-bold mb-8">Place Order</h1>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - Order Details */}
          <div>
            {/* Product Summary */}
            <div className="bg-white rounded-lg shadow p-6 mb-6">
              <h2 className="text-xl font-bold mb-4">Product Summary</h2>
              
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Product:</span>
                  <span className="font-semibold">{product.cropName}</span>
                </div>
                {product.variety && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Variety:</span>
                    <span>{product.variety}</span>
                  </div>
                )}
                {product.grade && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Grade:</span>
                    <span className="font-semibold">Grade {product.grade}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-gray-600">Price per kg:</span>
                  <span className="font-semibold">₹{product.pricePerKg}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Available:</span>
                  <span>{product.totalQuantity || product.quantity} kg</span>
                </div>
              </div>
            </div>

            {/* Order Form */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-bold mb-4">Order Details</h2>

              <div className="space-y-4">
                {/* Quantity */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Quantity (kg) *
                  </label>
                  <input
                    type="number"
                    value={formData.quantity}
                    onChange={(e) => setFormData(prev => ({ ...prev, quantity: parseInt(e.target.value) || 1 }))}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                    min="1"
                    max={product.totalQuantity || product.quantity}
                    required
                  />
                </div>

                {/* Delivery Address */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <MapPin className="w-4 h-4 inline mr-1" />
                    Delivery Address *
                  </label>
                  <textarea
                    value={formData.deliveryAddress}
                    onChange={(e) => setFormData(prev => ({ ...prev, deliveryAddress: e.target.value }))}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                    rows={3}
                    placeholder="Enter complete delivery address"
                    required
                  />
                </div>

                {/* Delivery Date */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Preferred Delivery Date (Optional)
                  </label>
                  <input
                    type="date"
                    value={formData.deliveryDate}
                    onChange={(e) => setFormData(prev => ({ ...prev, deliveryDate: e.target.value }))}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                    min={new Date().toISOString().split('T')[0]}
                  />
                </div>

                {/* Notes */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Additional Notes (Optional)
                  </label>
                  <textarea
                    value={formData.notes}
                    onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                    rows={2}
                    placeholder="Any special instructions"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Payment Summary */}
          <div>
            {/* Wallet Balance */}
            <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg shadow-lg p-6 mb-6 text-white">
              <div className="flex items-center gap-3 mb-3">
                <Wallet className="w-6 h-6" />
                <h3 className="text-lg font-bold">Wallet Balance</h3>
              </div>
              <p className="text-4xl font-bold">₹{wallet?.balance.toLocaleString() || 0}</p>
              {!hasSufficientBalance && wallet && (
                <div className="mt-4 bg-red-100 text-red-800 px-4 py-2 rounded-lg text-sm">
                  <AlertCircle className="w-4 h-4 inline mr-2" />
                  Insufficient balance
                </div>
              )}
            </div>

            {/* Payment Breakdown */}
            <div className="bg-white rounded-lg shadow p-6 mb-6">
              <h2 className="text-xl font-bold mb-4">Payment Breakdown</h2>
              
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span>Product Cost ({formData.quantity} kg × ₹{product.pricePerKg}):</span>
                  <span className="font-semibold">₹{totalAmount.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Platform Fee (2%):</span>
                  <span className="font-semibold">₹{platformFee.toLocaleString()}</span>
                </div>
                <div className="border-t border-gray-300 pt-3 mt-3">
                  <div className="flex justify-between font-bold text-lg">
                    <span>Total Amount:</span>
                    <span className="text-green-600">₹{finalAmount.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              <div className="mt-4 bg-blue-50 border border-blue-200 rounded-lg p-3">
                <p className="text-sm text-blue-800">
                  💡 Payment will be held in escrow and released to seller only after you confirm delivery
                </p>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-red-800">{error}</p>
                </div>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={placingOrder || !hasSufficientBalance}
              className="w-full bg-green-600 text-white py-4 rounded-lg hover:bg-green-700 transition-colors font-bold text-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {placingOrder ? (
                <span className="flex items-center justify-center gap-2">
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Processing Order...
                </span>
              ) : (
                `Confirm & Pay ₹${finalAmount.toLocaleString()}`
              )}
            </button>

            <p className="text-xs text-gray-500 text-center mt-3">
              By placing this order, you agree to our terms and conditions
            </p>
          </div>
        </div>
      </form>
    </div>
  );
}
