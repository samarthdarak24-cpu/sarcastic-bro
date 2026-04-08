'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { productService } from '@/services/productService';
import { useSocket } from '@/hooks/useSocket';

interface Product {
  id: string;
  name: string;
  category: string;
  quantity: number;
  unit: string;
  price: number;
  grade: string;
  description: string;
  farmerId: string;
  createdAt: string;
  status: 'ACTIVE' | 'INACTIVE' | 'SOLD_OUT';
  offers?: number;
  orders?: number;
}

interface Offer {
  id: string;
  buyerId: string;
  buyerName: string;
  quantity: number;
  proposedPrice: number;
  status: 'PENDING' | 'ACCEPTED' | 'REJECTED';
  createdAt: string;
}

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const socket = useSocket();
  const productId = params.id as string;

  const [product, setProduct] = useState<Product | null>(null);
  const [offers, setOffers] = useState<Offer[]>([]);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    price: 0,
    quantity: 0,
    description: '',
    status: 'ACTIVE' as const,
  });

  useEffect(() => {
    loadProduct();
  }, [productId]);

  useEffect(() => {
    if (!socket) return;
    socket.on(`product:${productId}:offer`, (newOffer: Offer) => {
      setOffers((prev) => [newOffer, ...prev]);
    });
    socket.on(`product:${productId}:updated`, (updatedProduct: Product) => {
      setProduct(updatedProduct);
    });
    return () => {
      socket.off(`product:${productId}:offer`);
      socket.off(`product:${productId}:updated`);
    };
  }, [socket, productId]);

  const loadProduct = async () => {
    try {
      setLoading(true);
      const response = await productService.getProductById(productId);
      const prod = response.data;
      setProduct(prod);
      setFormData({
        price: prod.price,
        quantity: prod.quantity,
        description: prod.description,
        status: prod.status,
      });

      // Load offers for this product
      const offersResponse = await productService.getProductOffers(productId);
      setOffers(offersResponse.data || []);
    } catch (err) {
      console.error('Failed to load product:', err);
      // Mock data
      setProduct({
        id: productId,
        name: 'Organic Wheat',
        category: 'Cereals',
        quantity: 500,
        unit: 'kg',
        price: 45,
        grade: 'A+',
        description: 'Premium organic wheat from verified farm',
        farmerId: 'farmer1',
        createdAt: new Date().toISOString(),
        status: 'ACTIVE',
        offers: 3,
        orders: 5,
      });
      setOffers([
        {
          id: '1',
          buyerId: 'buyer1',
          buyerName: 'Green Valley Enterprises',
          quantity: 100,
          proposedPrice: 42,
          status: 'PENDING',
          createdAt: new Date().toISOString(),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      await productService.updateProduct(productId, formData);
      setProduct((prev) =>
        prev ? { ...prev, ...formData } : null
      );
      setEditMode(false);
    } catch (err) {
      console.error('Failed to save product:', err);
    }
  };

  const handleAcceptOffer = async (offerId: string) => {
    try {
      await productService.respondToOffer(offerId, 'ACCEPTED');
      setOffers((prev) =>
        prev.map((o) =>
          o.id === offerId ? { ...o, status: 'ACCEPTED' } : o
        )
      );
    } catch (err) {
      console.error('Failed to accept offer:', err);
    }
  };

  const handleRejectOffer = async (offerId: string) => {
    try {
      await productService.respondToOffer(offerId, 'REJECTED');
      setOffers((prev) =>
        prev.map((o) =>
          o.id === offerId ? { ...o, status: 'REJECTED' } : o
        )
      );
    } catch (err) {
      console.error('Failed to reject offer:', err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-slate-950 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 bg-green-200 dark:bg-green-900/30 rounded-full animate-pulse mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400">Loading product details...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-slate-950 flex items-center justify-center">
        <div className="text-center">
          <span className="material-symbols-outlined text-6xl text-gray-300 dark:text-slate-700 block mb-4">
            error_outline
          </span>
          <p className="text-gray-600 dark:text-gray-400 mb-6">Product not found</p>
          <Link
            href="/farmer/products"
            className="inline-flex items-center gap-2 bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700"
          >
            Back to Products
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 dark:from-slate-950 dark:to-slate-900">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-white/80 dark:bg-slate-900/80 backdrop-blur-lg border-b border-green-200 dark:border-slate-700">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <Link
              href="/farmer/products"
              className="flex items-center gap-2 text-green-600 hover:text-green-700 font-semibold"
            >
              <span className="material-symbols-outlined">arrow_back</span>
              Back
            </Link>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              {product.name}
            </h1>
            <button
              onClick={() => setEditMode(!editMode)}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700"
            >
              {editMode ? 'Cancel' : 'Edit'}
            </button>
          </div>
        </div>
      </div>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Product Info */}
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-slate-800 rounded-2xl overflow-hidden shadow-lg">
              {/* Image */}
              <div className="aspect-video bg-gradient-to-br from-green-100 to-blue-100 dark:from-slate-700 dark:to-slate-600 flex items-center justify-center">
                <span className="material-symbols-outlined text-6xl text-gray-400 dark:text-slate-500">
                  agriculture
                </span>
              </div>

              {/* Product Details */}
              <div className="p-8">
                {editMode ? (
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                        Price (₹/{product.unit})
                      </label>
                      <input
                        type="number"
                        value={formData.price}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            price: parseFloat(e.target.value),
                          })
                        }
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-white font-semibold text-lg"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                        Available Quantity ({product.unit})
                      </label>
                      <input
                        type="number"
                        value={formData.quantity}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            quantity: parseFloat(e.target.value),
                          })
                        }
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-white font-semibold"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                        Description
                      </label>
                      <textarea
                        value={formData.description}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            description: e.target.value,
                          })
                        }
                        rows={5}
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-white"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                        Status
                      </label>
                      <select
                        value={formData.status}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            status: e.target.value as any,
                          })
                        }
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-white font-semibold"
                      >
                        <option value="ACTIVE">Active</option>
                        <option value="INACTIVE">Inactive</option>
                        <option value="SOLD_OUT">Sold Out</option>
                      </select>
                    </div>

                    <button
                      onClick={handleSave}
                      className="w-full bg-green-600 text-white py-3 rounded-lg font-bold hover:bg-green-700 transition-all"
                    >
                      Save Changes
                    </button>
                  </div>
                ) : (
                  <div className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
                        <p className="text-xs text-gray-600 dark:text-gray-400 uppercase tracking-wide font-semibold">
                          Price
                        </p>
                        <p className="text-3xl font-bold text-green-600 dark:text-green-400 mt-2">
                          ₹{product.price}
                        </p>
                      </div>
                      <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                        <p className="text-xs text-gray-600 dark:text-gray-400 uppercase tracking-wide font-semibold">
                          Stock
                        </p>
                        <p className="text-3xl font-bold text-blue-600 dark:text-blue-400 mt-2">
                          {product.quantity}
                        </p>
                      </div>
                    </div>

                    <div>
                      <p className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-2 uppercase tracking-wide">
                        Description
                      </p>
                      <p className="text-gray-700 dark:text-gray-300 text-lg leading-relaxed">
                        {product.description}
                      </p>
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                      <div className="text-center p-4 bg-gray-50 dark:bg-slate-700 rounded-lg">
                        <p className="text-2xl font-bold text-gray-900 dark:text-white">
                          {product.grade}
                        </p>
                        <p className="text-xs text-gray-600 dark:text-gray-400 uppercase tracking-wide font-semibold mt-1">
                          Grade
                        </p>
                      </div>
                      <div className="text-center p-4 bg-gray-50 dark:bg-slate-700 rounded-lg">
                        <p className="text-2xl font-bold text-gray-900 dark:text-white">
                          {product.offers || 0}
                        </p>
                        <p className="text-xs text-gray-600 dark:text-gray-400 uppercase tracking-wide font-semibold mt-1">
                          Offers
                        </p>
                      </div>
                      <div className="text-center p-4 bg-gray-50 dark:bg-slate-700 rounded-lg">
                        <p className="text-2xl font-bold text-gray-900 dark:text-white">
                          {product.orders || 0}
                        </p>
                        <p className="text-xs text-gray-600 dark:text-gray-400 uppercase tracking-wide font-semibold mt-1">
                          Orders
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Offers Sidebar */}
          <div>
            <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <span className="material-symbols-outlined">local_offer</span>
                Offers ({offers.length})
              </h2>

              <div className="space-y-4 max-h-[600px] overflow-y-auto">
                {offers.length === 0 ? (
                  <p className="text-gray-500 dark:text-gray-400 text-center py-8">
                    No offers yet
                  </p>
                ) : (
                  offers.map((offer) => (
                    <div
                      key={offer.id}
                      className={`p-4 rounded-lg border-2 transition-all ${
                        offer.status === 'ACCEPTED'
                          ? 'bg-green-50 dark:bg-green-900/20 border-green-300 dark:border-green-700'
                          : offer.status === 'REJECTED'
                          ? 'bg-red-50 dark:bg-red-900/20 border-red-300 dark:border-red-700'
                          : 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-300 dark:border-yellow-700'
                      }`}
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <p className="font-semibold text-gray-900 dark:text-white">
                            {offer.buyerName}
                          </p>
                          <p className="text-xs text-gray-600 dark:text-gray-400">
                            {new Date(offer.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                        <span
                          className={`text-xs font-bold px-2 py-1 rounded-full ${
                            offer.status === 'ACCEPTED'
                              ? 'bg-green-200 dark:bg-green-700/50 text-green-800 dark:text-green-200'
                              : offer.status === 'REJECTED'
                              ? 'bg-red-200 dark:bg-red-700/50 text-red-800 dark:text-red-200'
                              : 'bg-yellow-200 dark:bg-yellow-700/50 text-yellow-800 dark:text-yellow-200'
                          }`}
                        >
                          {offer.status}
                        </span>
                      </div>

                      <div className="mb-3">
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {offer.quantity} {product.unit} @ ₹{offer.proposedPrice}
                        </p>
                        <p className="font-bold text-lg text-gray-900 dark:text-white">
                          Total: ₹{offer.quantity * offer.proposedPrice}
                        </p>
                      </div>

                      {offer.status === 'PENDING' && (
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleAcceptOffer(offer.id)}
                            className="flex-1 bg-green-600 text-white py-2 rounded font-semibold hover:bg-green-700 transition-all"
                          >
                            Accept
                          </button>
                          <button
                            onClick={() => handleRejectOffer(offer.id)}
                            className="flex-1 bg-red-600 text-white py-2 rounded font-semibold hover:bg-red-700 transition-all"
                          >
                            Reject
                          </button>
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
