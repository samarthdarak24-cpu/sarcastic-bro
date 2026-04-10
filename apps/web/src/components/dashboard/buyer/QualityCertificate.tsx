'use client';

import { useState } from 'react';
import { qualityCertificateService, QualityCertificate } from '@/services/qualityCertificate';
import { FileText, CheckCircle, Calendar, Award, Download, Search } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function BuyerQualityCertificate() {
  const [cropId, setCropId] = useState('');
  const [lotId, setLotId] = useState('');
  const [certificates, setCertificates] = useState<QualityCertificate[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searched, setSearched] = useState(false);

  const handleSearch = async () => {
    if (!cropId && !lotId) {
      alert('Please enter a Crop ID or Lot ID');
      return;
    }

    setLoading(true);
    setError(null);
    setSearched(true);
    try {
      let data: QualityCertificate[];
      if (cropId) {
        data = await qualityCertificateService.getCertificatesForCrop(cropId);
      } else {
        data = await qualityCertificateService.getCertificatesForLot(lotId);
      }
      setCertificates(data);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch certificates');
      setCertificates([]);
    } finally {
      setLoading(false);
    }
  };

  const getCertificateTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      LAB_TEST: 'Lab Test',
      FPO_VERIFIED: 'FPO Verified',
      ORGANIC: 'Organic',
      GOVERNMENT: 'Government',
      AI_GENERATED: 'AI Generated',
    };
    return labels[type] || type;
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-black text-slate-900 mb-2">View Quality Certificates</h2>
        <p className="text-slate-600">Search for certificates by Crop ID or Lot ID to verify quality</p>
      </div>

      <div className="bg-white rounded-2xl shadow-lg p-6 border border-slate-200">
        <h3 className="text-lg font-bold mb-4">Search Certificates</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Crop ID
            </label>
            <input
              type="text"
              value={cropId}
              onChange={(e) => {
                setCropId(e.target.value);
                setLotId('');
              }}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter crop ID"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Lot ID
            </label>
            <input
              type="text"
              value={lotId}
              onChange={(e) => {
                setLotId(e.target.value);
                setCropId('');
              }}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="Enter lot ID"
            />
          </div>

          <div className="flex items-end">
            <button
              onClick={handleSearch}
              disabled={loading}
              className="w-full bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 flex items-center justify-center gap-2 font-semibold"
            >
              <Search size={20} />
              {loading ? 'Searching...' : 'Search'}
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-xl"
          >
            {error}
          </motion.div>
        )}
      </AnimatePresence>

      {loading && (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      )}

      {!loading && searched && certificates.length === 0 && (
        <div className="bg-white rounded-2xl shadow-lg p-12 text-center border border-slate-200">
          <FileText size={64} className="mx-auto text-slate-300 mb-4" />
          <h3 className="text-xl font-bold text-slate-700 mb-2">No Certificates Found</h3>
          <p className="text-slate-500">No quality certificates found for this {cropId ? 'crop' : 'lot'}</p>
        </div>
      )}

      {!loading && !searched && (
        <div className="bg-white rounded-2xl shadow-lg p-12 text-center border border-slate-200">
          <Search size={64} className="mx-auto text-slate-300 mb-4" />
          <h3 className="text-xl font-bold text-slate-700 mb-2">Search to View Certificates</h3>
          <p className="text-slate-500">Enter a Crop ID or Lot ID above to view quality certificates</p>
        </div>
      )}

      {certificates.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {certificates.map((cert) => (
            <motion.div
              key={cert.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all border border-slate-200"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-2">
                  <Award className="text-blue-600" size={24} />
                  <h3 className="font-bold text-lg">{getCertificateTypeLabel(cert.certificateType)}</h3>
                </div>
                {cert.verifiedByFPO && (
                  <div className="flex items-center gap-1 bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-semibold">
                    <CheckCircle size={16} />
                    Verified
                  </div>
                )}
              </div>

              {cert.certificateNumber && (
                <p className="text-sm text-slate-600 mb-2">
                  <span className="font-medium">Number:</span> {cert.certificateNumber}
                </p>
              )}

              {cert.issuerName && (
                <p className="text-sm text-slate-600 mb-2">
                  <span className="font-medium">Issuer:</span> {cert.issuerName}
                </p>
              )}

              {cert.aiScore && (
                <div className="mb-3 bg-blue-50 p-3 rounded-lg">
                  <span className="text-sm font-medium text-slate-700">Quality Score:</span>
                  <div className="flex items-center gap-2 mt-1">
                    <div className="flex-1 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full transition-all"
                        style={{ width: `${cert.aiScore}%` }}
                      ></div>
                    </div>
                    <span className="text-lg font-bold text-blue-600">{cert.aiScore}/100</span>
                  </div>
                </div>
              )}

              {cert.issueDate && (
                <p className="text-sm text-slate-500 flex items-center gap-1 mb-2">
                  <Calendar size={14} />
                  Issued: {new Date(cert.issueDate).toLocaleDateString()}
                </p>
              )}

              {cert.expiryDate && (
                <p className="text-sm text-slate-500 flex items-center gap-1 mb-2">
                  <Calendar size={14} />
                  Expires: {new Date(cert.expiryDate).toLocaleDateString()}
                </p>
              )}

              {cert.notes && (
                <p className="text-sm text-slate-600 mb-3 p-3 bg-slate-50 rounded-lg italic">{cert.notes}</p>
              )}

              <a
                href={cert.fileUrl}
                target="_blank"
                rel="noopener noreferrer"
                download
                className="flex items-center justify-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 text-sm font-semibold"
              >
                <Download size={16} />
                Download Certificate
              </a>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
