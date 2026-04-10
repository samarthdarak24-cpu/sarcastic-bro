'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import { useFPOLinking, FPO, FPOStatus } from '@/hooks/useFPOLinking';
import { useAuth } from '@/hooks/useAuth';

export default function FarmerFPO() {
  const router = useRouter();
  const { t } = useTranslation();
  const { user } = useAuth();
  const { searchFPOs, createLinkRequest, getMyFPOStatus, unlinkFromFPO, loading, error } = useFPOLinking();

  const [fpos, setFpos] = useState<FPO[]>([]);
  const [fpoStatus, setFpoStatus] = useState<FPOStatus | null>(null);
  const [searchDistrict, setSearchDistrict] = useState('');
  const [pageLoading, setPageLoading] = useState(true);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [showUnlinkModal, setShowUnlinkModal] = useState(false);

  // Load initial data
  useEffect(() => {
    const loadData = async () => {
      try {
        setPageLoading(true);
        const status = await getMyFPOStatus();
        setFpoStatus(status);

        // Load all FPOs
        const allFpos = await searchFPOs();
        setFpos(Array.isArray(allFpos) ? allFpos : []);
      } catch (err: any) {
        setErrorMessage(err.message || 'Failed to load data');
      } finally {
        setPageLoading(false);
      }
    };

    if (user) {
      loadData();
    }
  }, [user, getMyFPOStatus, searchFPOs]);

  const handleSearch = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchDistrict(value);

    if (value.trim()) {
      try {
        const results = await searchFPOs(value);
        setFpos(Array.isArray(results) ? results : []);
      } catch (err) {
        // Error handled by hook
      }
    } else {
      const allFpos = await searchFPOs();
      setFpos(Array.isArray(allFpos) ? allFpos : []);
    }
  };

  const handleJoinRequest = async (fpoId: string) => {
    try {
      setErrorMessage('');
      setSuccessMessage('');
      await createLinkRequest(fpoId);
      setSuccessMessage(t('fpoLinking.requestSentSuccess'));
      
      // Refresh status
      const status = await getMyFPOStatus();
      setFpoStatus(status);
    } catch (err: any) {
      setErrorMessage(err.message || t('fpoLinking.requestFailed'));
    }
  };

  const handleUnlink = async () => {
    try {
      setErrorMessage('');
      setSuccessMessage('');
      await unlinkFromFPO();
      setSuccessMessage(t('fpoLinking.unlinkSuccess'));
      setShowUnlinkModal(false);

      // Refresh status
      const status = await getMyFPOStatus();
      setFpoStatus(status);
    } catch (err: any) {
      setErrorMessage(err.message || t('fpoLinking.unlinkFailed'));
    }
  };

  const filteredFpos = Array.isArray(fpos) ? fpos.filter(fpo =>
    searchDistrict === '' || fpo.district.toLowerCase().includes(searchDistrict.toLowerCase())
  ) : [];

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
            <button onClick={() => router.push('/farmer')} className="text-gray-600 hover:text-gray-900">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{t('fpoLinking.title')}</h1>
              <p className="text-sm text-gray-600">{t('fpoLinking.subtitle')}</p>
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

        {/* Current Status Card */}
        {fpoStatus && (
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 mb-8">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">{t('fpoLinking.currentStatus')}</h2>
            
            {fpoStatus.status === 'LINKED' && fpoStatus.fpo ? (
              <div className="space-y-4">
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm text-gray-600">{t('fpoLinking.linkedTo')}</p>
                      <h3 className="text-xl font-bold text-green-700 mt-1">{fpoStatus.fpo.name}</h3>
                      <p className="text-sm text-gray-600 mt-2">
                        {t('fpoLinking.commissionRate')}: {fpoStatus.fpo.commissionRate}%
                      </p>
                    </div>
                    <svg className="w-8 h-8 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
                <button
                  onClick={() => setShowUnlinkModal(true)}
                  className="w-full py-2 px-4 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 transition-colors"
                >
                  {t('fpoLinking.unlink')}
                </button>
              </div>
            ) : fpoStatus.status === 'PENDING' ? (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  <div>
                    <p className="font-medium text-yellow-800">{t('fpoLinking.pendingApproval')}</p>
                    <p className="text-sm text-yellow-700 mt-1">{t('fpoLinking.pendingMessage')}</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <p className="text-gray-600">{t('fpoLinking.notLinked')}</p>
              </div>
            )}
          </div>
        )}

        {/* Info Banner */}
        <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded-lg mb-6">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-blue-800">{t('fpoLinking.benefits')}</h3>
              <div className="mt-2 text-sm text-blue-700">
                <ul className="list-disc list-inside space-y-1">
                  <li>{t('fpoLinking.benefit1')}</li>
                  <li>{t('fpoLinking.benefit2')}</li>
                  <li>{t('fpoLinking.benefit3')}</li>
                  <li>{t('fpoLinking.benefit4')}</li>
                  <li>{t('fpoLinking.benefit5')}</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Search */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">{t('fpoLinking.searchByDistrict')}</label>
          <input
            type="text"
            value={searchDistrict}
            onChange={handleSearch}
            placeholder={t('fpoLinking.enterDistrict')}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
          />
        </div>

        {/* FPO List */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredFpos.map((fpo) => (
            <div key={fpo.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">{fpo.name}</h3>
                    <p className="text-sm text-gray-600 mt-1">{t('fpoLinking.regNo')}: {fpo.registrationNo}</p>
                  </div>
                  <div className="bg-green-100 p-2 rounded-lg">
                    <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
                </div>

                <div className="space-y-3 mb-6">
                  <div className="flex items-center gap-2 text-sm">
                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span className="text-gray-700">{fpo.district}, {fpo.state}</span>
                  </div>

                  <div className="flex items-center gap-2 text-sm">
                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="text-gray-700">{t('fpoLinking.commission')}: {fpo.commissionRate}%</span>
                  </div>

                  <div className="flex items-center gap-2 text-sm">
                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                    <span className="text-gray-700">{fpo.farmerCount} {t('fpoLinking.farmers')}</span>
                  </div>
                </div>

                <button
                  onClick={() => handleJoinRequest(fpo.id)}
                  disabled={loading || fpoStatus?.status === 'LINKED' || fpoStatus?.status === 'PENDING'}
                  className={`w-full py-3 rounded-lg font-medium transition-colors ${
                    loading || fpoStatus?.status === 'LINKED' || fpoStatus?.status === 'PENDING'
                      ? 'bg-gray-300 text-gray-600 cursor-not-allowed'
                      : 'bg-green-600 text-white hover:bg-green-700'
                  }`}
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      {t('common.loading')}
                    </span>
                  ) : fpoStatus?.status === 'LINKED' ? (
                    t('fpoLinking.alreadyLinked')
                  ) : fpoStatus?.status === 'PENDING' ? (
                    t('fpoLinking.requestPending')
                  ) : (
                    t('fpoLinking.sendRequest')
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>

        {filteredFpos.length === 0 && (
          <div className="bg-white rounded-xl shadow-sm p-12 text-center">
            <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <h3 className="text-lg font-medium text-gray-900 mb-2">{t('fpoLinking.noFPOs')}</h3>
            <p className="text-gray-600">{t('fpoLinking.tryDifferentDistrict')}</p>
          </div>
        )}
      </main>

      {/* Unlink Modal */}
      {showUnlinkModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-lg max-w-sm w-full p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-2">{t('fpoLinking.confirmUnlink')}</h3>
            <p className="text-gray-600 mb-6">{t('fpoLinking.unlinkWarning')}</p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowUnlinkModal(false)}
                className="flex-1 py-2 px-4 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                {t('common.cancel')}
              </button>
              <button
                onClick={handleUnlink}
                disabled={loading}
                className="flex-1 py-2 px-4 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
              >
                {loading ? t('common.loading') : t('fpoLinking.unlinkConfirm')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
