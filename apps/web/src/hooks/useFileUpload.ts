/* ========================================================================
   useFileUpload Hook - Handle file/image uploads with compression
   ======================================================================== */

'use client';

import { useState, useCallback } from 'react';
import axios from 'axios';

interface FileUploadResult {
  fileUrl: string;
  fileName: string;
  fileSize: number;
  mimeType: string;
}

interface UseFileUploadReturn {
  uploadFile: (file: File) => Promise<FileUploadResult>;
  uploadImage: (file: File) => Promise<FileUploadResult>;
  isUploading: boolean;
  uploadProgress: number;
  error: string | null;
}

// Simple image compression using Canvas API
const compressImage = async (
  file: File,
  maxWidth: number = 1024,
  maxHeight: number = 1024,
  quality: number = 0.8
): Promise<Blob> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > maxWidth) {
            height *= maxWidth / width;
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width *= maxHeight / height;
            height = maxHeight;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx?.drawImage(img, 0, 0, width, height);

        canvas.toBlob(resolve, 'image/jpeg', quality);
      };
      img.onerror = reject;
    };
    reader.onerror = reject;
  });
};

export const useFileUpload = (): UseFileUploadReturn => {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const uploadFile = useCallback(
    async (file: File): Promise<FileUploadResult> => {
      try {
        setIsUploading(true);
        setError(null);
        setUploadProgress(0);

        // For local development, store locally or in your backend
        // In production, use Cloudinary or similar service

        // Simulate upload progress
        const progressInterval = setInterval(() => {
          setUploadProgress((prev) => Math.min(prev + 10, 90));
        }, 100);

        // Create FormData
        const formData = new FormData();
        formData.append('file', file);

        // Upload to backend endpoint
        const response = await axios.post('/api/uploads/file', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
          onUploadProgress: (progressEvent) => {
            const progress = Math.round(
              (progressEvent.loaded * 100) / (progressEvent.total || 1)
            );
            setUploadProgress(progress);
          },
        });

        clearInterval(progressInterval);
        setUploadProgress(100);
        setIsUploading(false);

        return response.data;
      } catch (err: any) {
        setError(err.message || 'Upload failed');
        setIsUploading(false);
        setUploadProgress(0);
        throw err;
      }
    },
    []
  );

  const uploadImage = useCallback(
    async (file: File): Promise<FileUploadResult> => {
      try {
        setIsUploading(true);
        setError(null);
        setUploadProgress(0);

        // Compress image before upload
        const compressedBlob = await compressImage(file);
        const compressedFile = new File(
          [compressedBlob],
          file.name,
          { type: 'image/jpeg' }
        );

        // Upload compressed image
        const result = await uploadFile(compressedFile);

        setUploadProgress(100);
        setIsUploading(false);

        return result;
      } catch (err: any) {
        setError(err.message || 'Image upload failed');
        setIsUploading(false);
        setUploadProgress(0);
        throw err;
      }
    },
    [uploadFile]
  );

  return {
    uploadFile,
    uploadImage,
    isUploading,
    uploadProgress,
    error,
  };
};

export default useFileUpload;
