'use client';

import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { User, ShoppingCart, Building2 } from 'lucide-react';

export default function TestDashboardsPage() {
  const router = useRouter();

  const setUserAndRedirect = (role: 'FARMER' | 'BUYER' | 'FPO', email: string, name: string) => {
    // Clear old data
    localStorage.clear();
    
    // Set new user data
    const user = {
      id: role.toLowerCase() + '-test-id',
      email,
      name,
      role
    };
    
    const token = 'test-token-' + Date.now();
    
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
    
    console.log('✅ Set user:', user);
    console.log('✅ Set token:', token);
    
    // Redirect based on role
    const dashboardUrl = role === 'FARMER' ? '/farmer/dashboard' :
                        role === 'BUYER' ? '/buyer/dashboard' :
                        '/fpo/dashboard';
    
    console.log('➡️ Redirecting to:', dashboardUrl);
    
    // Use window.location for hard redirect
    window.location.href = dashboardUrl;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 flex items-center justify-center p-8">
      <div className="max-w-4xl w-full">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-5xl font-black text-slate-900 mb-4">
            🎯 Dashboard Test Page
          </h1>
          <p className="text-xl text-slate-600 font-medium">
            Click any button to access the dashboard directly (bypasses login)
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Farmer Dashboard */}
          <motion.button
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            onClick={() => setUserAndRedirect('FARMER', 'farmer@test.com', 'Test Farmer')}
            className="group relative overflow-hidden bg-gradient-to-br from-green-500 to-emerald-600 rounded-3xl p-8 text-white shadow-2xl hover:shadow-green-500/50 transition-all hover:scale-105"
          >
            <div className="absolute top-0 right-0 opacity-10">
              <User size={120} />
            </div>
            <div className="relative z-10">
              <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mb-4 mx-auto">
                <User size={32} />
              </div>
              <h2 className="text-2xl font-black mb-2">Farmer Dashboard</h2>
              <p className="text-green-100 text-sm font-medium mb-4">
                Green theme • Crop management
              </p>
              <div className="text-xs font-bold bg-white/20 rounded-lg px-3 py-2">
                farmer@test.com
              </div>
            </div>
          </motion.button>

          {/* Buyer Dashboard */}
          <motion.button
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            onClick={() => setUserAndRedirect('BUYER', 'buyer@test.com', 'Test Buyer')}
            className="group relative overflow-hidden bg-gradient-to-br from-blue-500 to-cyan-600 rounded-3xl p-8 text-white shadow-2xl hover:shadow-blue-500/50 transition-all hover:scale-105"
          >
            <div className="absolute top-0 right-0 opacity-10">
              <ShoppingCart size={120} />
            </div>
            <div className="relative z-10">
              <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mb-4 mx-auto">
                <ShoppingCart size={32} />
              </div>
              <h2 className="text-2xl font-black mb-2">Buyer Dashboard</h2>
              <p className="text-blue-100 text-sm font-medium mb-4">
                Blue theme • Marketplace access
              </p>
              <div className="text-xs font-bold bg-white/20 rounded-lg px-3 py-2">
                buyer@test.com
              </div>
            </div>
          </motion.button>

          {/* FPO Dashboard */}
          <motion.button
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            onClick={() => setUserAndRedirect('FPO', 'fpo@test.com', 'Test FPO')}
            className="group relative overflow-hidden bg-gradient-to-br from-purple-500 to-indigo-600 rounded-3xl p-8 text-white shadow-2xl hover:shadow-purple-500/50 transition-all hover:scale-105"
          >
            <div className="absolute top-0 right-0 opacity-10">
              <Building2 size={120} />
            </div>
            <div className="relative z-10">
              <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mb-4 mx-auto">
                <Building2 size={32} />
              </div>
              <h2 className="text-2xl font-black mb-2">FPO Dashboard</h2>
              <p className="text-purple-100 text-sm font-medium mb-4">
                Purple theme • Organization hub
              </p>
              <div className="text-xs font-bold bg-white/20 rounded-lg px-3 py-2">
                fpo@test.com
              </div>
            </div>
          </motion.button>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-12 text-center"
        >
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-200">
            <h3 className="text-lg font-black text-slate-900 mb-3">
              📝 How to Use
            </h3>
            <ol className="text-left text-sm text-slate-600 space-y-2 max-w-2xl mx-auto">
              <li className="flex gap-2">
                <span className="font-black text-green-600">1.</span>
                <span>Click any dashboard button above</span>
              </li>
              <li className="flex gap-2">
                <span className="font-black text-blue-600">2.</span>
                <span>localStorage will be set with test credentials</span>
              </li>
              <li className="flex gap-2">
                <span className="font-black text-purple-600">3.</span>
                <span>You'll be redirected to the dashboard automatically</span>
              </li>
              <li className="flex gap-2">
                <span className="font-black text-orange-600">4.</span>
                <span>Open browser console (F12) to see debug logs</span>
              </li>
            </ol>
          </div>

          <div className="mt-6">
            <a
              href="/login"
              className="inline-block px-6 py-3 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition-colors"
            >
              ← Back to Login Page
            </a>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
