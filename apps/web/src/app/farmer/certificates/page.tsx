'use client';

import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useQualityCertificate } from '@/hooks/useQualityCertificate';
import { Upload, FileText, CheckCircle, XCircle, Calendar, Award, Trash2 } from 'lucide-react';

export default function FarmerCertificatesPage() {
  const { t } = useTranslation();
  const {
    certificates,
    loading,
    error,
    fetchMyCertificates,
    uploadCertificate,
    deleteCertificate,
  } = useQualityCertificate();

  const [showUploadForm, setShowUploadForm] = useState(false);
  const [uploadData, setUploadData] = useState({
    cropId: '',
    certificateType: 'FPO_VERIFIED',
    certificateNumber: '',
    issuerName: '',
    issueDate: '',
    expiryDate: '',
    notes: '',
    file: null as File | null,
  });
  const [uploading, setUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);

  useEffect(() => {
    fetchMyCertificates();
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setUploadData({ ...uploadData, file: e.target.files[0] });
    }
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadData.file || !uploadData.cropId) {
      alert(t('certificates.pleaseSelectFileAndCrop') || 'Please select a file and crop');
      return;
    }

    setUploading(true);
    try {
      await uploadCertificate({
        cropId: uploadData.cropId,
        certificateType: uploadData.certificateType,
        certificateNumber: uploadData.certificateNumber,
        issuerName: uploadData.issuerName,
        issueDate: uploadData.issueDate,
        expiryDate: uploadData.expiryDate,
        notes: uploadData.notes,
        file: uploadData.file,
      });
      setUploadSuccess(true);
      setShowUploadForm(false);
      setUploadData({
        cropId: '',
        certificateType: 'FPO_VERIFIED',
        certificateNumber: '',
        issuerName: '',
        issueDate: '',
        expiryDate: '',
        notes: '',
        file: null,
      });
      setTimeout(() => setUploadSuccess(false), 3000);
    } catch (err) {
      console.error('Upload error:', err);
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm(t('certificates.confirmDelete') || 'Are you sure you want to delete this certificate?')) {
      try {
        await deleteCertificate(id);
      } catch (err) {
        console.error('Delete error:', err);
      }
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

  if (loading && certificates.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6 max-w-6xl">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">
          {t('certificates.title') || 'Quality Certificates'}
        </h1>
        <button
          onClick={() => setShowUploadForm(!showUploadForm)}
          className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center gap-2"
        >
          <Upload size={20} />
          {t('certificates.upload') || 'Upload Certificate'}
        </button>
      </div>

      {uploadSuccess && (
        <div className="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-lg mb-4">
          {t('certificates.uploadSuccess') || 'Certificate uploaded successfully!'}
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg mb-4">
          {error}
        </div>
      )}

      {showUploadForm && (
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">
            {t('certificates.uploadNew') || 'Upload New Certificate'}
          </h2>
          <form onSubmit={handleUpload} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t('certificates.cropId') || 'Crop ID'} *
              </label>
              <input
                type="text"
                value={uploadData.cropId}
                onChange={(e) => setUploadData({ ...uploadData, cropId: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t('certificates.type') || 'Certificate Type'}
              </label>
              <select
                value={uploadData.certificateType}
                onChange={(e) => setUploadData({ ...uploadData, certificateType: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
              >
                <option value="FPO_VERIFIED">FPO Verified</option>
                <option value="LAB_TEST">Lab Test</option>
                <option value="ORGANIC">Organic</option>
                <option value="GOVERNMENT">Government</option>
              </select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t('certificates.number') || 'Certificate Number'}
                </label>
                <input
                  type="text"
                  value={uploadData.certificateNumber}
                  onChange={(e) => setUploadData({ ...uploadData, certificateNumber: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t('certificates.issuer') || 'Issuer Name'}
                </label>
                <input
                  type="text"
                  value={uploadData.issuerName}
                  onChange={(e) => setUploadData({ ...uploadData, issuerName: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t('certificates.issueDate') || 'Issue Date'}
                </label>
                <input
                  type="date"
                  value={uploadData.issueDate}
                  onChange={(e) => setUploadData({ ...uploadData, issueDate: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t('certificates.expiryDate') || 'Expiry Date'}
                </label>
                <input
                  type="date"
                  value={uploadData.expiryDate}
                  onChange={(e) => setUploadData({ ...uploadData, expiryDate: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t('certificates.notes') || 'Notes'}
              </label>
              <textarea
                value={uploadData.notes}
                onChange={(e) => setUploadData({ ...uploadData, notes: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                rows={3}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t('certificates.file') || 'Certificate File'} *
              </label>
              <input
                type="file"
                onChange={handleFileChange}
                accept=".pdf,.jpg,.jpeg,.png"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                required
              />
            </div>

            <div className="flex gap-3">
              <button
                type="submit"
                disabled={uploading}
                className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 disabled:bg-gray-400"
              >
                {uploading ? t('certificates.uploading') || 'Uploading...' : t('certificates.upload') || 'Upload'}
              </button>
              <button
                type="button"
                onClick={() => setShowUploadForm(false)}
                className="bg-gray-200 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-300"
              >
                {t('common.cancel') || 'Cancel'}
              </button>
            </div>
          </form>
        </div>
      )}

      {certificates.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-12 text-center">
          <FileText size={64} className="mx-auto text-gray-300 mb-4" />
          <h3 className="text-xl font-semibold text-gray-700 mb-2">
            {t('certificates.noCertificates') || 'No Certificates Yet'}
          </h3>
          <p className="text-gray-500">
            {t('certificates.uploadFirst') || 'Upload your first quality certificate to build buyer trust'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {certificates.map((cert) => (
            <div key={cert.id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-2">
                  <Award className="text-green-600" size={24} />
                  <h3 className="font-semibold text-lg">{getCertificateTypeLabel(cert.certificateType)}</h3>
                </div>
                {cert.verifiedByFPO ? (
                  <CheckCircle className="text-green-600" size={24} />
                ) : (
                  <XCircle className="text-gray-400" size={24} />
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
                <div className="mb-2">
                  <span className="text-sm font-medium text-gray-600">{t('certificates.aiScore') || 'AI Score'}:</span>
                  <span className="ml-2 text-lg font-bold text-green-600">{cert.aiScore}/100</span>
                </div>
              )}

              {cert.issueDate && (
                <p className="text-sm text-gray-500 flex items-center gap-1 mb-2">
                  <Calendar size={14} />
                  {new Date(cert.issueDate).toLocaleDateString()}
                </p>
              )}

              {cert.notes && (
                <p className="text-sm text-gray-600 mb-3 italic">{cert.notes}</p>
              )}

              <div className="flex gap-2 mt-4">
                <a
                  href={cert.fileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 text-center text-sm"
                >
                  {t('certificates.view') || 'View'}
                </a>
                <button
                  onClick={() => handleDelete(cert.id)}
                  className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
