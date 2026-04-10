'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import { useFPOLinking, LinkedFarmer } from '@/hooks/useFPOLinking';
import { useAuth } from '@/hooks/useAuth';

export default function LinkedFarmers() {
  const router = useRouter();
  const { t } = useTranslation();
  const { user } = useAuth();
  const { getLinkedFarmers, toggleFarmerStatus, loading, error } = useFPOLinking();

  const [farmers, setFarmers] = useState<LinkedFarmer[]>([]);
  const [pageLoading, setPageLoading] = useState(true);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterActive, setFilterActive] = useState<'ALL' | 'ACTIVE' | 'INACTIVE'>('ALL');

  // Load farmers
  useEffect(() => {
    const loadFarmers = async () => {
      try {
        setPageLoading(true);
        const data = await getLinkedFarmers();
        setFarmers(Array.isArray(data) ? data : []);
      } catch (err: any) {
        setErrorMessage(err.message || 'Failed to load farmers');
      } finally {
        setPageLoading(false);
      }
    };

    if (user) {
      loadFarmers();
    }
  }, [user, getLinkedFarmers]);

  const handleToggleStatus = async (farmerId: string) => {
    try {
      setErrorMessage('');
      setSuccessMessage('');
      await toggleFarmerStatus(farmerId);
      setSuccessMessage(t('fpoLinking.statusUpdated'));
      
      // Refresh list
      const data = await getLinkedFarmers();
      setFarmers(Array.isArray(data) ? data : []);
    } catch (err: any) {
      setErrorMessage(err.message || t('fpoLinking.updateFailed'));
    }
  };

  const filteredFarmers = Array.isArray(farmers) ? farmers.filter(farmer => {
    const matchesSearch = farmer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         farmer.phone.includes(searchTerm);
    const matchesFilter = filterActive === 'ALL' || 
                         (filterActive === 'ACTIVE' && farmer.isActive) ||
                         (filterActive === 'INACTIVE' && !farmer.isActive);
    return matchesSearch && matchesFilter;
  }) : [];

  if (pageLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-4">
            <button onClick={() => router.push('/fpo')} className="text-gray-600 hover:text-gray-900">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{t('fpoLinking.linkedFarmers')}</h1>
              <p className="text-sm text-gray-600">{t('fpoLinking.manageFarmers')}</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Messages */}
        {successMessage && (
          <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4 flex items-start gap-3">
            <svg className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <p className="text-green-800">{successMessage}</p>
          </div>
        )}

        {(errorMessage || error) && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
            <svg className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            <p className="text-red-800">{errorMessage || error}</p>
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <p className="text-sm text-gray-600 mb-1">{t('fpoLinking.totalFarmers')}</p>
            <p className="text-3xl font-bold text-gray-900">{farmers.length}</p>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <p className="text-sm text-gray-600 mb-1">{t('fpoLinking.activeFarmers')}</p>
            <p className="text-3xl font-bold text-green-600">{farmers.filter(f => f.isActive).length}</p>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <p className="text-sm text-gray-600 mb-1">{t('fpoLinking.inactiveFarmers')}</p>
            <p className="text-3xl font-bold text-red-600">{farmers.filter(f => !f.isActive).length}</p>
          </div>
        </div>

        {/* Search & Filter */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">{t('fpoLinking.search')}</label>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder={t('fpoLinking.searchByNameOrPhone')}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">{t('fpoLinking.filterByStatus')}</label>
              <select
                value={filterActive}
                onChange={(e) => setFilterActive(e.target.value as any)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                <option value="ALL">{t('fpoLinking.all')}</option>
                <option value="ACTIVE">{t('fpoLinking.active')}</option>
                <option value="INACTIVE">{t('fpoLinking.inactive')}</option>
              </select>
            </div>
          </div>
        </div>

        {/* Farmers Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          {filteredFarmers.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">{t('fpoLinking.name')}</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">{t('fpoLinking.phone')}</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">{t('fpoLinking.district')}</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">{t('fpoLinking.crops')}</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">{t('fpoLinking.status')}</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">{t('fpoLinking.actions')}</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {filteredFarmers.map((farmer) => (
                    <tr key={farmer.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <div>
                          <p className="font-medium text-gray-900">{farmer.name}</p>
                          <p className="text-sm text-gray-600">{farmer.aadhaar ? '****' + farmer.aadhaar.slice(-4) : 'N/A'}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-gray-900">{farmer.phone}</td>
                      <td className="px-6 py-4 text-gray-900">{farmer.district || 'N/A'}</td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                          {farmer.cropsCount} {t('fpoLinking.crops')}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                          farmer.isActive
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {farmer.isActive ? t('fpoLinking.active') : t('fpoLinking.inactive')}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => handleToggleStatus(farmer.id)}
                          disabled={loading}
                          className={`py-2 px-4 rounded-lg text-sm font-medium transition-colors ${
                            farmer.isActive
                              ? 'bg-red-100 text-red-600 hover:bg-red-200'
                              : 'bg-green-100 text-green-600 hover:bg-green-200'
                          } disabled:opacity-50`}
                        >
                          {loading ? t('common.loading') : (farmer.isActive ? t('fpoLinking.deactivate') : t('fpoLinking.activate'))}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="p-12 text-center">
              <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              <h3 className="text-lg font-medium text-gray-900 mb-2">{t('fpoLinking.noFarmers')}</h3>
              <p className="text-gray-600">{t('fpoLinking.noFarmersMessage')}</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
