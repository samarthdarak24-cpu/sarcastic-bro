'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import { useFPOLinking, LinkRequest } from '@/hooks/useFPOLinking';
import { useAuth } from '@/hooks/useAuth';

export default function FPOLinkRequests() {
  const router = useRouter();
  const { t } = useTranslation();
  const { user } = useAuth();
  const { getFPOLinkRequests, approveLinkRequest, rejectLinkRequest, loading, error } = useFPOLinking();

  const [requests, setRequests] = useState<LinkRequest[]>([]);
  const [pageLoading, setPageLoading] = useState(true);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [filterStatus, setFilterStatus] = useState<'PENDING' | 'APPROVED' | 'REJECTED' | 'ALL'>('PENDING');
  const [rejectingId, setRejectingId] = useState<string | null>(null);
  const [rejectionReason, setRejectionReason] = useState('');

  // Load requests
  useEffect(() => {
    const loadRequests = async () => {
      try {
        setPageLoading(true);
        const status = filterStatus === 'ALL' ? undefined : filterStatus;
        const data = await getFPOLinkRequests(status);
        setRequests(Array.isArray(data) ? data : []);
      } catch (err: any) {
        setErrorMessage(err.message || 'Failed to load requests');
      } finally {
        setPageLoading(false);
      }
    };

    if (user) {
      loadRequests();
    }
  }, [user, filterStatus, getFPOLinkRequests]);

  const handleApprove = async (requestId: string) => {
    try {
      setErrorMessage('');
      setSuccessMessage('');
      await approveLinkRequest(requestId);
      setSuccessMessage(t('fpoLinking.approveSuccess'));
      
      // Refresh list
      const status = filterStatus === 'ALL' ? undefined : filterStatus;
      const data = await getFPOLinkRequests(status);
      setRequests(Array.isArray(data) ? data : []);
    } catch (err: any) {
      setErrorMessage(err.message || t('fpoLinking.approveFailed'));
    }
  };

  const handleReject = async (requestId: string) => {
    try {
      setErrorMessage('');
      setSuccessMessage('');
      await rejectLinkRequest(requestId, rejectionReason);
      setSuccessMessage(t('fpoLinking.rejectSuccess'));
      setRejectingId(null);
      setRejectionReason('');
      
      // Refresh list
      const status = filterStatus === 'ALL' ? undefined : filterStatus;
      const data = await getFPOLinkRequests(status);
      setRequests(Array.isArray(data) ? data : []);
    } catch (err: any) {
      setErrorMessage(err.message || t('fpoLinking.rejectFailed'));
    }
  };

  const filteredRequests = Array.isArray(requests) ? requests.filter(req => {
    if (filterStatus === 'ALL') return true;
    return req.status === filterStatus;
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
              <h1 className="text-2xl font-bold text-gray-900">{t('fpoLinking.linkRequests')}</h1>
              <p className="text-sm text-gray-600">{t('fpoLinking.manageFarmerRequests')}</p>
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

        {/* Filter Tabs */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 mb-6">
          <div className="flex border-b">
            {(['PENDING', 'APPROVED', 'REJECTED', 'ALL'] as const).map((status) => (
              <button
                key={status}
                onClick={() => setFilterStatus(status)}
                className={`flex-1 py-4 px-4 text-center font-medium transition-colors ${
                  filterStatus === status
                    ? 'border-b-2 border-green-600 text-green-600'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {t(`fpoLinking.status${status}`)}
                {status !== 'ALL' && (
                  <span className="ml-2 text-sm">
                    ({requests.filter(r => r.status === status).length})
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Requests List */}
        <div className="space-y-4">
          {filteredRequests.length > 0 ? (
            filteredRequests.map((request) => (
              <div key={request.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                  {/* Farmer Info */}
                  <div>
                    <p className="text-sm text-gray-600 mb-1">{t('fpoLinking.farmerName')}</p>
                    <h3 className="text-lg font-bold text-gray-900">{request.farmerName}</h3>
                    <p className="text-sm text-gray-600 mt-2">{request.farmerPhone}</p>
                  </div>

                  {/* Location & Details */}
                  <div>
                    <p className="text-sm text-gray-600 mb-1">{t('fpoLinking.district')}</p>
                    <p className="text-lg font-semibold text-gray-900">{request.farmerDistrict || 'N/A'}</p>
                    <p className="text-sm text-gray-600 mt-2">
                      {t('fpoLinking.aadhaar')}: {request.farmerAadhaar ? '****' + request.farmerAadhaar.slice(-4) : 'N/A'}
                    </p>
                  </div>

                  {/* Status & Date */}
                  <div>
                    <p className="text-sm text-gray-600 mb-1">{t('fpoLinking.status')}</p>
                    <div className="flex items-center gap-2">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                        request.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                        request.status === 'APPROVED' ? 'bg-green-100 text-green-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {t(`fpoLinking.status${request.status}`)}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mt-2">
                      {new Date(request.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                {/* Message */}
                {request.message && (
                  <div className="bg-gray-50 rounded-lg p-4 mb-6">
                    <p className="text-sm text-gray-600 mb-1">{t('fpoLinking.message')}</p>
                    <p className="text-gray-900">{request.message}</p>
                  </div>
                )}

                {/* Rejection Reason */}
                {request.rejectionReason && (
                  <div className="bg-red-50 rounded-lg p-4 mb-6 border border-red-200">
                    <p className="text-sm text-red-600 mb-1">{t('fpoLinking.rejectionReason')}</p>
                    <p className="text-red-900">{request.rejectionReason}</p>
                  </div>
                )}

                {/* Actions */}
                {request.status === 'PENDING' && (
                  <div className="flex gap-3">
                    <button
                      onClick={() => handleApprove(request.id)}
                      disabled={loading}
                      className="flex-1 py-2 px-4 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
                    >
                      {loading ? t('common.loading') : t('fpoLinking.approve')}
                    </button>
                    <button
                      onClick={() => setRejectingId(request.id)}
                      disabled={loading}
                      className="flex-1 py-2 px-4 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 transition-colors disabled:opacity-50"
                    >
                      {t('fpoLinking.reject')}
                    </button>
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className="bg-white rounded-xl shadow-sm p-12 text-center">
              <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
              </svg>
              <h3 className="text-lg font-medium text-gray-900 mb-2">{t('fpoLinking.noRequests')}</h3>
              <p className="text-gray-600">{t('fpoLinking.noRequestsMessage')}</p>
            </div>
          )}
        </div>
      </main>

      {/* Reject Modal */}
      {rejectingId && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-lg max-w-sm w-full p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">{t('fpoLinking.rejectRequest')}</h3>
            <textarea
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              placeholder={t('fpoLinking.rejectionReasonPlaceholder')}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent mb-4"
              rows={4}
            />
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setRejectingId(null);
                  setRejectionReason('');
                }}
                className="flex-1 py-2 px-4 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                {t('common.cancel')}
              </button>
              <button
                onClick={() => handleReject(rejectingId, rejectionReason)}
                disabled={loading}
                className="flex-1 py-2 px-4 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
              >
                {loading ? t('common.loading') : t('fpoLinking.confirmReject')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
