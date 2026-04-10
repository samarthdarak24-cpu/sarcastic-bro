'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { authService } from '@/services/auth';
import {
  Eye, EyeOff, Mail, Lock, User, Phone, Leaf, ShoppingBag,
  Loader2, CheckCircle2, XCircle, Sprout, Wheat, Tractor
} from 'lucide-react';
import BackendStatusBanner from '@/components/ui/BackendStatusBanner';

export default function RegisterPage() {
  const router = useRouter();
  const [role, setRole] = useState<'FARMER' | 'BUYER' | 'FPO'>('FARMER');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
  });

  // Password validation
  const validatePassword = (password: string) => {
    const hasMinLength = password.length >= 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumber = /[0-9]/.test(password);

    return {
      isValid: hasMinLength && hasUpperCase && hasLowerCase && hasNumber,
      hasMinLength,
      hasUpperCase,
      hasLowerCase,
      hasNumber,
    };
  };

  const passwordValidation = validatePassword(formData.password);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.08, delayChildren: 0.3 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: 'easeOut' },
    },
  };

  const floatingVariants = {
    animate: {
      y: [0, -15, 0],
      rotate: [0, 5, 0],
      transition: {
        duration: 4,
        repeat: Infinity,
        ease: 'easeInOut',
      },
    },
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!passwordValidation.isValid) {
      setError('Please ensure your password meets all requirements.');
      return;
    }

    setLoading(true);

    try {
      const response = await authService.register({
        ...formData,
        role,
      });

      console.log('✅ Registration successful:', response);

      // Ensure data is stored synchronously
      if (typeof window !== 'undefined' && response.token) {
        localStorage.setItem('token', response.token);
        localStorage.setItem('user', JSON.stringify(response.user));
        if (response.tokens?.refreshToken) {
          localStorage.setItem('refreshToken', response.tokens.refreshToken);
        }
        console.log('✅ Stored in localStorage:', {
          token: localStorage.getItem('token'),
          user: localStorage.getItem('user')
        });
      }

      // Route based on user role
      const userRole = response.user.role;
      console.log('🔀 Routing user with role:', userRole);

      // Use window.location for reliable redirect
      if (userRole === 'FARMER') {
        window.location.href = '/farmer/dashboard';
      } else if (userRole === 'BUYER') {
        window.location.href = '/buyer/dashboard';
      } else if (userRole === 'FPO') {
        window.location.href = '/fpo/dashboard';
      } else {
        throw new Error('Invalid user role');
      }
    } catch (err: any) {
      console.error('❌ Register error:', err);
      let errorMessage = 'Registration failed. Please try again.';

      if (err.response?.data?.message) {
        errorMessage = err.response.data.message;
      } else if (err.response?.data?.error) {
        errorMessage = err.response.data.error;
      } else if (err.message) {
        errorMessage = err.message;
      }

      if (err.response?.data?.errors) {
        const errors = err.response.data.errors;
        if (Array.isArray(errors)) {
          errorMessage = errors.map((e: any) => e.message || e).join(', ');
        }
      }

      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden flex flex-col">
      {/* Epic Agricultural Background with Real Images - 50/50 Split */}
      <div className="absolute inset-0 z-0">
        {/* Left Side - Farm/Agriculture Image (50%) */}
        <motion.div
          className="absolute inset-y-0 left-0 w-1/2 z-0 overflow-hidden"
          initial={{ x: -100, opacity: 0 }}
          animate={{ 
            x: 0,
            opacity: 1,
            scale: [1, 1.05, 1]
          }}
          transition={{ 
            x: { duration: 1 },
            opacity: { duration: 1 },
            scale: { duration: 15, repeat: Infinity, repeatType: 'reverse' }
          }}
        >
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: `url('https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=1920&q=80')`,
              filter: 'brightness(0.6)',
            }}
          />
          {/* Gradient fade to center */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-black/40" />
        </motion.div>

        {/* Right Side - Industry/Warehouse Image (50%) */}
        <motion.div
          className="absolute inset-y-0 right-0 w-1/2 z-0 overflow-hidden"
          initial={{ x: 100, opacity: 0 }}
          animate={{ 
            x: 0,
            opacity: 1,
            scale: [1, 1.05, 1]
          }}
          transition={{ 
            x: { duration: 1 },
            opacity: { duration: 1 },
            scale: { duration: 15, repeat: Infinity, repeatType: 'reverse', delay: 7.5 }
          }}
        >
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: `url('https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=1920&q=80')`,
              filter: 'brightness(0.6)',
            }}
          />
          {/* Gradient fade to center */}
          <div className="absolute inset-0 bg-gradient-to-l from-transparent via-transparent to-black/40" />
        </motion.div>

        {/* Center divider line with glow effect */}
        <motion.div
          className="absolute inset-y-0 left-1/2 w-1 z-10 -ml-0.5"
          animate={{
            opacity: [0.3, 0.8, 0.3],
            boxShadow: [
              '0 0 20px rgba(16, 185, 129, 0.3)',
              '0 0 40px rgba(16, 185, 129, 0.6)',
              '0 0 20px rgba(16, 185, 129, 0.3)'
            ]
          }}
          transition={{ duration: 3, repeat: Infinity }}
          style={{
            background: 'linear-gradient(to bottom, transparent, rgba(16, 185, 129, 0.8), transparent)'
          }}
        />

        {/* Subtle dark overlay for readability */}
        <div className="absolute inset-0 z-5 bg-black/30" />

        {/* Floating agricultural icons with glow */}
        <motion.div
          className="absolute top-16 right-16 filter drop-shadow-2xl"
          animate={{
            y: [0, -35, 0],
            rotate: [0, 15, 0],
            scale: [1, 1.15, 1],
          }}
          transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
        >
          <div className="relative">
            <div className="absolute inset-0 bg-emerald-400 blur-3xl opacity-50 rounded-full" />
            <Tractor className="w-44 h-44 text-emerald-300/40 relative z-10" />
          </div>
        </motion.div>

        <motion.div
          className="absolute bottom-24 left-12 filter drop-shadow-2xl"
          animate={{
            y: [0, -30, 0],
            rotate: [0, -10, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut', delay: 1.2 }}
        >
          <div className="relative">
            <div className="absolute inset-0 bg-green-400 blur-3xl opacity-50 rounded-full" />
            <Wheat className="w-36 h-36 text-green-300/40 relative z-10" />
          </div>
        </motion.div>

        <motion.div
          className="absolute top-1/3 left-16 filter drop-shadow-2xl"
          animate={{
            y: [0, -20, 0],
            rotate: [0, 25, 0],
            x: [0, 15, 0],
          }}
          transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 0.6 }}
        >
          <div className="relative">
            <div className="absolute inset-0 bg-green-400 blur-2xl opacity-40 rounded-full" />
            <Leaf className="w-28 h-28 text-green-300/30 relative z-10" />
          </div>
        </motion.div>

        {/* Animated light rays */}
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={`ray-${i}`}
            className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-white/20 via-emerald-300/10 to-transparent"
            style={{
              left: `${15 + i * 18}%`,
              transformOrigin: 'top',
            }}
            animate={{
              scaleY: [0, 1, 0],
              opacity: [0, 0.6, 0],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              delay: i * 0.5,
              ease: 'easeInOut',
            }}
          />
        ))}

        {/* Enhanced particles with trails - Fixed positions to avoid hydration mismatch */}
        {Array.from({ length: 45 }, (_, i) => ({
          id: i,
          left: (i * 41 + 17) % 100,
          top: (i * 47 + 23) % 100,
          width: ((i * 13) % 4) + 2,
          height: ((i * 19) % 4) + 2,
          yOffset: 120 + ((i * 31) % 100),
          xOffset: ((i * 29) % 60) - 30,
          duration: 4 + ((i * 17) % 4),
          delay: (i * 7) % 3,
          color: i % 3 === 0 ? 'rgba(167, 243, 208, 0.8)' : i % 3 === 1 ? 'rgba(110, 231, 183, 0.8)' : 'rgba(52, 211, 153, 0.8)',
        })).map((particle) => (
          <motion.div
            key={`particle-${particle.id}`}
            className="absolute rounded-full"
            style={{
              left: `${particle.left}%`,
              top: `${particle.top}%`,
              width: particle.width,
              height: particle.height,
              background: `radial-gradient(circle, ${particle.color}, transparent)`,
            }}
            animate={{
              y: [0, -particle.yOffset, 0],
              x: [0, particle.xOffset, 0],
              opacity: [0, 1, 0],
              scale: [0, 1.8, 0],
            }}
            transition={{
              duration: particle.duration,
              repeat: Infinity,
              delay: particle.delay,
              ease: 'easeOut',
            }}
          />
        ))}

        {/* Glowing orbs - Fixed positions to avoid hydration mismatch */}
        {Array.from({ length: 10 }, (_, i) => ({
          id: i,
          left: (i * 43 + 19) % 100,
          top: (i * 51 + 27) % 100,
          width: ((i * 23) % 150) + 100,
          height: ((i * 29) % 150) + 100,
          xOffset: ((i * 37) % 120) - 60,
          yOffset: ((i * 41) % 120) - 60,
          duration: 12 + ((i * 19) % 10),
          delay: (i * 13) % 5,
          color: i % 2 === 0 ? 'rgba(16, 185, 129, 0.3)' : 'rgba(5, 150, 105, 0.3)',
        })).map((orb) => (
          <motion.div
            key={`orb-${orb.id}`}
            className="absolute rounded-full blur-2xl"
            style={{
              left: `${orb.left}%`,
              top: `${orb.top}%`,
              width: orb.width,
              height: orb.height,
              background: `radial-gradient(circle, ${orb.color}, transparent)`,
            }}
            animate={{
              scale: [1, 1.6, 1],
              opacity: [0.3, 0.7, 0.3],
              x: [0, orb.xOffset, 0],
              y: [0, orb.yOffset, 0],
            }}
            transition={{
              duration: orb.duration,
              repeat: Infinity,
              delay: orb.delay,
            }}
          />
        ))}
      </div>

      <BackendStatusBanner />
      
      <div className="flex-1 flex items-center justify-center px-4 py-12 relative z-20">
        <motion.div
          className="w-full max-w-md"
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
          {/* Header with Logo */}
          <motion.div variants={itemVariants} className="text-center mb-8">
            <motion.div
              className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-emerald-400 via-green-400 to-emerald-500 rounded-3xl mb-6 shadow-2xl relative"
              whileHover={{ scale: 1.1, rotate: -360 }}
              transition={{ type: 'spring', stiffness: 200, duration: 0.8 }}
            >
              <motion.div
                className="absolute inset-0 bg-gradient-to-br from-emerald-300 to-green-500 rounded-3xl blur-xl opacity-50"
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.5, 0.8, 0.5],
                }}
                transition={{ duration: 2, repeat: Infinity }}
              />
              <Sprout className="w-12 h-12 text-white relative z-10" />
            </motion.div>
            
            <motion.h1
              className="text-6xl font-black text-white mb-4 tracking-tight"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <motion.span
                className="inline-block bg-gradient-to-r from-white via-emerald-100 to-white bg-clip-text text-transparent"
                animate={{
                  backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
                }}
                transition={{ duration: 5, repeat: Infinity }}
                style={{ backgroundSize: '200% auto' }}
              >
                Join AgriConnect
              </motion.span>
            </motion.h1>
            
            <motion.p
              className="text-emerald-100 text-xl font-medium"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              Start your <span className="font-bold text-white">agricultural journey</span> today
            </motion.p>
          </motion.div>

          {/* Card with Ultra Glass Effect */}
          <motion.div
            variants={itemVariants}
            className="bg-white/10 backdrop-blur-2xl rounded-3xl shadow-2xl p-10 border-2 border-white/30 relative overflow-hidden"
            whileHover={{ 
              boxShadow: '0 30px 60px -12px rgba(16, 185, 129, 0.5), 0 0 100px rgba(16, 185, 129, 0.3)',
              scale: 1.01,
            }}
            transition={{ duration: 0.3 }}
          >
            {/* Animated background effects */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-emerald-500/20"
              animate={{
                opacity: [0.3, 0.5, 0.3],
              }}
              transition={{ duration: 3, repeat: Infinity }}
            />
            
            {/* Decorative animated corners */}
            <motion.div
              className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-emerald-400/30 to-transparent rounded-bl-full"
              animate={{
                scale: [1, 1.2, 1],
                rotate: [0, 90, 0],
              }}
              transition={{ duration: 10, repeat: Infinity }}
            />
            <motion.div
              className="absolute bottom-0 left-0 w-40 h-40 bg-gradient-to-tr from-green-400/30 to-transparent rounded-tr-full"
              animate={{
                scale: [1, 1.2, 1],
                rotate: [0, -90, 0],
              }}
              transition={{ duration: 10, repeat: Infinity, delay: 5 }}
            />
            
            {/* Error Message */}
            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.95 }}
                  className="mb-6 bg-red-50 border-l-4 border-red-500 p-4 rounded-xl shadow-sm"
                >
                  <p className="text-red-700 text-sm font-medium">{error}</p>
                </motion.div>
              )}
            </AnimatePresence>

            <form onSubmit={handleSubmit} className="space-y-5 relative z-10">
              {/* Role Selection */}
              <motion.div variants={itemVariants}>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  I am a
                </label>
                <div className="grid grid-cols-3 gap-3">
                  <motion.button
                    type="button"
                    onClick={() => setRole('FARMER')}
                    whileHover={{ scale: 1.03, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    className={`flex flex-col items-center justify-center gap-2 px-3 py-4 rounded-xl font-bold transition-all duration-300 border-2 relative overflow-hidden ${
                      role === 'FARMER'
                        ? 'bg-gradient-to-br from-green-600 to-emerald-600 text-white border-green-600 shadow-xl'
                        : 'bg-white text-gray-700 border-gray-200 hover:border-green-300 hover:shadow-md'
                    }`}
                  >
                    {role === 'FARMER' && (
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0"
                        initial={{ x: '-100%' }}
                        animate={{ x: '100%' }}
                        transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 0.5 }}
                      />
                    )}
                    <Leaf className="w-5 h-5 relative z-10" />
                    <span className="relative z-10 text-sm">Farmer</span>
                  </motion.button>
                  <motion.button
                    type="button"
                    onClick={() => setRole('BUYER')}
                    whileHover={{ scale: 1.03, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    className={`flex flex-col items-center justify-center gap-2 px-3 py-4 rounded-xl font-bold transition-all duration-300 border-2 relative overflow-hidden ${
                      role === 'BUYER'
                        ? 'bg-gradient-to-br from-blue-600 to-cyan-600 text-white border-blue-600 shadow-xl'
                        : 'bg-white text-gray-700 border-gray-200 hover:border-blue-300 hover:shadow-md'
                    }`}
                  >
                    {role === 'BUYER' && (
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0"
                        initial={{ x: '-100%' }}
                        animate={{ x: '100%' }}
                        transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 0.5 }}
                      />
                    )}
                    <ShoppingBag className="w-5 h-5 relative z-10" />
                    <span className="relative z-10 text-sm">Buyer</span>
                  </motion.button>
                  <motion.button
                    type="button"
                    onClick={() => setRole('FPO')}
                    whileHover={{ scale: 1.03, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    className={`flex flex-col items-center justify-center gap-2 px-3 py-4 rounded-xl font-bold transition-all duration-300 border-2 relative overflow-hidden ${
                      role === 'FPO'
                        ? 'bg-gradient-to-br from-purple-600 to-indigo-600 text-white border-purple-600 shadow-xl'
                        : 'bg-white text-gray-700 border-gray-200 hover:border-purple-300 hover:shadow-md'
                    }`}
                  >
                    {role === 'FPO' && (
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0"
                        initial={{ x: '-100%' }}
                        animate={{ x: '100%' }}
                        transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 0.5 }}
                      />
                    )}
                    <Tractor className="w-5 h-5 relative z-10" />
                    <span className="relative z-10 text-sm">FPO</span>
                  </motion.button>
                </div>
              </motion.div>

              {/* Full Name */}
              <motion.div variants={itemVariants}>
                <label htmlFor="name" className="block text-sm font-semibold text-white/90 mb-2">
                  Full Name
                </label>
                <div className="relative group">
                  <motion.div
                    className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none"
                    whileHover={{ scale: 1.1 }}
                  >
                    <User className="w-5 h-5 text-gray-400 group-focus-within:text-emerald-600 transition-all duration-300" />
                  </motion.div>
                  <input
                    id="name"
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                    placeholder="John Doe"
                    className="w-full pl-12 pr-4 py-4 border-2 border-white/30 rounded-xl bg-white/90 backdrop-blur-sm focus:bg-white focus:border-emerald-400 focus:ring-4 focus:ring-emerald-300/50 focus:outline-none transition-all duration-300 text-gray-900 placeholder:text-gray-500 font-medium shadow-lg"
                  />
                </div>
              </motion.div>

              {/* Email */}
              <motion.div variants={itemVariants}>
                <label htmlFor="email" className="block text-sm font-semibold text-white/90 mb-2">
                  Email Address
                </label>
                <div className="relative group">
                  <motion.div
                    className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none"
                    whileHover={{ scale: 1.1 }}
                  >
                    <Mail className="w-5 h-5 text-gray-400 group-focus-within:text-emerald-600 transition-all duration-300" />
                  </motion.div>
                  <input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                    placeholder="john@example.com"
                    className="w-full pl-12 pr-4 py-4 border-2 border-white/30 rounded-xl bg-white/90 backdrop-blur-sm focus:bg-white focus:border-emerald-400 focus:ring-4 focus:ring-emerald-300/50 focus:outline-none transition-all duration-300 text-gray-900 placeholder:text-gray-500 font-medium shadow-lg"
                  />
                </div>
              </motion.div>

              {/* Phone */}
              <motion.div variants={itemVariants}>
                <label htmlFor="phone" className="block text-sm font-semibold text-white/90 mb-2">
                  Phone Number <span className="text-white/60 font-normal text-xs">(Optional)</span>
                </label>
                <div className="relative group">
                  <motion.div
                    className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none"
                    whileHover={{ scale: 1.1 }}
                  >
                    <Phone className="w-5 h-5 text-gray-400 group-focus-within:text-emerald-600 transition-all duration-300" />
                  </motion.div>
                  <input
                    id="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+91 98765 43210"
                    className="w-full pl-12 pr-4 py-4 border-2 border-white/30 rounded-xl bg-white/90 backdrop-blur-sm focus:bg-white focus:border-emerald-400 focus:ring-4 focus:ring-emerald-300/50 focus:outline-none transition-all duration-300 text-gray-900 placeholder:text-gray-500 font-medium shadow-lg"
                  />
                </div>
              </motion.div>

              {/* Password */}
              <motion.div variants={itemVariants}>
                <label htmlFor="password" className="block text-sm font-semibold text-white/90 mb-2">
                  Password
                </label>
                <div className="relative group">
                  <motion.div
                    className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none"
                    whileHover={{ scale: 1.1 }}
                  >
                    <Lock className="w-5 h-5 text-gray-400 group-focus-within:text-emerald-600 transition-all duration-300" />
                  </motion.div>
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    required
                    placeholder="••••••••"
                    className="w-full pl-12 pr-12 py-4 border-2 border-white/30 rounded-xl bg-white/90 backdrop-blur-sm focus:bg-white focus:border-emerald-400 focus:ring-4 focus:ring-emerald-300/50 focus:outline-none transition-all duration-300 text-gray-900 placeholder:text-gray-500 font-medium shadow-lg"
                  />
                  <motion.button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </motion.button>
                </div>

                {/* Password Requirements */}
                <AnimatePresence>
                  {formData.password && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="mt-4 space-y-2 bg-white/20 backdrop-blur-sm p-5 rounded-xl border-2 border-white/30 shadow-lg"
                    >
                      <p className="text-xs font-black text-white/90 mb-3 tracking-wider">
                        PASSWORD REQUIREMENTS:
                      </p>
                      <div className="space-y-2.5">
                        <motion.div
                          initial={{ x: -10, opacity: 0 }}
                          animate={{ x: 0, opacity: 1 }}
                          transition={{ delay: 0.1 }}
                          className={`flex items-center text-sm font-bold ${
                            passwordValidation.hasMinLength
                              ? 'text-green-200'
                              : 'text-white/60'
                          }`}
                        >
                          {passwordValidation.hasMinLength ? (
                            <CheckCircle2 className="w-5 h-5 mr-2 flex-shrink-0" />
                          ) : (
                            <XCircle className="w-5 h-5 mr-2 flex-shrink-0" />
                          )}
                          At least 8 characters
                        </motion.div>
                        <motion.div
                          initial={{ x: -10, opacity: 0 }}
                          animate={{ x: 0, opacity: 1 }}
                          transition={{ delay: 0.15 }}
                          className={`flex items-center text-sm font-bold ${
                            passwordValidation.hasUpperCase
                              ? 'text-green-200'
                              : 'text-white/60'
                          }`}
                        >
                          {passwordValidation.hasUpperCase ? (
                            <CheckCircle2 className="w-5 h-5 mr-2 flex-shrink-0" />
                          ) : (
                            <XCircle className="w-5 h-5 mr-2 flex-shrink-0" />
                          )}
                          One uppercase letter (A-Z)
                        </motion.div>
                        <motion.div
                          initial={{ x: -10, opacity: 0 }}
                          animate={{ x: 0, opacity: 1 }}
                          transition={{ delay: 0.2 }}
                          className={`flex items-center text-sm font-bold ${
                            passwordValidation.hasLowerCase
                              ? 'text-green-200'
                              : 'text-white/60'
                          }`}
                        >
                          {passwordValidation.hasLowerCase ? (
                            <CheckCircle2 className="w-5 h-5 mr-2 flex-shrink-0" />
                          ) : (
                            <XCircle className="w-5 h-5 mr-2 flex-shrink-0" />
                          )}
                          One lowercase letter (a-z)
                        </motion.div>
                        <motion.div
                          initial={{ x: -10, opacity: 0 }}
                          animate={{ x: 0, opacity: 1 }}
                          transition={{ delay: 0.25 }}
                          className={`flex items-center text-sm font-bold ${
                            passwordValidation.hasNumber
                              ? 'text-green-200'
                              : 'text-white/60'
                          }`}
                        >
                          {passwordValidation.hasNumber ? (
                            <CheckCircle2 className="w-5 h-5 mr-2 flex-shrink-0" />
                          ) : (
                            <XCircle className="w-5 h-5 mr-2 flex-shrink-0" />
                          )}
                          One number (0-9)
                        </motion.div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>

              {/* Submit */}
              <motion.button
                variants={itemVariants}
                type="submit"
                disabled={loading || !passwordValidation.isValid}
                whileHover={{ scale: 1.03, y: -3 }}
                whileTap={{ scale: 0.97 }}
                className="w-full bg-gradient-to-r from-emerald-500 via-green-500 to-emerald-600 hover:from-emerald-600 hover:via-green-600 hover:to-emerald-700 text-white font-black text-lg py-5 rounded-xl transition-all duration-300 shadow-2xl hover:shadow-emerald-500/50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 mt-8 relative overflow-hidden group"
              >
                {/* Animated shine effect */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent skew-x-12"
                  initial={{ x: '-200%' }}
                  animate={{ x: '200%' }}
                  transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
                />
                
                {/* Pulsing glow */}
                <motion.div
                  className="absolute inset-0 bg-emerald-400 rounded-xl blur-xl opacity-50"
                  animate={{
                    scale: [1, 1.05, 1],
                    opacity: [0.3, 0.6, 0.3],
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
                
                {loading ? (
                  <>
                    <Loader2 className="w-6 h-6 animate-spin relative z-10" />
                    <span className="relative z-10">Creating Account...</span>
                  </>
                ) : (
                  <>
                    <span className="relative z-10">Create Account</span>
                    <motion.span
                      className="relative z-10 text-2xl"
                      animate={{ x: [0, 5, 0] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    >
                      →
                    </motion.span>
                  </>
                )}
              </motion.button>

              {/* Toggle to Login */}
              <motion.div variants={itemVariants} className="text-center pt-6">
                <p className="text-white/90 text-lg font-medium">
                  Already have an account?{' '}
                  <Link
                    href="/login"
                    className="text-emerald-200 hover:text-white font-black transition-colors relative group"
                  >
                    <span className="relative">
                      Sign In
                      <motion.span
                        className="absolute bottom-0 left-0 h-1 bg-emerald-300 rounded-full"
                        initial={{ width: 0 }}
                        whileHover={{ width: '100%' }}
                        transition={{ duration: 0.3 }}
                      />
                    </span>
                  </Link>
                </p>
              </motion.div>
            </form>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
