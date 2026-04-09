'use client';

import React, { useState, useRef } from 'react';
import { Upload, Sparkles, AlertCircle, Trash2, Loader2 } from 'lucide-react';

interface ScanResult {
  success: boolean;
  overall_quality_score: number;
  overall_grade: string;
  total_detections: number;
  detections: Array<{
    detection_id: number;
    quality_grade: string;
    quality_score: number;
    features: {
      defects: Record<string, number>;
      color_uniformity: number;
      texture_score: number;
      shape_regularity: number;
    };
  }>;
  technology_stack: {
    detection: string;
    classification: string;
    preprocessing: string;
    transfer_learning: string;
  };
}

export default function QualityScannerPage() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState<ScanResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    if (!file.type.startsWith('image/')) {
      setError('Please select a valid image file');
      return;
    }
    
    if (file.size > 10 * 1024 * 1024) {
      setError('Image size must be less than 10MB');
      return;
    }
    
    setSelectedFile(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setSelectedImage(reader.result as string);
      setError(null);
      setResult(null);
    };
    reader.readAsDataURL(file);
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleScan = async () => {
    if (!selectedFile) {
      setError('Please select an image first');
      return;
    }

    setAnalyzing(true);
    setError(null);
    setResult(null);

    try {
      const formData = new FormData();
      formData.append('file', selectedFile);
      formData.append('return_visualization', 'false');

      // Call AI service directly
      const aiServiceUrl = process.env.NEXT_PUBLIC_QUALITY_SHIELD_URL || 'http://localhost:8001';
      const response = await fetch(`${aiServiceUrl}/quality-shield/scan`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || 'Quality scan failed');
      }

      const data = await response.json();
      
      if (data.success) {
        setResult(data);
      } else {
        throw new Error('Scan was not successful');
      }
    } catch (err: any) {
      console.error('Scan error:', err);
      
      // Check if it's a network/connection error
      if (err instanceof TypeError || err.message?.includes('fetch') || err.message?.includes('Failed to fetch')) {
        setError('AI service is currently offline. Please ensure the quality shield service is running on port 8001.');
      } else {
        setError(err instanceof Error ? err.message : 'Analysis failed');
      }
    } finally {
      setAnalyzing(false);
    }
  };

  const handleClear = () => {
    setSelectedImage(null);
    setSelectedFile(null);
    setResult(null);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const getGradeColor = (grade: string) => {
    switch (grade) {
      case 'Premium': return 'text-green-600 bg-green-50 border-green-200';
      case 'Grade A': return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'Grade B': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'Grade C': return 'text-orange-600 bg-orange-50 border-orange-200';
      case 'Rejected': return 'text-red-600 bg-red-50 border-red-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  return (
    <div className='min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-green-50 p-6'>
      <div className='max-w-7xl mx-auto'>
        {/* Header */}
        <div className='bg-white rounded-2xl shadow-xl p-8 mb-6'>
          <h1 className='text-4xl font-bold text-gray-900 flex items-center gap-3'>
            <Sparkles className='w-10 h-10 text-purple-600' />
            AI Quality Shield Scanner
          </h1>
          <p className='text-lg text-gray-600 mt-2'>
            YOLOv8 + EfficientNet + Transfer Learning + OpenCV
          </p>
        </div>

        {/* Main Content */}
        <div className='bg-white rounded-2xl shadow-xl p-6'>
          {/* Upload Section */}
          {!selectedImage && (
            <div className='text-center py-12'>
              <button
                onClick={handleUploadClick}
                className='w-full max-w-md mx-auto bg-gradient-to-r from-purple-600 to-blue-600 text-white px-8 py-6 rounded-xl font-semibold hover:from-purple-700 hover:to-blue-700 transition-all flex items-center justify-center gap-3 shadow-lg'
              >
                <Upload className='w-6 h-6' />
                Choose Image to Scan
              </button>
            </div>
          )}

          <input
            ref={fileInputRef}
            type='file'
            className='hidden'
            accept='image/*'
            onChange={handleImageSelect}
            disabled={analyzing}
          />

          {/* Image Preview */}
          {selectedImage && (
            <div className='mt-4'>
              <div className='relative'>
                <img
                  src={selectedImage}
                  alt='Selected crop'
                  className='max-h-96 mx-auto rounded-lg shadow-md'
                />
              </div>

              {/* Action Buttons */}
              <div className='flex gap-3 mt-6'>
                <button
                  onClick={handleScan}
                  disabled={!selectedFile || analyzing}
                  className='flex-1 bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-4 rounded-xl font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:from-purple-700 hover:to-blue-700 transition-all flex items-center justify-center gap-2'
                >
                  {analyzing ? (
                    <>
                      <Loader2 className='w-5 h-5 animate-spin' />
                      Scanning...
                    </>
                  ) : (
                    <>
                      <Sparkles className='w-5 h-5' />
                      Start AI Scan
                    </>
                  )}
                </button>
                <button
                  onClick={handleClear}
                  disabled={analyzing}
                  className='px-6 py-4 bg-gray-200 text-gray-700 rounded-xl font-semibold hover:bg-gray-300 transition-all flex items-center gap-2'
                >
                  <Trash2 className='w-5 h-5' />
                  Clear
                </button>
              </div>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className='mt-6 bg-red-50 border-2 border-red-200 rounded-xl p-4 flex items-start gap-3'>
              <AlertCircle className='w-5 h-5 text-red-600 flex-shrink-0 mt-0.5' />
              <div>
                <h3 className='font-semibold text-red-900'>Error</h3>
                <p className='text-red-700'>{error}</p>
              </div>
            </div>
          )}

          {/* Results */}
          {result && result.success && (
            <div className='mt-6 space-y-6'>
              {/* Overall Grade */}
              <div className={`border-2 rounded-xl p-6 ${getGradeColor(result.overall_grade)}`}>
                <h3 className='text-3xl font-bold mb-2'>{result.overall_grade}</h3>
                <p className='text-xl font-semibold'>
                  Quality Score: {result.overall_quality_score.toFixed(1)}/100
                </p>
                <p className='text-sm mt-2'>
                  Total Detections: {result.total_detections}
                </p>
              </div>

              {/* Technology Stack */}
              <div className='bg-gray-50 rounded-xl p-6'>
                <h3 className='text-lg font-bold text-gray-900 mb-3'>Technology Stack</h3>
                <div className='grid grid-cols-2 gap-4'>
                  <div>
                    <p className='text-sm text-gray-600'>Detection</p>
                    <p className='font-semibold text-gray-900'>{result.technology_stack.detection}</p>
                  </div>
                  <div>
                    <p className='text-sm text-gray-600'>Classification</p>
                    <p className='font-semibold text-gray-900'>{result.technology_stack.classification}</p>
                  </div>
                  <div>
                    <p className='text-sm text-gray-600'>Preprocessing</p>
                    <p className='font-semibold text-gray-900'>{result.technology_stack.preprocessing}</p>
                  </div>
                  <div>
                    <p className='text-sm text-gray-600'>Transfer Learning</p>
                    <p className='font-semibold text-gray-900'>{result.technology_stack.transfer_learning}</p>
                  </div>
                </div>
              </div>

              {/* Detailed Results */}
              {result.detections.length > 0 && (
                <div className='bg-gray-50 rounded-xl p-6'>
                  <h3 className='text-lg font-bold text-gray-900 mb-4'>Detailed Analysis</h3>
                  <div className='space-y-4'>
                    {result.detections.map((detection, idx) => (
                      <div key={idx} className='bg-white rounded-lg p-4 border border-gray-200'>
                        <div className='flex justify-between items-start mb-3'>
                          <div>
                            <h4 className='font-bold text-gray-900'>Detection #{detection.detection_id + 1}</h4>
                            <p className={`text-sm font-semibold ${getGradeColor(detection.quality_grade).split(" ")[0]}`}>
                              {detection.quality_grade}
                            </p>
                          </div>
                          <div className='text-right'>
                            <p className='text-2xl font-bold text-gray-900'>{detection.quality_score.toFixed(1)}</p>
                            <p className='text-xs text-gray-600'>Quality Score</p>
                          </div>
                        </div>

                        {/* Features */}
                        <div className='grid grid-cols-3 gap-3 text-sm'>
                          <div>
                            <p className='text-gray-600'>Color Uniformity</p>
                            <p className='font-semibold'>{detection.features.color_uniformity.toFixed(2)}</p>
                          </div>
                          <div>
                            <p className='text-gray-600'>Texture Score</p>
                            <p className='font-semibold'>{detection.features.texture_score.toFixed(2)}</p>
                          </div>
                          <div>
                            <p className='text-gray-600'>Shape Regularity</p>
                            <p className='font-semibold'>{detection.features.shape_regularity.toFixed(2)}</p>
                          </div>
                        </div>

                        {/* Defects */}
                        {Object.keys(detection.features.defects).length > 0 && (
                          <div className='mt-3 pt-3 border-t border-gray-200'>
                            <p className='text-xs text-gray-600 mb-2'>Detected Defects:</p>
                            <div className='flex flex-wrap gap-2'>
                              {Object.entries(detection.features.defects).map(([defect, count]) => (
                                count > 0 && (
                                  <span key={defect} className='px-2 py-1 bg-red-100 text-red-700 text-xs rounded-full'>
                                    {defect}: {count}
                                  </span>
                                )
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
