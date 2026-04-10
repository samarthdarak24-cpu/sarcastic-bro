import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Package, Upload, Plus, CheckCircle, Image as ImageIcon, X, 
  TrendingUp, Calendar, MapPin, Leaf, Award, Eye, Edit2, 
  Trash2, BarChart3, DollarSign, Clock, AlertCircle, Camera,
  Sparkles, Zap, Target, Users, Star, ShoppingCart, Save, Copy,
  FileText, Wand2, TrendingDown, Filter, Search, Download,
  RefreshCw, Bell, Settings, ChevronDown, Info, Lightbulb,
  BarChart2, PieChart, Activity, ArrowUpRight, ArrowDownRight
} from 'lucide-react';

export default function CropListing() {
  const [isPublishing, setIsPublishing] = useState(false);
  const [success, setSuccess] = useState(false);
  const [activeTab, setActiveTab] = useState<'create' | 'manage' | 'analytics'>('create');
  const [showPreview, setShowPreview] = useState(false);
  
  // Real Form State
  const [formData, setFormData] = useState({
    cropName: '',
    category: 'Vegetables',
    variety: '',
    quantity: '',
    pricePerKg: '',
    harvestDate: '',
    location: '',
    organicCertified: false,
    description: '',
    minOrderQty: '',
  });
  
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [myListings, setMyListings] = useState<any[]>([]);
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);

  // Analytics mock data
  const [analytics, setAnalytics] = useState({
    totalViews: 1247,
    totalOrders: 23,
    revenue: 45600,
    avgRating: 4.8,
  });

  // Fetch real listings on mount
  useEffect(() => {
    fetchListings();
  }, []);

  const fetchListings = async () => {
    try {
      const userStr = localStorage.getItem('user');
      const user = userStr ? JSON.parse(userStr) : null;
      const farmerId = user?.id || 'demo-farmer-123';

      const token = localStorage.getItem('token');
      const res = await fetch(`http://localhost:3001/api/crops/my-listings?farmerId=${farmerId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        setMyListings(data.crops);
      }
    } catch (err) {
      console.error("Failed to load listings", err);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData({ ...formData, [name]: checked });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      setSelectedFiles(prev => [...prev, ...filesArray].slice(0, 5)); // Max 5 images
      
      // Create preview URLs
      const urls = filesArray.map(file => URL.createObjectURL(file));
      setPreviewUrls(prev => [...prev, ...urls].slice(0, 5));
    }
  };

  const removeImage = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
    setPreviewUrls(prev => prev.filter((_, i) => i !== index));
  };

  const handlePublish = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedFiles.length === 0) {
      alert("Please upload at least one physical crop image.");
      return;
    }

    setIsPublishing(true);
    
    try {
      const userStr = localStorage.getItem('user');
      const user = userStr ? JSON.parse(userStr) : null;
      
      if (!user) {
        alert("Session expired. Please log in again.");
        return;
      }

      const formDataPayload = new FormData();
      formDataPayload.append('cropName', formData.cropName);
      formDataPayload.append('category', formData.category);
      formDataPayload.append('variety', formData.variety);
      formDataPayload.append('quantity', formData.quantity);
      formDataPayload.append('pricePerKg', formData.pricePerKg);
      formDataPayload.append('grade', 'A');
      formDataPayload.append('farmerId', user.id);
      
      selectedFiles.forEach((file) => {
        formDataPayload.append('images', file);
      });

      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:3001/api/crops', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: formDataPayload
      });
      
      const data = await response.json();
      
      if (data.success) {
        setSuccess(true);
        fetchListings();
        setFormData({ 
          cropName: '', 
          category: 'Vegetables', 
          variety: '', 
          quantity: '', 
          pricePerKg: '',
          harvestDate: '',
          location: '',
          organicCertified: false,
          description: '',
          minOrderQty: '',
        });
        setSelectedFiles([]);
        setPreviewUrls([]);
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
        setTimeout(() => {
          setSuccess(false);
          setActiveTab('manage');
        }, 2000);
      } else {
        // Alert data.message or data.error since the backend might send {error: 'x'} instead of {message: 'x'}
        alert("Publish failed: " + (data.message || data.error || "Unknown error"));
      }
    } catch (error) {
      console.error(error);
      alert("Network error. Backend might be unreachable.");
    } finally {
      setIsPublishing(false);
    }
  };

  const deleteListing = async (cropId: string) => {
    if (!confirm('Are you sure you want to delete this listing?')) return;
    
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`http://localhost:3001/api/crops/${cropId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        fetchListings();
      }
    } catch (err) {
      console.error("Failed to delete listing", err);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h1 className="text-4xl font-black text-slate-900 mb-2 flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center shadow-lg">
                <Leaf className="text-white" size={24} />
              </div>
              Crop Marketplace Hub
            </h1>
            <p className="text-slate-600 font-medium">Manage your harvest, track performance, and grow your business</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="bg-white px-5 py-3 rounded-2xl shadow-md border border-green-100">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm font-bold text-green-700">LIVE</span>
              </div>
            </div>
            <button className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-6 py-3 rounded-2xl font-bold shadow-lg hover:shadow-xl transition-all flex items-center gap-2">
              <Sparkles size={18} />
              Premium Features
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          <motion.div 
            whileHover={{ scale: 1.02 }}
            className="bg-white rounded-2xl p-5 shadow-md border border-slate-100"
          >
            <div className="flex items-center justify-between mb-2">
              <Eye className="text-blue-500" size={24} />
              <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded-lg">+12%</span>
            </div>
            <p className="text-2xl font-black text-slate-900">{analytics.totalViews.toLocaleString()}</p>
            <p className="text-xs text-slate-500 font-medium mt-1">Total Views</p>
          </motion.div>

          <motion.div 
            whileHover={{ scale: 1.02 }}
            className="bg-white rounded-2xl p-5 shadow-md border border-slate-100"
          >
            <div className="flex items-center justify-between mb-2">
              <ShoppingCart className="text-green-500" size={24} />
              <span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded-lg">+8%</span>
            </div>
            <p className="text-2xl font-black text-slate-900">{analytics.totalOrders}</p>
            <p className="text-xs text-slate-500 font-medium mt-1">Orders Received</p>
          </motion.div>

          <motion.div 
            whileHover={{ scale: 1.02 }}
            className="bg-white rounded-2xl p-5 shadow-md border border-slate-100"
          >
            <div className="flex items-center justify-between mb-2">
              <DollarSign className="text-emerald-500" size={24} />
              <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-lg">+15%</span>
            </div>
            <p className="text-2xl font-black text-slate-900">₹{(analytics.revenue / 1000).toFixed(1)}K</p>
            <p className="text-xs text-slate-500 font-medium mt-1">Total Revenue</p>
          </motion.div>

          <motion.div 
            whileHover={{ scale: 1.02 }}
            className="bg-white rounded-2xl p-5 shadow-md border border-slate-100"
          >
            <div className="flex items-center justify-between mb-2">
              <Star className="text-yellow-500" size={24} />
              <span className="text-xs font-bold text-yellow-600 bg-yellow-50 px-2 py-1 rounded-lg">Excellent</span>
            </div>
            <p className="text-2xl font-black text-slate-900">{analytics.avgRating}</p>
            <p className="text-xs text-slate-500 font-medium mt-1">Average Rating</p>
          </motion.div>
        </div>

        {/* Tab Navigation */}
        <div className="bg-white rounded-2xl p-2 shadow-md border border-slate-100 inline-flex gap-2">
          <button
            onClick={() => setActiveTab('create')}
            className={`px-6 py-3 rounded-xl font-bold transition-all flex items-center gap-2 ${
              activeTab === 'create'
                ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-lg'
                : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            <Plus size={18} />
            Create Listing
          </button>
          <button
            onClick={() => setActiveTab('manage')}
            className={`px-6 py-3 rounded-xl font-bold transition-all flex items-center gap-2 ${
              activeTab === 'manage'
                ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-lg'
                : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            <Package size={18} />
            Manage ({myListings.length})
          </button>
          <button
            onClick={() => setActiveTab('analytics')}
            className={`px-6 py-3 rounded-xl font-bold transition-all flex items-center gap-2 ${
              activeTab === 'analytics'
                ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-lg'
                : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            <BarChart3 size={18} />
            Analytics
          </button>
        </div>
      </div>

      {/* Tab Content */}
      <AnimatePresence mode="wait">
        {activeTab === 'create' && (
          <motion.div
            key="create"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="grid grid-cols-1 lg:grid-cols-3 gap-6"
          >
            {/* Create Form */}
            <div className="lg:col-span-2 bg-white rounded-3xl p-8 shadow-xl border border-slate-200">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-black text-slate-900 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center">
                    <Zap className="text-white" size={20} />
                  </div>
                  New Crop Listing
                </h3>
                <button
                  onClick={() => setShowPreview(!showPreview)}
                  className="text-sm font-bold text-green-600 hover:text-green-700 flex items-center gap-2"
                >
                  <Eye size={16} />
                  {showPreview ? 'Hide' : 'Show'} Preview
                </button>
              </div>
              
              <form onSubmit={handlePublish} className="space-y-6">
                {/* Basic Info */}
                <div className="space-y-4">
                  <h4 className="text-sm font-bold text-slate-700 uppercase tracking-wider flex items-center gap-2">
                    <Target size={16} className="text-green-600" />
                    Basic Information
                  </h4>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-2">Crop Name *</label>
                      <input 
                        required 
                        name="cropName" 
                        value={formData.cropName} 
                        onChange={handleInputChange} 
                        type="text" 
                        placeholder="e.g. Nashik Red Onion" 
                        className="w-full bg-slate-50 border-2 border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-green-500 focus:bg-white transition-all font-medium"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-2">Category *</label>
                      <select 
                        name="category" 
                        value={formData.category} 
                        onChange={handleInputChange} 
                        className="w-full bg-slate-50 border-2 border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-green-500 focus:bg-white transition-all font-medium"
                      >
                        <option value="Vegetables">🥬 Vegetables</option>
                        <option value="Fruits">🍎 Fruits</option>
                        <option value="Grains">🌾 Grains</option>
                        <option value="Pulses">🫘 Pulses</option>
                        <option value="Spices">🌶️ Spices</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-2">Variety *</label>
                      <input 
                        required 
                        name="variety" 
                        value={formData.variety} 
                        onChange={handleInputChange} 
                        type="text" 
                        placeholder="e.g. Hybrid, Organic" 
                        className="w-full bg-slate-50 border-2 border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-green-500 focus:bg-white transition-all font-medium"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-2">Harvest Date</label>
                      <input 
                        name="harvestDate" 
                        value={formData.harvestDate} 
                        onChange={handleInputChange} 
                        type="date" 
                        className="w-full bg-slate-50 border-2 border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-green-500 focus:bg-white transition-all font-medium"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Location</label>
                    <input 
                      name="location" 
                      value={formData.location} 
                      onChange={handleInputChange} 
                      type="text" 
                      placeholder="e.g. Nashik, Maharashtra" 
                      className="w-full bg-slate-50 border-2 border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-green-500 focus:bg-white transition-all font-medium"
                    />
                  </div>
                </div>

                {/* Pricing & Quantity */}
                <div className="space-y-4">
                  <h4 className="text-sm font-bold text-slate-700 uppercase tracking-wider flex items-center gap-2">
                    <DollarSign size={16} className="text-green-600" />
                    Pricing & Quantity
                  </h4>
                  
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-2">Total Quantity (Kg) *</label>
                      <input 
                        required 
                        name="quantity" 
                        value={formData.quantity} 
                        onChange={handleInputChange} 
                        type="number" 
                        placeholder="2500" 
                        className="w-full bg-slate-50 border-2 border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-green-500 focus:bg-white transition-all font-medium"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-2">Price/Kg (₹) *</label>
                      <input 
                        required 
                        name="pricePerKg" 
                        value={formData.pricePerKg} 
                        onChange={handleInputChange} 
                        type="number" 
                        step="0.01"
                        placeholder="18.50" 
                        className="w-full bg-slate-50 border-2 border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-green-500 focus:bg-white transition-all font-medium"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-2">Min Order (Kg)</label>
                      <input 
                        name="minOrderQty" 
                        value={formData.minOrderQty} 
                        onChange={handleInputChange} 
                        type="number" 
                        placeholder="100" 
                        className="w-full bg-slate-50 border-2 border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-green-500 focus:bg-white transition-all font-medium"
                      />
                    </div>
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Description</label>
                  <textarea 
                    name="description" 
                    value={formData.description} 
                    onChange={handleInputChange} 
                    rows={3}
                    placeholder="Describe your crop quality, farming practices, certifications..." 
                    className="w-full bg-slate-50 border-2 border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-green-500 focus:bg-white transition-all font-medium resize-none"
                  />
                </div>

                {/* Certifications */}
                <div className="flex items-center gap-3 p-4 bg-green-50 rounded-xl border-2 border-green-100">
                  <input 
                    type="checkbox" 
                    id="organic" 
                    name="organicCertified" 
                    checked={formData.organicCertified}
                    onChange={handleInputChange}
                    className="w-5 h-5 rounded border-green-300 text-green-600 focus:ring-green-500"
                  />
                  <label htmlFor="organic" className="flex items-center gap-2 cursor-pointer">
                    <Award className="text-green-600" size={20} />
                    <span className="font-bold text-slate-700">Organic Certified</span>
                    <span className="text-xs text-green-600 bg-green-100 px-2 py-1 rounded-lg">+20% visibility</span>
                  </label>
                </div>

                {/* Image Upload */}
                <div className="space-y-4">
                  <h4 className="text-sm font-bold text-slate-700 uppercase tracking-wider flex items-center gap-2">
                    <Camera size={16} className="text-green-600" />
                    Crop Images (Max 5) *
                  </h4>
                  
                  <input 
                    ref={fileInputRef}
                    type="file" 
                    id="crop-images" 
                    accept="image/*" 
                    multiple
                    className="hidden" 
                    onChange={handleFileChange}
                  />
                  
                  <div className="grid grid-cols-5 gap-3">
                    {previewUrls.map((url, index) => (
                      <div key={index} className="relative group">
                        <img 
                          src={url} 
                          alt={`Preview ${index + 1}`}
                          className="w-full h-24 object-cover rounded-xl border-2 border-slate-200"
                        />
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X size={14} />
                        </button>
                      </div>
                    ))}
                    
                    {previewUrls.length < 5 && (
                      <label 
                        htmlFor="crop-images"
                        className="w-full h-24 border-2 border-dashed border-slate-300 bg-slate-50 hover:bg-slate-100 rounded-xl flex flex-col items-center justify-center transition-colors cursor-pointer group"
                      >
                        <Camera className="text-slate-400 group-hover:text-green-500 transition-colors mb-1" size={20} />
                        <span className="text-xs font-medium text-slate-500">Add Photo</span>
                      </label>
                    )}
                  </div>
                  
                  {previewUrls.length === 0 && (
                    <div className="flex items-center gap-2 text-amber-600 bg-amber-50 p-3 rounded-xl border border-amber-200">
                      <AlertCircle size={18} />
                      <span className="text-sm font-medium">Please upload at least one high-quality image</span>
                    </div>
                  )}
                </div>

                {/* Submit Button */}
                <button 
                  type="submit" 
                  disabled={isPublishing}
                  className={`w-full py-4 rounded-xl font-black text-white transition-all transform hover:scale-[1.01] hover:shadow-2xl flex items-center justify-center gap-3 text-lg ${
                    success 
                      ? 'bg-green-500' 
                      : 'bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 shadow-xl shadow-green-500/30'
                  }`}
                >
                  {isPublishing ? (
                    <>
                      <div className="h-6 w-6 border-4 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Publishing to Marketplace...</span>
                    </>
                  ) : success ? (
                    <>
                      <CheckCircle size={24} />
                      <span>Successfully Published!</span>
                    </>
                  ) : (
                    <>
                      <Sparkles size={24} />
                      <span>Publish to Live Marketplace</span>
                    </>
                  )}
                </button>
              </form>
            </div>

            {/* Quick Tips Sidebar */}
            <div className="space-y-4">
              <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-3xl p-6 shadow-xl text-white">
                <h3 className="text-xl font-black mb-4 flex items-center gap-2">
                  <Sparkles size={20} />
                  Pro Tips
                </h3>
                <ul className="space-y-3 text-sm">
                  <li className="flex items-start gap-2">
                    <CheckCircle size={16} className="mt-0.5 flex-shrink-0" />
                    <span>Upload clear, well-lit photos for 40% more views</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle size={16} className="mt-0.5 flex-shrink-0" />
                    <span>Competitive pricing increases order chances by 60%</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle size={16} className="mt-0.5 flex-shrink-0" />
                    <span>Organic certification boosts visibility by 20%</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle size={16} className="mt-0.5 flex-shrink-0" />
                    <span>Detailed descriptions build buyer trust</span>
                  </li>
                </ul>
              </div>

              <div className="bg-white rounded-3xl p-6 shadow-xl border border-slate-200">
                <h3 className="text-lg font-black mb-4 text-slate-900">Market Insights</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-blue-50 rounded-xl">
                    <span className="text-sm font-medium text-slate-700">Avg. Market Price</span>
                    <span className="text-lg font-black text-blue-600">₹22/kg</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-green-50 rounded-xl">
                    <span className="text-sm font-medium text-slate-700">Demand Level</span>
                    <span className="text-sm font-black text-green-600">HIGH 🔥</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-amber-50 rounded-xl">
                    <span className="text-sm font-medium text-slate-700">Best Time to Sell</span>
                    <span className="text-sm font-black text-amber-600">NOW</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
