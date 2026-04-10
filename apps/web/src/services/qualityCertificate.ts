import api from './api';

export interface QualityCertificate {
  id: string;
  cropId?: string;
  lotId?: string;
  uploadedBy: string;
  certificateType: 'LAB_TEST' | 'FPO_VERIFIED' | 'ORGANIC' | 'GOVERNMENT' | 'AI_GENERATED';
  certificateNumber?: string;
  issuerName?: string;
  issueDate?: string;
  expiryDate?: string;
  fileUrl: string;
  verifiedByFPO: boolean;
  verifiedBy?: string;
  verifiedAt?: string;
  aiScore?: number;
  notes?: string;
  uploadedAt: string;
  updatedAt: string;
}

export interface UploadCertificateData {
  cropId?: string;
  lotId?: string;
  certificateType?: string;
  certificateNumber?: string;
  issuerName?: string;
  issueDate?: string;
  expiryDate?: string;
  notes?: string;
  file: File;
}

export const qualityCertificateService = {
  async uploadCertificate(data: UploadCertificateData): Promise<{ certificate: QualityCertificate }> {
    const formData = new FormData();
    formData.append('certificate', data.file);
    
    if (data.cropId) formData.append('cropId', data.cropId);
    if (data.lotId) formData.append('lotId', data.lotId);
    if (data.certificateType) formData.append('certificateType', data.certificateType);
    if (data.certificateNumber) formData.append('certificateNumber', data.certificateNumber);
    if (data.issuerName) formData.append('issuerName', data.issuerName);
    if (data.issueDate) formData.append('issueDate', data.issueDate);
    if (data.expiryDate) formData.append('expiryDate', data.expiryDate);
    if (data.notes) formData.append('notes', data.notes);

    const response = await api.post('/api/quality-certificate/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  async getCertificateById(id: string): Promise<QualityCertificate> {
    const response = await api.get(`/api/quality-certificate/${id}`);
    return response.data;
  },

  async getCertificatesForCrop(cropId: string): Promise<QualityCertificate[]> {
    const response = await api.get(`/api/quality-certificate/crop/${cropId}`);
    return response.data;
  },

  async getCertificatesForLot(lotId: string): Promise<QualityCertificate[]> {
    const response = await api.get(`/api/quality-certificate/lot/${lotId}`);
    return response.data;
  },

  async getMyCertificates(): Promise<QualityCertificate[]> {
    const response = await api.get('/api/quality-certificate/my/certificates');
    return response.data;
  },

  async verifyCertificate(id: string): Promise<{ certificate: QualityCertificate }> {
    const response = await api.post(`/api/quality-certificate/verify/${id}`);
    return response.data;
  },

  async deleteCertificate(id: string): Promise<{ message: string }> {
    const response = await api.delete(`/api/quality-certificate/${id}`);
    return response.data;
  },

  async generateAIScore(cropId: string, images: File[]): Promise<{ certificate: QualityCertificate; aiScore: number }> {
    const formData = new FormData();
    formData.append('cropId', cropId);
    images.forEach((image) => {
      formData.append('images', image);
    });

    const response = await api.post('/api/quality-certificate/ai-score', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },
};
