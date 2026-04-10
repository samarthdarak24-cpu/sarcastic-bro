import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Package, Upload, Plus, CheckCircle, Image as ImageIcon, X } from 'lucide-react';

export default function CropListing() {
  const [isPublishing, setIsPublishing] = useState(false);
  const [success, setSuccess] = useState(false);
  
  // Real Form State
  const [formData, setFormData] = useState({
    cropName: '',
    category: 'Vegetables',
    variety: '',
    quantity: '',
    pricePerKg: '',
  });
  
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [myListings, setMyListings] = useState<any[]>([]);

  // Fetch real listings on mount
  useEffect(() => {
    fetchListings();
  }, []);

  const fetchListings = async () => {
    try {
      const userStr = localStorage.getItem('user');
      const user = userStr ? JSON.parse(userStr) : null;
      const farmerId = user?.id || 'demo-farmer-123';

      const res = await fetch(`http://localhost:3001/api/crops/my-listings?farmerId=${farmerId}`);
      const data = await res.json();
      if (data.success) {
        setMyListings(data.crops);
      }
    } catch (err) {
      console.error("Failed to load listings", err);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handlePublish = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile) {
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
      
      if (selectedFile) {
        formDataPayload.append('images', selectedFile);
      }

      const response = await fetch('http://localhost:3001/api/crops', {
        method: 'POST',
        body: formDataPayload
      });
      
      const data = await response.json();
      
      if (data.success) {
        setSuccess(true);
        fetchListings();
        setFormData({ cropName: '', category: 'Vegetables', variety: '', quantity: '', pricePerKg: '' });
        setSelectedFile(null);
        setTimeout(() => setSuccess(false), 3000);
      } else {
        alert("Publish failed: " + (data.message || "Unknown error"));
      }
    } catch (error) {
      console.error(error);
      alert("Network error. Backend might be unreachable.");
    } finally {
      setIsPublishing(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-black text-slate-900">Live Crop Listing</h2>
          <p className="text-slate-500 mt-1 font-medium">Publish your harvest directly to the AgriTrust marketplace.</p>
        </div>
        <div className="flex items-center gap-2 bg-green-50 px-4 py-2 rounded-xl border border-green-100">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <span className="text-xs font-black text-green-700 uppercase">Live Marketplace</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Listing Form */}
        <div className="lg:col-span-2 bg-white rounded-3xl p-8 shadow-lg border border-slate-200">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <div className="w-10 h-10 rounded-xl bg-green-100 flex items-center justify-center">
                <Package className="text-green-600" size={20} />
              </div>
              New Crop Entry
            </h3>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Step 1 of 1</span>
          </div>
          
          <form onSubmit={handlePublish} className="space-y-6">
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Crop Name</label>
                <input required name="cropName" value={formData.cropName} onChange={handleInputChange} type="text" placeholder="e.g. Nashik Red Onion" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-green-500 transition-all font-medium" />
              </div>
              <div>
                 <label className="block text-sm font-bold text-slate-700 mb-2">Category</label>
                 <select name="category" value={formData.category} onChange={handleInputChange} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-green-500 transition-all font-medium">
                   <option value="Vegetables">Vegetables</option>
                   <option value="Fruits">Fruits</option>
                   <option value="Grains">Grains</option>
                 </select>
              </div>
            </div>

             <div className="grid grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Variety</label>
                <input required name="variety" value={formData.variety} onChange={handleInputChange} type="text" placeholder="e.g. Hybrid" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-green-500 transition-all font-medium" />
              </div>
              <div>
                 <label className="block text-sm font-bold text-slate-700 mb-2">Quantity (Kg)</label>
                 <input required name="quantity" value={formData.quantity} onChange={handleInputChange} type="number" placeholder="2500" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-green-500 transition-all font-medium" />
              </div>
              <div>
                 <label className="block text-sm font-bold text-slate-700 mb-2">Price/Kg (₹)</label>
                 <input required name="pricePerKg" value={formData.pricePerKg} onChange={handleInputChange} type="number" placeholder="18.5" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-green-500 transition-all font-medium" />
              </div>
            </div>

            {/* Image Upload Area */}
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Physical Crop Images (Visual Proof)</label>
              
              <input 
                type="file" 
                id="crop-image" 
                accept="image/*" 
                className="hidden" 
                onChange={handleFileChange}
              />
              
              <label 
                htmlFor="crop-image"
                className={`w-full h-32 border-2 border-dashed ${selectedFile ? 'border-green-500 bg-green-50' : 'border-slate-300 bg-slate-50 hover:bg-slate-100'} rounded-2xl flex flex-col items-center justify-center transition-colors cursor-pointer group relative`}
              >
                {selectedFile ? (
                  <div className="text-center">
                    <CheckCircle className="text-green-500 mx-auto mb-2" size={32} />
                    <span className="text-sm font-bold text-green-700">{selectedFile.name} (Ready)</span>
                    <p className="text-xs text-green-600 mt-1">Click to replace</p>
                  </div>
                ) : (
                  <div className="text-center">
                    <ImageIcon className="text-slate-400 group-hover:text-green-500 transition-colors mx-auto mb-2" size={32} />
                    <span className="text-sm font-medium text-slate-500">Click to upload high-res images</span>
                  </div>
                )}
              </label>
            </div>

            <button 
              type="submit" 
              disabled={isPublishing}
              className={`w-full py-4 rounded-xl font-black text-white transition-all transform hover:scale-[1.01] hover:shadow-xl flex items-center justify-center gap-2 ${success ? 'bg-green-500' : 'bg-gradient-to-r from-green-600 to-emerald-500 shadow-lg shadow-green-500/30'}`}
            >
              {isPublishing ? (
                <>
                  <div className="h-6 w-6 border-4 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Publishing...</span>
                </>
              ) : success ? (
                <><CheckCircle size={20} /> Successfully Published to Marketplace</>
              ) : (
                <><Plus size={20} /> Publish to Live Marketplace</>
              )}
            </button>
          </form>
        </div>

        {/* Existing Listings Sidebar */}
        <div className="col-span-1 bg-white rounded-3xl p-6 shadow-lg border border-slate-200">
           <div className="flex items-center justify-between mb-4">
             <h3 className="text-lg font-bold text-slate-900">Your Active Listings</h3>
             <span className="text-xs font-black text-green-600 bg-green-50 px-2 py-1 rounded-lg">{myListings.length}</span>
           </div>
           
           <div className="space-y-3 max-h-[500px] overflow-y-auto custom-scrollbar pr-2">
             {myListings.length === 0 ? (
                <div className="text-center py-12 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200">
                  <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Package className="text-slate-300" size={32} />
                  </div>
                  <p className="text-sm font-bold text-slate-500">No active listings yet</p>
                  <p className="text-xs text-slate-400 mt-1">Start by adding your first crop</p>
                </div>
             ) : (
               myListings.map((crop, index) => (
                 <motion.div 
                   key={crop.id}
                   initial={{ opacity: 0, y: 10 }}
                   animate={{ opacity: 1, y: 0 }}
                   transition={{ delay: index * 0.05 }}
                   className="p-4 bg-gradient-to-br from-slate-50 to-white rounded-2xl border border-slate-100 hover:border-green-200 hover:shadow-md transition-all cursor-pointer group"
                 >
                   <div className="flex justify-between items-start mb-2">
                     <span className={`text-[10px] font-black px-2.5 py-1 rounded-full ${crop.status === 'LISTED' ? 'bg-green-100 text-green-700 border border-green-200' : 'bg-blue-100 text-blue-700 border border-blue-200'}`}>
                       {crop.status}
                     </span>
                     <span className="text-xs font-bold text-slate-400">
                       {new Date(crop.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                     </span>
                   </div>
                   <h4 className="font-bold text-slate-900 group-hover:text-green-600 transition-colors">{crop.cropName}</h4>
                   <p className="text-xs text-slate-500 mt-0.5">{crop.variety}</p>
                   <div className="flex items-center justify-between mt-3 pt-3 border-t border-slate-100">
                     <span className="text-xs font-medium text-slate-600">{crop.quantity} Kg</span>
                     <span className="text-sm font-black text-green-600">₹{crop.pricePerKg}/Kg</span>
                   </div>
                 </motion.div>
               ))
             )}
           </div>
        </div>

      </div>
    </div>
  );
}
