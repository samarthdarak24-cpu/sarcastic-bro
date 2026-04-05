'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { authService } from '@/services/auth';
import { Eye, EyeOff, Mail, Lock, Loader2, Sprout, Wheat, Leaf } from 'lucide-react';
import BackendStatusBanner from '@/components/ui/BackendStatusBanner';

// Generate fixed particle positions to avoid hydration mismatch
const PARTICLES = Array.from({ length: 30 }, (_, i) => ({
  id: i,
  left: (i * 37 + 13) % 100, // Pseudo-random but deterministic
  top: (i * 53 + 29) % 100,
  width: ((i * 17) % 3) + 2,
  height: ((i * 19) % 3) + 2,
  duration: 4 + ((i * 23) % 3),
  delay: (i * 11) % 3,
}));

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.3 },
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
      y: [0, -10, 0],
      transition: {
        duration: 3,
        repeat: Infinity,
        ease: 'easeInOut',
      },
    },
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await authService.login({ email, password });

      console.log('Login response:', response);

      // Ensure data is stored
      if (typeof window !== 'undefined' && response.token) {
        localStorage.setItem('token', response.token);
        localStorage.setItem('user', JSON.stringify(response.user));
      }

      // Use window.location for reliable redirect
      if (response.user.role === 'FARMER') {
        window.location.href = '/farmer/dashboard';
      } else if (response.user.role === 'BUYER') {
        window.location.href = '/buyer/dashboard';
      }
    } catch (err: any) {
      console.error('Login error:', err);
      let errorMessage = 'Login failed. Please check your credentials and try again.';

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
      {/* Visible Agricultural Background */}
      <div className="absolute inset-0 z-0">
        {/* High-quality background image */}
        <motion.div
          className="absolute inset-0 z-0"
          initial={{ scale: 1.05 }}
          animate={{ scale: 1 }}
          transition={{ duration: 20, repeat: Infinity, repeatType: 'reverse' }}
        >
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: `url('https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=1920&q=80')`,
            }}
          />
        </motion.div>

        {/* Subtle dark overlay for readability */}
        <div className="absolute inset-0 bg-gradient-to-br from-black/40 via-black/30 to-black/50 z-5" />

        {/* Animated particles */}
        {PARTICLES.map((particle) => (
          <motion.div
            key={`particle-${particle.id}`}
            className="absolute rounded-full bg-white/20"
            style={{
              left: `${particle.left}%`,
              top: `${particle.top}%`,
              width: particle.width,
              height: particle.height,
            }}
            animate={{
              y: [0, -100 - (particle.id % 50), 0],
              opacity: [0, 0.6, 0],
              scale: [0, 1.5, 0],
            }}
            transition={{
              duration: particle.duration,
              repeat: Infinity,
              delay: particle.delay,
              ease: 'easeOut',
            }}
          />
        ))}
      </div>

      <BackendStatusBanner />
      
      {/* Left Side - Project Info */}
      <div className="absolute left-0 top-0 bottom-0 w-1/2 z-10 hidden lg:flex flex-col justify-center px-16">
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="space-y-8"
        >
          {/* Logo and Title */}
          <div>
            <motion.div
              className="inline-flex items-center gap-3 mb-6"
              whileHover={{ scale: 1.05 }}
            >
              <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-emerald-500 rounded-2xl flex items-center justify-center shadow-2xl">
                <Sprout className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-5xl font-black text-white">ODOP Connect</h1>
            </motion.div>
            <motion.p
              className="text-2xl text-white/90 font-semibold mb-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              Empowering Farmers, Connecting Markets
            </motion.p>
          </div>

          {/* Key Features */}
          <motion.div
            className="space-y-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            {[
              { icon: '🤖', title: 'AI-Powered Pricing', desc: 'Smart recommendations for optimal profits' },
              { icon: '🔗', title: 'Blockchain Security', desc: 'Transparent and secure transactions' },
              { icon: '📊', title: 'Real-time Analytics', desc: 'Market insights at your fingertips' },
              { icon: '🌾', title: 'Direct Market Access', desc: 'Connect with buyers nationwide' },
            ].map((feature, idx) => (
              <motion.div
                key={idx}
                className="flex items-start gap-4 bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.7 + idx * 0.1 }}
                whileHover={{ scale: 1.02, backgroundColor: 'rgba(255, 255, 255, 0.15)' }}
              >
                <span className="text-3xl">{feature.icon}</span>
                <div>
                  <h3 className="text-white font-bold text-lg">{feature.title}</h3>
                  <p className="text-white/80 text-sm">{feature.desc}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Stats */}
          <motion.div
            className="grid grid-cols-3 gap-4 pt-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 }}
          >
            {[
              { value: '10K+', label: 'Farmers' },
              { value: '500+', label: 'Buyers' },
              { value: '₹50Cr+', label: 'Transactions' },
            ].map((stat, idx) => (
              <motion.div
                key={idx}
                className="text-center bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20"
                whileHover={{ scale: 1.05 }}
              >
                <div className="text-3xl font-black text-white">{stat.value}</div>
                <div className="text-white/80 text-sm font-medium">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>
      
      {/* Right Side - Login Form */}
      <div className="flex-1 flex items-center justify-end px-4 py-12 relative z-20 lg:pr-16">
        <motion.div
          className="w-full max-w-md"
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
          {/* Header with Logo */}
          <motion.div variants={itemVariants} className="text-center mb-8">
            <motion.div
              className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-green-400 via-emerald-400 to-green-500 rounded-3xl mb-6 shadow-2xl relative"
              whileHover={{ scale: 1.1, rotate: 360 }}
              transition={{ type: 'spring', stiffness: 200, duration: 0.8 }}
            >
              <motion.div
                className="absolute inset-0 bg-gradient-to-br from-green-300 to-emerald-500 rounded-3xl blur-xl opacity-50"
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
                className="inline-block bg-gradient-to-r from-white via-green-100 to-white bg-clip-text text-transparent"
                animate={{
                  backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
                }}
                transition={{ duration: 5, repeat: Infinity }}
                style={{ backgroundSize: '200% auto' }}
              >
                Welcome Back
              </motion.span>
            </motion.h1>
            
            <motion.p
              className="text-green-100 text-xl font-medium"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              Sign in to <span className="font-bold text-white">ODOP Connect</span>
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
              className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-green-500/20"
              animate={{
                opacity: [0.3, 0.5, 0.3],
              }}
              transition={{ duration: 3, repeat: Infinity }}
            />
            
            {/* Decorative animated corners */}
            <motion.div
              className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-green-400/30 to-transparent rounded-bl-full"
              animate={{
                scale: [1, 1.2, 1],
                rotate: [0, 90, 0],
              }}
              transition={{ duration: 10, repeat: Infinity }}
            />
            <motion.div
              className="absolute bottom-0 left-0 w-40 h-40 bg-gradient-to-tr from-emerald-400/30 to-transparent rounded-tr-full"
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

            <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
              {/* Email */}
              <motion.div variants={itemVariants}>
                <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                  Email Address
                </label>
                <div className="relative group">
                  <motion.div
                    className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none"
                    whileHover={{ scale: 1.1 }}
                  >
                    <Mail className="w-5 h-5 text-gray-400 group-focus-within:text-green-600 transition-all duration-300" />
                  </motion.div>
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder="farmer@example.com"
                    className="w-full pl-12 pr-4 py-4 border-2 border-white/30 rounded-xl bg-white/90 backdrop-blur-sm focus:bg-white focus:border-green-400 focus:ring-4 focus:ring-green-300/50 focus:outline-none transition-all duration-300 text-gray-900 placeholder:text-gray-500 font-medium shadow-lg"
                  />
                </div>
              </motion.div>

              {/* Password */}
              <motion.div variants={itemVariants}>
                <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-2">
                  Password
                </label>
                <div className="relative group">
                  <motion.div
                    className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none"
                    whileHover={{ scale: 1.1 }}
                  >
                    <Lock className="w-5 h-5 text-gray-400 group-focus-within:text-green-600 transition-all duration-300" />
                  </motion.div>
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    placeholder="Enter your password"
                    className="w-full pl-12 pr-12 py-4 border-2 border-white/30 rounded-xl bg-white/90 backdrop-blur-sm focus:bg-white focus:border-green-400 focus:ring-4 focus:ring-green-300/50 focus:outline-none transition-all duration-300 text-gray-900 placeholder:text-gray-500 font-medium shadow-lg"
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
              </motion.div>

              {/* Submit */}
              <motion.button
                variants={itemVariants}
                type="submit"
                disabled={loading}
                whileHover={{ scale: 1.03, y: -3 }}
                whileTap={{ scale: 0.97 }}
                className="w-full bg-gradient-to-r from-green-500 via-emerald-500 to-green-600 hover:from-green-600 hover:via-emerald-600 hover:to-green-700 text-white font-black text-lg py-5 rounded-xl transition-all duration-300 shadow-2xl hover:shadow-green-500/50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 mt-8 relative overflow-hidden group"
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
                  className="absolute inset-0 bg-green-400 rounded-xl blur-xl opacity-50"
                  animate={{
                    scale: [1, 1.05, 1],
                    opacity: [0.3, 0.6, 0.3],
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
                
                {loading ? (
                  <>
                    <Loader2 className="w-6 h-6 animate-spin relative z-10" />
                    <span className="relative z-10">Signing in...</span>
                  </>
                ) : (
                  <>
                    <span className="relative z-10">Sign In</span>
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

              {/* Toggle to Register */}
              <motion.div variants={itemVariants} className="text-center pt-6">
                <p className="text-white/90 text-lg font-medium">
                  Don't have an account?{' '}
                  <Link
                    href="/register"
                    className="text-green-200 hover:text-white font-black transition-colors relative group"
                  >
                    <span className="relative">
                      Sign up
                      <motion.span
                        className="absolute bottom-0 left-0 h-1 bg-green-300 rounded-full"
                        initial={{ width: 0 }}
                        whileHover={{ width: '100%' }}
                        transition={{ duration: 0.3 }}
                      />
                    </span>
                  </Link>
                </p>
              </motion.div>
            </form>

            {/* Demo Info with Enhanced Design */}
            <motion.div
              variants={itemVariants}
              className="mt-8 pt-8 border-t-2 border-white/20 relative z-10"
            >
              <motion.p
                className="text-xs font-black text-white/80 mb-4 tracking-wider text-center"
                animate={{ opacity: [0.6, 1, 0.6] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                ⚡ DEMO CREDENTIALS ⚡
              </motion.p>
              <div className="space-y-3">
                <motion.div
                  className="bg-gradient-to-r from-green-500/30 via-emerald-500/30 to-green-500/30 backdrop-blur-sm px-5 py-3 rounded-xl border-2 border-green-300/30 relative overflow-hidden group"
                  whileHover={{ scale: 1.02, borderColor: 'rgba(134, 239, 172, 0.6)' }}
                >
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                    initial={{ x: '-100%' }}
                    whileHover={{ x: '100%' }}
                    transition={{ duration: 0.6 }}
                  />
                  <p className="text-sm font-mono text-white relative z-10">
                    <span className="font-black text-green-200">🌾 Farmer:</span> farmer@test.com / Farmer123
                  </p>
                </motion.div>
                <motion.div
                  className="bg-gradient-to-r from-blue-500/30 via-cyan-500/30 to-blue-500/30 backdrop-blur-sm px-5 py-3 rounded-xl border-2 border-blue-300/30 relative overflow-hidden group"
                  whileHover={{ scale: 1.02, borderColor: 'rgba(147, 197, 253, 0.6)' }}
                >
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                    initial={{ x: '-100%' }}
                    whileHover={{ x: '100%' }}
                    transition={{ duration: 0.6 }}
                  />
                  <p className="text-sm font-mono text-white relative z-10">
                    <span className="font-black text-blue-200">🛒 Buyer:</span> buyer@test.com / Buyer123
                  </p>
                </motion.div>
              </div>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
