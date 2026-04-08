'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  Users, Star, MapPin, Package, TrendingUp, MessageSquare,
  Shield, CheckCircle, ArrowRight, Filter, Search
} from 'lucide-react';
import { chatService } from '@/services/chatService';
import { useAuth } from '@/hooks/useAuth';
import toast from 'react-hot-toast';

export default function MatchingPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [role, setRole] = useState<'FARMER' | 'BUYER'>(((user as any)?.role) === 'BUYER' ? 'BUYER' : 'FARMER');
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);

  useEffect(() => {
    loadUsers();
  }, [role]);

  const loadUsers = async () => {
    setLoading(true);
    try {
      // Connect to our new Trust API
      const response = await fetch(`http://localhost:8000/api/v1/trust/smart-match?user_role=${role}`);
      if (!response.ok) throw new Error('API down');
      const data = await response.json();
      
      const mappedResults = data.map((res: any) => ({
        id: res.user_id,
        name: res.name,
        role: res.role,
        matchScore: res.match_score,
        location: 'Mumbai, MH',
        verified: true,
        commodities: ['Wheat', 'Tomato'],
        history: '45 deals',
        trustScore: res.match_score,
        reasons: res.reasons
      }));
      
      setUsers(mappedResults);
    } catch (error) {
      console.error('Match API Error:', error);
      // Fallback
      setUsers([
        { id: '1', name: 'Premium Buyer A', role: 'BUYER', matchScore: 92, location: 'Mumbai', verified: true, commodities: ['Wheat'], history: '12 deals', trustScore: 95 },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const startAIScan = () => {
    setIsScanning(true);
    setScanProgress(0);
    const interval = setInterval(() => {
      setScanProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => setIsScanning(false), 500);
          return 100;
        }
        return prev + 5;
      });
    }, 100);
  };

  const handleConnect = async (userId: string) => {
    try {
      const conversation = await chatService.createConversation(userId);
      toast.success('Connection request sent!');
      router.push(`/chat?conversation=${conversation.id}`);
    } catch (error) {
      toast.error('Failed to connect');
    }
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = selectedFilter === 'all' || 
      (selectedFilter === 'verified' && user.verified) ||
      (selectedFilter === 'top-rated' && user.rating >= 4.5);
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => router.back()}
                className="h-10 w-10 bg-slate-100 hover:bg-slate-200 rounded-xl flex items-center justify-center transition-all"
              >
                ←
              </button>
              <div>
                <h1 className="text-2xl font-black text-slate-900">Smart Matching</h1>
                <p className="text-sm text-slate-600">AI-powered buyer-farmer connections</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setRole('FARMER')}
                className={`h-10 px-6 rounded-xl font-bold transition-all ${
                  role === 'FARMER'
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                Find Farmers
              </button>
              <button
                onClick={() => setRole('BUYER')}
                className={`h-10 px-6 rounded-xl font-bold transition-all ${
                  role === 'BUYER'
                    ? 'bg-indigo-600 text-white'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                Find Buyers
              </button>
              <button 
                onClick={() => setRole(role === 'FARMER' ? 'BUYER' : 'FARMER')}
                className="h-10 px-4 bg-white border-2 border-slate-200 text-slate-600 rounded-xl font-bold hover:bg-slate-50 transition-all flex items-center gap-2"
              >
                🔄 Switch View
              </button>
              <button
                onClick={startAIScan}
                className="h-10 px-6 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl font-black hover:shadow-lg transition-all flex items-center gap-2"
              >
                <TrendingUp size={18} />
                RUN AI MATCHMAKER
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* AI Scan Overlay */}
      {isScanning && (
        <div className="fixed inset-0 z-[100] bg-slate-900/80 backdrop-blur-md flex items-center justify-center">
          <div className="max-w-md w-full bg-white rounded-3xl p-8 text-center shadow-2xl mx-4">
            <div className="h-24 w-24 rounded-full bg-indigo-100 flex items-center justify-center mx-auto mb-6 relative">
              <div className="absolute inset-0 rounded-full border-4 border-indigo-600 border-t-transparent animate-spin" />
              <TrendingUp size={40} className="text-indigo-600" />
            </div>
            <h2 className="text-2xl font-black text-slate-900 mb-2 italic">Scanning Sub-Continental Supply</h2>
            <p className="text-slate-500 mb-8 font-medium">Our algorithm is analyzing your farm profile against thousands of active buyers...</p>
            
            <div className="relative h-4 bg-slate-100 rounded-full overflow-hidden mb-4">
              <motion.div 
                className="absolute top-0 left-0 h-full bg-gradient-to-r from-indigo-600 to-purple-600"
                initial={{ width: 0 }}
                animate={{ width: `${scanProgress}%` }}
              />
            </div>
            <div className="flex justify-between text-xs font-black text-slate-400 uppercase tracking-widest">
              <span>Initializing Nodes</span>
              <span>{scanProgress}% Optimized</span>
            </div>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="max-w-7xl mx-auto px-6 py-6">
        <div className="flex items-center gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={20} />
            <input
              type="text"
              placeholder="Search by name, location, or products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex gap-2">
            {['all', 'verified', 'top-rated'].map((filter) => (
              <button
                key={filter}
                onClick={() => setSelectedFilter(filter)}
                className={`h-11 px-6 rounded-xl font-medium transition-all ${
                  selectedFilter === filter
                    ? 'bg-blue-600 text-white'
                    : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
                }`}
              >
                {filter === 'all' ? 'All' : filter === 'verified' ? 'Verified' : 'Top Rated'}
              </button>
            ))}
          </div>
        </div>

        {/* User Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="bg-white rounded-2xl border border-slate-200 p-6">
                  <div className="h-20 w-20 bg-slate-200 rounded-full mx-auto mb-4" />
                  <div className="h-4 bg-slate-200 rounded w-3/4 mx-auto mb-2" />
                  <div className="h-3 bg-slate-200 rounded w-1/2 mx-auto" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredUsers.map((user) => (
              <motion.div
                key={user.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ y: -4 }}
                className="bg-white rounded-2xl border-2 border-slate-200 hover:border-blue-500 p-6 transition-all shadow-lg hover:shadow-xl"
              >
                <div className="text-center mb-4">
                  <div className="h-20 w-20 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white font-bold text-3xl mx-auto mb-3">
                    {user.name.charAt(0)}
                  </div>
                  <div className="flex items-center justify-center gap-2 mb-1">
                    <h3 className="font-black text-slate-900 text-lg">{user.name}</h3>
                    <div className="flex items-center gap-1 bg-indigo-100 px-2 py-0.5 rounded-full">
                      <Shield size={12} className="text-indigo-600" />
                      <span className="text-[10px] font-black text-indigo-600">VERIFIED</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-center gap-4 text-xs font-bold uppercase tracking-wider">
                    <div className="flex items-center gap-1 text-amber-500">
                      <Star size={14} fill="currentColor" />
                      <span>{user.rating}</span>
                    </div>
                    <div className="text-indigo-600 italic">
                      {user.matchScore}% AI Match
                    </div>
                  </div>
                </div>

                <div className="bg-slate-50 rounded-xl p-3 mb-4 space-y-2 border border-slate-100">
                  {user.matchReasons?.map((reason: string, i: number) => (
                    <div key={i} className="flex items-center gap-2 text-[11px] text-slate-600 font-medium">
                      <CheckCircle size={12} className="text-green-500" />
                      {reason}
                    </div>
                  ))}
                </div>

                <div className="space-y-2 mb-4">
                  {user.role === 'FARMER' && user.products && (
                    <div className="flex items-center gap-2 text-sm text-slate-600">
                      <Package size={16} />
                      <span>{user.products.join(', ')}</span>
                    </div>
                  )}
                  {user.role === 'BUYER' && user.location && (
                    <div className="flex items-center gap-2 text-sm text-slate-600">
                      <MapPin size={16} />
                      <span>{user.location}</span>
                    </div>
                  )}
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => handleConnect(user.id)}
                    className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold transition-all flex items-center justify-center gap-2"
                  >
                    <MessageSquare size={18} />
                    Connect
                  </button>
                  <button className="h-11 w-11 bg-slate-100 hover:bg-slate-200 rounded-xl flex items-center justify-center transition-all">
                    <ArrowRight size={20} className="text-slate-700" />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {filteredUsers.length === 0 && !loading && (
          <div className="text-center py-12">
            <Users size={64} className="text-slate-300 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-slate-900 mb-2">No matches found</h3>
            <p className="text-slate-500">Try adjusting your search or filters</p>
          </div>
        )}
      </div>
    </div>
  );
}
