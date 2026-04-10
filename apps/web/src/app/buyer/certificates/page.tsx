'use client';

import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { qualityCertificateService, QualityCertificate } from '@/services/qualityCertificate';
import { FileText, CheckCircle, Calendar, Award, Download } from 'lucide-react';

export default function BuyerCertificatesPage() {
  const { t } = useTranslation();
  const [cropId, setCropId] = useState('');
  const [lotId, setLotId] = useState('');
  const [certificates, setCertificates] = useState<QualityCertificate[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async () => {
    if (!cropId && !lotId) {
      alert(t('certificates.enterCropOrLot') || 'Please enter a Crop ID or Lot ID');
      return;
    }

    setLoading(true);
    setError(null);
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
    } finally {
      setLoading(false);
    }
  };

  const getCertificateTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      LAB_TEST: t('certificates.labTest') || 'Lab Test',
      FPO_VERIFIED: t('certificates.fpoVerified') || 'FPO Verified',
      ORGANIC: t('certificates.organic') || 'Organic',
      GOVERNMENT: t('certificates.government') || 'Government',
      AI_GENERATED: t('certificates.aiGenerated') || 'AI Generated',
    };
    return labels[type] || type;
  };

  return (
    <div className="container mx-auto px-4 py-6 max-w-6xl">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">
        {t('certificates.viewCertificates') || 'View Quality Certificates'}
      </h1>

      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-lg font-semibold mb-4">
          {t('certificates.searchCertificates') || 'Search Certificates'}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t('certificates.cropId') || 'Crop ID'}
            </label>
            <input
              type="text"
              value={cropId}
              onChange={(e) => {
                setCropId(e.target.value);
                setLotId('');
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="Enter crop ID"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t('certificates.lotId') || 'Lot ID'}
            </label>
            <input
              type="text"
              value={lotId}
              onChange={(e) => {
                setLotId(e.target.value);
                setCropId('');
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="Enter lot ID"
            />
          </div>

          <div className="flex items-end">
            <button
              onClick={handleSearch}
              disabled={loading}
              className="w-full bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:bg-gray-400"
            >
              {loading ? t('certificates.searching') || 'Searching...' : t('certificates.search') || 'Search'}
            </button>
          </div>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg mb-4">
          {error}
        </div>
      )}

      {certificates.length === 0 && !loading && !error && (
        <div className="bg-white rounded-lg shadow-md p-12 text-center">
          <FileText size={64} className="mx-auto text-gray-300 mb-4" />
          <h3 className="text-xl font-semibold text-gray-700 mb-2">
            {t('certificates.noCertificatesFound') || 'No Certificates Found'}
          </h3>
          <p className="text-gray-500">
            {t('certificates.searchToView') || 'Search by Crop ID or Lot ID to view quality certificates'}
          </p>
        </div>
      )}

      {certificates.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {certificates.map((cert) => (
            <div key={cert.id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-2">
                  <Award className="text-blue-600" size={24} />
                  <h3 className="font-semibold text-lg">{getCertificateTypeLabel(cert.certificateType)}</h3>
                </div>
                {cert.verifiedByFPO && (
                  <div className="flex items-center gap-1 bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">
                    <CheckCircle size={16} />
                    {t('certificates.verified') || 'Verified'}
                  </div>
                )}
              </div>

              {cert.certificateNumber && (
                <p className="text-sm text-gray-600 mb-2">
                  <span className="font-medium">{t('certificates.number') || 'Number'}:</span> {cert.certificateNumber}
                </p>
              )}

              {cert.issuerName && (
                <p className="text-sm text-gray-600 mb-2">
                  <span className="font-medium">{t('certificates.issuer') || 'Issuer'}:</span> {cert.issuerName}
                </p>
              )}

              {cert.aiScore && (
                <div className="mb-3 bg-blue-50 p-3 rounded-lg">
                  <span className="text-sm font-medium text-gray-700">{t('certificates.qualityScore') || 'Quality Score'}:</span>
                  <div className="flex items-center gap-2 mt-1">
                    <div className="flex-1 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full"
                        style={{ width: `${cert.aiScore}%` }}
                      ></div>
                    </div>
                    <span className="text-lg font-bold text-blue-600">{cert.aiScore}/100</span>
                  </div>
                </div>
              )}

              {cert.issueDate && (
                <p className="text-sm text-gray-500 flex items-center gap-1 mb-2">
                  <Calendar size={14} />
                  {t('certificates.issued') || 'Issued'}: {new Date(cert.issueDate).toLocaleDateString()}
                </p>
              )}

              {cert.expiryDate && (
                <p className="text-sm text-gray-500 flex items-center gap-1 mb-2">
                  <Calendar size={14} />
                  {t('certificates.expires') || 'Expires'}: {new Date(cert.expiryDate).toLocaleDateString()}
                </p>
              )}

              {cert.notes && (
                <p className="text-sm text-gray-600 mb-3 p-3 bg-gray-50 rounded-lg italic">{cert.notes}</p>
              )}

              <a
                href={cert.fileUrl}
                target="_blank"
                rel="noopener noreferrer"
                download
                className="flex items-center justify-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 text-sm"
              >
                <Download size={16} />
                {t('certificates.download') || 'Download Certificate'}
              </a>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
