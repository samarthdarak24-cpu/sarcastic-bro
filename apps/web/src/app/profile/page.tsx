"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  User, Camera, Save, Shield, MapPin, Phone, Mail,
  Globe, CheckCircle2, Clock, Edit3, Upload, X,
  Sparkles, Award, TrendingUp, Package, ShoppingBag,
  AlertCircle, Loader2, Check
} from "lucide-react";
import { useTranslation } from "react-i18next";
import "@/lib/i18n";
import { useAuthStore } from "@/store/authStore";
import { LanguageSwitcher } from "@/components/ui/LanguageSwitcher";
import api from "@/services/api";
import toast from "react-hot-toast";
import Link from "next/link";

const INDIAN_STATES = [
  "Andhra Pradesh","Assam","Bihar","Chhattisgarh","Delhi","Goa","Gujarat",
  "Haryana","Himachal Pradesh","Jharkhand","Karnataka","Kerala","Madhya Pradesh",
  "Maharashtra","Manipur","Meghalaya","Mizoram","Nagaland","Odisha","Punjab",
  "Rajasthan","Sikkim","Tamil Nadu","Telangana","Tripura","Uttar Pradesh",
  "Uttarakhand","West Bengal"
];

export default function ProfilePage() {
  const { t } = useTranslation();
  const { user, setUser } = useAuthStore();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState({
    name: user?.name || "",
    phone: user?.phone || "",
    district: user?.district || "",
    state: user?.state || "",
  });
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(user?.avatarUrl || null);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [stats, setStats] = useState({ orders: 0, products: 0, revenue: 0, rating: 5.0 });
  const [isDragging, setIsDragging] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await api.get("/auth/me");
      const u = res.data.data || res.data;
      setForm({ 
        name: u.name || "", 
        phone: u.phone || "", 
        district: u.district || "", 
        state: u.state || "" 
      });
      if (u.avatarUrl) {
        // Ensure full URL for avatar
        const fullAvatarUrl = u.avatarUrl.startsWith('http') 
          ? u.avatarUrl 
          : `${api.defaults.baseURL}${u.avatarUrl}`;
        setAvatarPreview(fullAvatarUrl);
      }
    } catch (error) {
      console.error("Failed to fetch profile:", error);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // Validate file size (5MB)
    if (file.size > 5 * 1024 * 1024) { 
      toast.error("File too large. Maximum size is 5MB"); 
      return; 
    }
    
    // Validate file type
    if (!['image/jpeg', 'image/png', 'image/webp', 'image/jpg'].includes(file.type)) {
      toast.error("Only JPG, PNG, and WebP images are allowed"); 
      return;
    }
    
    setAvatarFile(file);
    
    // Create preview with animation
    const reader = new FileReader();
    reader.onload = (e) => {
      setAvatarPreview(e.target?.result as string);
      toast.success("✨ Image selected! Click Save to upload.", {
        icon: '📸',
        duration: 3000,
      });
    };
    reader.readAsDataURL(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const file = e.dataTransfer.files?.[0];
    if (!file) return;
    
    // Validate file size (5MB)
    if (file.size > 5 * 1024 * 1024) { 
      toast.error("File too large. Maximum size is 5MB"); 
      return; 
    }
    
    // Validate file type
    if (!['image/jpeg', 'image/png', 'image/webp', 'image/jpg'].includes(file.type)) {
      toast.error("Only JPG, PNG, and WebP images are allowed"); 
      return;
    }
    
    setAvatarFile(file);
    
    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setAvatarPreview(e.target?.result as string);
      toast.success("✨ Image dropped! Click Save to upload.", {
        icon: '🎯',
        duration: 3000,
      });
    };
    reader.readAsDataURL(file);
  };

  const uploadAvatar = async () => {
    if (!avatarFile) return null;
    
    setUploading(true);
    setUploadProgress(0);
    
    try {
      const formData = new FormData();
      formData.append("avatar", avatarFile);
      
      // Simulate progress
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => Math.min(prev + 10, 90));
      }, 100);
      
      const uploadRes = await api.post("/auth/upload-avatar", formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      
      clearInterval(progressInterval);
      setUploadProgress(100);
      
      const avatarUrl = uploadRes.data.data?.avatarUrl || uploadRes.data.avatarUrl;
      
      if (avatarUrl) {
        const fullAvatarUrl = avatarUrl.startsWith('http') 
          ? avatarUrl 
          : `${api.defaults.baseURL}${avatarUrl}`;
        setAvatarPreview(fullAvatarUrl);
        toast.success("Profile picture uploaded successfully!");
        return avatarUrl;
      }
      
      return null;
    } catch (error: any) {
      console.error("Avatar upload failed:", error);
      toast.error(error.response?.data?.message || "Failed to upload profile picture");
      return null;
    } finally {
      setUploading(false);
      setUploadProgress(0);
      setAvatarFile(null);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    
    try {
      // Upload avatar first if changed
      if (avatarFile) {
        await uploadAvatar();
      }

      // Update profile
      const res = await api.put("/auth/profile", form);
      const updated = res.data.data || res.data;
      
      if (setUser && updated) {
        setUser({ ...user!, ...updated });
      }
      
      setShowSuccess(true);
      toast.success("🎉 Profile updated successfully!", {
        icon: '✨',
        duration: 3000,
      });
      
      // Hide success animation after 2 seconds
      setTimeout(() => setShowSuccess(false), 2000);
      
      // Refresh profile data
      await fetchProfile();
    } catch (err: any) {
      console.error("Profile update failed:", err);
      toast.error(err.response?.data?.message || "Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  const removeAvatar = () => {
    setAvatarFile(null);
    setAvatarPreview(user?.avatarUrl || null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const isFarmer = user?.role === "FARMER";

  return (
    <div className="min-h-screen bg-slate-950 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Gradient Orbs */}
        <motion.div
          className="absolute top-0 left-0 w-[600px] h-[600px] bg-gradient-to-br from-emerald-500/30 to-teal-500/30 rounded-full blur-3xl"
          animate={{
            x: [0, 100, 0],
            y: [0, 50, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-full blur-3xl"
          animate={{
            x: [0, -80, 0],
            y: [0, -60, 0],
            scale: [1, 1.3, 1],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute top-1/2 left-1/2 w-[400px] h-[400px] bg-gradient-to-br from-cyan-500/20 to-emerald-500/20 rounded-full blur-3xl"
          animate={{
            x: [-200, 200, -200],
            y: [-100, 100, -100],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        {/* Animated Grid */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(16,185,129,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(16,185,129,0.03)_1px,transparent_1px)] bg-[size:50px_50px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_50%,black,transparent)]" />
        
        {/* Floating Particles */}
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-emerald-400/40 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -30, 0],
              opacity: [0.2, 0.8, 0.2],
              scale: [1, 1.5, 1],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      {/* Header */}
      <motion.div 
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="relative bg-slate-900/50 backdrop-blur-xl border-b border-emerald-500/20 px-6 py-4 flex items-center justify-between sticky top-0 z-50"
      >
        <div className="flex items-center gap-3">
          <Link href={isFarmer ? "/farmer/dashboard" : "/buyer/dashboard"}
            className="text-sm font-bold text-slate-400 hover:text-emerald-400 transition-colors">
            ← {t('nav.dashboard')}
          </Link>
          <span className="text-slate-600">/</span>
          <span className="text-sm font-black text-white">{t('profile.title')}</span>
        </div>
        <LanguageSwitcher />
      </motion.div>

      <div className="relative max-w-5xl mx-auto px-6 py-10 space-y-8">

        {/* Profile Hero Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-slate-900/80 backdrop-blur-xl rounded-3xl border border-emerald-500/20 shadow-2xl shadow-emerald-500/10 overflow-hidden"
        >
          {/* Cover with animated gradient */}
          <div className="h-40 bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 relative overflow-hidden">
            <motion.div 
              className="absolute inset-0 opacity-20"
              animate={{
                backgroundPosition: ['0% 0%', '100% 100%'],
              }}
              transition={{
                duration: 20,
                repeat: Infinity,
                repeatType: 'reverse',
              }}
              style={{
                backgroundImage: 'radial-gradient(circle at 20% 50%, white 2px, transparent 2px)',
                backgroundSize: '30px 30px'
              }} 
            />
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
              animate={{
                x: ['-100%', '200%'],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: 'linear',
              }}
            />
            {/* Floating Shapes */}
            {[...Array(5)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-20 h-20 border-2 border-white/20 rounded-full"
                style={{
                  left: `${20 + i * 20}%`,
                  top: `${30 + (i % 2) * 40}%`,
                }}
                animate={{
                  y: [0, -20, 0],
                  scale: [1, 1.2, 1],
                  opacity: [0.3, 0.6, 0.3],
                }}
                transition={{
                  duration: 3 + i,
                  repeat: Infinity,
                  delay: i * 0.5,
                }}
              />
            ))}
          </div>

          <div className="px-8 pb-8">
            {/* Avatar Section */}
            <div className="flex items-end justify-between -mt-20 mb-6">
              <div 
                className="relative group"
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
              >
                {/* Avatar Container */}
                <motion.div 
                  className={`h-32 w-32 rounded-2xl border-4 shadow-2xl overflow-hidden bg-slate-100 relative transition-all ${
                    isDragging 
                      ? 'border-emerald-400 border-dashed scale-105' 
                      : 'border-white'
                  }`}
                  whileHover={{ scale: 1.05, rotate: 2 }}
                  transition={{ type: "spring", stiffness: 300 }}
                  animate={isDragging ? { scale: 1.1 } : {}}
                >
                  <AnimatePresence mode="wait">
                    {avatarPreview ? (
                      <motion.img 
                        key={avatarPreview}
                        src={avatarPreview} 
                        alt="Avatar" 
                        className="w-full h-full object-cover" 
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        transition={{ duration: 0.3 }}
                      />
                    ) : (
                      <motion.div 
                        className="w-full h-full flex items-center justify-center bg-gradient-to-br from-emerald-400 to-teal-500"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                      >
                        <span className="text-5xl font-black text-white">
                          {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                        </span>
                      </motion.div>
                    )}
                  </AnimatePresence>
                  
                  {/* Upload Progress Overlay */}
                  <AnimatePresence>
                    {uploading && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 bg-black/70 flex flex-col items-center justify-center backdrop-blur-sm"
                      >
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        >
                          <Loader2 className="h-8 w-8 text-white mb-2" />
                        </motion.div>
                        <motion.span 
                          className="text-white text-xs font-bold"
                          key={uploadProgress}
                          initial={{ scale: 0.8 }}
                          animate={{ scale: 1 }}
                        >
                          {uploadProgress}%
                        </motion.span>
                        <div className="w-20 h-1 bg-white/20 rounded-full mt-2 overflow-hidden">
                          <motion.div 
                            className="h-full bg-emerald-400"
                            initial={{ width: 0 }}
                            animate={{ width: `${uploadProgress}%` }}
                            transition={{ duration: 0.3 }}
                          />
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Sparkle Effect on Hover */}
                  <motion.div
                    className="absolute inset-0 pointer-events-none"
                    initial={{ opacity: 0 }}
                    whileHover={{ opacity: 1 }}
                  >
                    {[...Array(6)].map((_, i) => (
                      <motion.div
                        key={i}
                        className="absolute w-1 h-1 bg-white rounded-full"
                        style={{
                          top: `${Math.random() * 100}%`,
                          left: `${Math.random() * 100}%`,
                        }}
                        animate={{
                          scale: [0, 1, 0],
                          opacity: [0, 1, 0],
                        }}
                        transition={{
                          duration: 1.5,
                          repeat: Infinity,
                          delay: i * 0.2,
                        }}
                      />
                    ))}
                  </motion.div>

                  {/* Drag & Drop Indicator */}
                  <AnimatePresence>
                    {isDragging && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 bg-emerald-500/90 backdrop-blur-sm flex flex-col items-center justify-center z-10"
                      >
                        <motion.div
                          animate={{ 
                            y: [0, -10, 0],
                            scale: [1, 1.1, 1]
                          }}
                          transition={{ 
                            duration: 1,
                            repeat: Infinity 
                          }}
                        >
                          <Upload size={32} className="text-white mb-2" />
                        </motion.div>
                        <span className="text-white text-xs font-bold">Drop here!</span>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>

                {/* Upload Button Overlay */}
                <motion.button
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute inset-0 rounded-2xl bg-gradient-to-br from-emerald-500/90 to-teal-600/90 opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col items-center justify-center gap-1 backdrop-blur-sm"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <motion.div
                    animate={{ y: [0, -5, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    <Camera size={28} className="text-white drop-shadow-lg" />
                  </motion.div>
                  <span className="text-xs font-bold text-white drop-shadow-lg">Change Photo</span>
                  <span className="text-[10px] text-white/80">Max 5MB</span>
                </motion.button>

                {/* New File Badge */}
                <AnimatePresence>
                  {avatarFile && !uploading && (
                    <motion.div
                      initial={{ scale: 0, rotate: -180 }}
                      animate={{ 
                        scale: 1, 
                        rotate: 0,
                      }}
                      exit={{ scale: 0, rotate: 180 }}
                      className="absolute -top-2 -right-2 h-8 w-8 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-full flex items-center justify-center border-2 border-white shadow-lg"
                    >
                      <motion.div
                        animate={{ y: [0, -2, 0] }}
                        transition={{ duration: 1, repeat: Infinity }}
                      >
                        <Upload size={14} className="text-white" />
                      </motion.div>
                      <motion.div
                        className="absolute inset-0 rounded-full bg-emerald-400"
                        animate={{ scale: [1, 1.5], opacity: [0.5, 0] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                      />
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Remove Button */}
                <AnimatePresence>
                  {avatarFile && !uploading && (
                    <motion.button
                      initial={{ scale: 0, rotate: -180 }}
                      animate={{ scale: 1, rotate: 0 }}
                      exit={{ scale: 0, rotate: 180 }}
                      onClick={removeAvatar}
                      className="absolute -bottom-2 -right-2 h-8 w-8 bg-gradient-to-br from-red-500 to-rose-600 rounded-full flex items-center justify-center border-2 border-white shadow-lg hover:shadow-xl transition-all"
                      whileHover={{ scale: 1.1, rotate: 90 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <X size={14} className="text-white" />
                    </motion.button>
                  )}
                </AnimatePresence>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/jpg"
                  className="hidden"
                  onChange={handleFileSelect}
                />
              </div>

              {/* Badges */}
              <div className="flex items-center gap-3 mb-2">
                <motion.div 
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2 }}
                  className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest shadow-lg ${
                    isFarmer ? 'bg-emerald-100 text-emerald-700' : 'bg-blue-100 text-blue-700'
                  }`}
                >
                  {isFarmer ? '🌾' : '🛒'} {t(`auth.${user?.role?.toLowerCase() || 'farmer'}`)}
                </motion.div>
                <motion.div 
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.3 }}
                  className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest shadow-lg ${
                    user?.kycStatus === 'VERIFIED' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                  }`}
                >
                  {user?.kycStatus === 'VERIFIED' ? <CheckCircle2 size={14} /> : <Clock size={14} />}
                  {t(`profile.${user?.kycStatus?.toLowerCase() || 'pending'}`)}
                </motion.div>
              </div>
            </div>

            {/* User Info */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <h1 className="text-3xl font-black bg-gradient-to-r from-white to-emerald-200 bg-clip-text text-transparent">
                {user?.name}
              </h1>
              <p className="text-sm text-slate-400 mt-1 flex items-center gap-2">
                <Mail size={14} />
                {user?.email}
              </p>
              {user?.district && (
                <p className="text-sm text-slate-500 flex items-center gap-1 mt-1">
                  <MapPin size={14} /> {user.district}, {user.state}
                </p>
              )}
            </motion.div>

            {/* Stats Row */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="grid grid-cols-4 gap-4 mt-8 pt-6 border-t border-slate-800"
            >
              {[
                { label: t('dashboard.total_orders'), value: stats.orders || 154, icon: ShoppingBag, color: 'text-blue-400', bg: 'bg-blue-500/10', border: 'border-blue-500/20' },
                { label: t('products.title'), value: stats.products || 32, icon: Package, color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20' },
                { label: t('finance.revenue'), value: `₹${(stats.revenue || 142500).toLocaleString()}`, icon: TrendingUp, color: 'text-purple-400', bg: 'bg-purple-500/10', border: 'border-purple-500/20' },
                { label: t('dashboard.trust_score'), value: `${stats.rating || 4.9}★`, icon: Award, color: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/20' },
              ].map((stat, i) => (
                <motion.div 
                  key={i} 
                  className="text-center"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.3 + i * 0.1 }}
                  whileHover={{ scale: 1.05, y: -5 }}
                >
                  <motion.div 
                    className={`h-12 w-12 ${stat.bg} ${stat.border} border rounded-xl flex items-center justify-center mx-auto mb-2 relative overflow-hidden`}
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.6 }}
                  >
                    <stat.icon size={20} className={stat.color} />
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
                      animate={{ x: ['-100%', '200%'] }}
                      transition={{ duration: 2, repeat: Infinity, delay: i * 0.3 }}
                    />
                  </motion.div>
                  <p className="text-xl font-black text-white number-pop">{stat.value}</p>
                  <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-1">{stat.label}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </motion.div>

        {/* Edit Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-slate-900/80 backdrop-blur-xl rounded-3xl border border-emerald-500/20 shadow-xl shadow-emerald-500/5 p-8 relative overflow-hidden"
        >
          {/* Animated Background Pattern */}
          <div className="absolute inset-0 opacity-5">
            <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(16,185,129,0.1)_25%,rgba(16,185,129,0.1)_50%,transparent_50%,transparent_75%,rgba(16,185,129,0.1)_75%,rgba(16,185,129,0.1))] bg-[length:20px_20px]" />
          </div>

          <div className="flex items-center gap-3 mb-8 relative">
            <motion.div 
              className="h-12 w-12 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-lg shadow-emerald-500/50"
              whileHover={{ rotate: 360, scale: 1.1 }}
              transition={{ duration: 0.6 }}
            >
              <Edit3 size={20} className="text-white" />
            </motion.div>
            <div>
              <h2 className="text-xl font-black text-white">{t('profile.personal_info')}</h2>
              <p className="text-xs text-slate-400">{t('profile.photo_hint')}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Name */}
            <motion.div 
              className="space-y-2"
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <label className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                <User size={12} /> {t('profile.name')}
              </label>
              <div className="relative">
                <input
                  value={form.name}
                  onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                  className="w-full h-12 px-4 rounded-xl border-2 border-slate-700 bg-slate-800/50 focus:bg-slate-800 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/20 outline-none text-sm font-semibold text-white transition-all input-glow"
                  placeholder={t('profile.name')}
                />
                <motion.div
                  className="absolute right-3 top-1/2 -translate-y-1/2"
                  initial={{ scale: 0 }}
                  animate={form.name ? { scale: 1 } : { scale: 0 }}
                >
                  <CheckCircle2 size={16} className="text-emerald-500" />
                </motion.div>
              </div>
            </motion.div>

            {/* Email (read-only) */}
            <motion.div 
              className="space-y-2"
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <label className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                <Mail size={12} /> {t('profile.email')}
              </label>
              <div className="relative">
                <input
                  value={user?.email || ""}
                  readOnly
                  className="w-full h-12 px-4 rounded-xl border-2 border-slate-700/50 bg-slate-800/30 text-sm font-semibold text-slate-500 cursor-not-allowed"
                />
                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                  <CheckCircle2 size={16} className="text-emerald-500" />
                </div>
              </div>
            </motion.div>

            {/* Phone */}
            <motion.div 
              className="space-y-2"
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <label className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                <Phone size={12} /> {t('profile.phone')}
              </label>
              <div className="relative">
                <input
                  value={form.phone}
                  onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
                  className="w-full h-12 px-4 rounded-xl border-2 border-slate-700 bg-slate-800/50 focus:bg-slate-800 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/20 outline-none text-sm font-semibold text-white transition-all input-glow"
                  placeholder="+91 XXXXX XXXXX"
                />
                <motion.div
                  className="absolute right-3 top-1/2 -translate-y-1/2"
                  initial={{ scale: 0 }}
                  animate={form.phone ? { scale: 1 } : { scale: 0 }}
                >
                  <CheckCircle2 size={16} className="text-emerald-500" />
                </motion.div>
              </div>
            </motion.div>

            {/* District */}
            <motion.div 
              className="space-y-2"
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <label className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                <MapPin size={12} /> {t('profile.district')}
              </label>
              <div className="relative">
                <input
                  value={form.district}
                  onChange={e => setForm(f => ({ ...f, district: e.target.value }))}
                  className="w-full h-12 px-4 rounded-xl border-2 border-slate-700 bg-slate-800/50 focus:bg-slate-800 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/20 outline-none text-sm font-semibold text-white transition-all input-glow"
                  placeholder="e.g. Nashik"
                />
                <motion.div
                  className="absolute right-3 top-1/2 -translate-y-1/2"
                  initial={{ scale: 0 }}
                  animate={form.district ? { scale: 1 } : { scale: 0 }}
                >
                  <CheckCircle2 size={16} className="text-emerald-500" />
                </motion.div>
              </div>
            </motion.div>

            {/* State */}
            <motion.div 
              className="space-y-2"
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <label className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                <Globe size={12} /> {t('profile.state')}
              </label>
              <select
                value={form.state}
                onChange={e => setForm(f => ({ ...f, state: e.target.value }))}
                className="w-full h-12 px-4 rounded-xl border-2 border-slate-700 bg-slate-800/50 focus:bg-slate-800 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/20 outline-none text-sm font-semibold text-white transition-all appearance-none cursor-pointer"
              >
                <option value="">{t('profile.state')}</option>
                {INDIAN_STATES.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </motion.div>

            {/* Language */}
            <motion.div 
              className="space-y-2"
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <label className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                <Globe size={12} /> {t('profile.language')}
              </label>
              <div className="h-12 flex items-center">
                <LanguageSwitcher />
              </div>
            </motion.div>
          </div>

          {/* Save Button */}
          <motion.div 
            className="flex items-center justify-between mt-8 pt-6 border-t border-slate-800 relative"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <p className="text-xs text-slate-500">
              {user?.createdAt && `Member since ${new Date(user.createdAt).toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })}`}
            </p>
            <motion.button
              onClick={handleSave}
              disabled={saving || uploading}
              className={`flex items-center gap-2 h-12 px-8 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-xl font-black text-sm shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40 disabled:opacity-60 disabled:cursor-not-allowed relative overflow-hidden ${
                showSuccess ? 'save-success' : ''
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {/* Success Overlay */}
              <AnimatePresence>
                {showSuccess && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 3 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 bg-emerald-400 rounded-xl"
                  />
                )}
              </AnimatePresence>

              {saving ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  Saving...
                </>
              ) : showSuccess ? (
                <>
                  <Check size={16} />
                  Saved!
                </>
              ) : (
                <>
                  <Save size={16} />
                  {t('profile.save')}
                </>
              )}
            </motion.button>
          </motion.div>
        </motion.div>

        {/* Security Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-slate-900/80 backdrop-blur-xl rounded-3xl border border-blue-500/20 shadow-xl shadow-blue-500/5 p-8 relative overflow-hidden"
        >
          {/* Animated Background */}
          <div className="absolute inset-0 opacity-5">
            <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(59,130,246,0.1)_25%,rgba(59,130,246,0.1)_50%,transparent_50%,transparent_75%,rgba(59,130,246,0.1)_75%,rgba(59,130,246,0.1))] bg-[length:20px_20px]" />
          </div>

          <div className="flex items-center gap-3 mb-6 relative">
            <motion.div 
              className="h-12 w-12 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/50"
              whileHover={{ rotate: 360, scale: 1.1 }}
              transition={{ duration: 0.6 }}
            >
              <Shield size={20} className="text-white" />
            </motion.div>
            <div>
              <h2 className="text-xl font-black text-white">Security & Verification</h2>
              <p className="text-xs text-slate-400">Account security status</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 relative">
            {[
              { label: "Email Verified", status: true, icon: Mail, color: "emerald" },
              { label: "KYC Status", status: user?.kycStatus === 'VERIFIED', icon: Shield, color: user?.kycStatus === 'VERIFIED' ? "emerald" : "amber" },
              { label: "2FA Security", status: false, icon: Sparkles, color: "slate" },
            ].map((item, i) => (
              <motion.div 
                key={i} 
                className={`flex items-center gap-3 p-4 rounded-2xl border-2 backdrop-blur-sm ${
                  item.status 
                    ? `bg-${item.color}-500/10 border-${item.color}-500/30` 
                    : 'bg-slate-800/30 border-slate-700/30'
                } relative overflow-hidden`}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 + i * 0.1 }}
                whileHover={{ scale: 1.05, y: -2 }}
              >
                <motion.div 
                  className={`h-10 w-10 rounded-xl ${
                    item.status ? `bg-${item.color}-500/20` : 'bg-slate-700/30'
                  } flex items-center justify-center relative`}
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.5 }}
                >
                  <item.icon size={18} className={
                    item.status ? `text-${item.color}-400` : 'text-slate-500'
                  } />
                </motion.div>
                <div>
                  <p className="text-sm font-black text-white">{item.label}</p>
                  <p className={`text-xs font-bold uppercase tracking-widest ${
                    item.status ? `text-${item.color}-400` : 'text-slate-500'
                  }`}>
                    {item.status ? '✓ Active' : '○ Inactive'}
                  </p>
                </div>
                {item.status && (
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent"
                    animate={{ x: ['-100%', '200%'] }}
                    transition={{ duration: 2, repeat: Infinity, delay: i * 0.5 }}
                  />
                )}
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
