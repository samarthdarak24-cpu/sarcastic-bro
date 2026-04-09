'use client';

import React, { useState } from 'react';

interface QualityResult {
  grade: string;
  score: number;
  confidence: number;
  defects: string[];
}

export const CropQualityDetectorComponent: React.FC<{ productId: string }> = ({ productId }) => {
  const [uploading, setUploading] = useState(false);
  const [result, setResult] = useState<QualityResult | null>(null);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('productId', productId);

    try {
      const response = await fetch('/api/quality/analyze', {
        method: 'POST',
        body: formData,
      });
      const data = await response.json();
      setResult(data);
    } catch (error) {
      console.error('Upload failed:', error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-4">Crop Quality Detector</h2>
      
      <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center mb-4">
        <input
          type="file"
          accept="image/*"
          onChange={handleUpload}
          disabled={uploading}
          className="hidden"
          id="quality-upload"
        />
        <label htmlFor="quality-upload" className="cursor-pointer">
          <p className="text-gray-600">Click to upload crop image</p>
          <p className="text-sm text-gray-500">PNG, JPG up to 10MB</p>
        </label>
      </div>

      {uploading && <p className="text-center text-blue-600">Analyzing image...</p>}

      {result && (
        <div className="space-y-4">
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-blue-50 p-4 rounded text-center">
              <p className="text-gray-600 text-sm">Grade</p>
              <p className="text-2xl font-bold text-blue-600">{result.grade}</p>
            </div>
            <div className="bg-green-50 p-4 rounded text-center">
              <p className="text-gray-600 text-sm">Score</p>
              <p className="text-2xl font-bold text-green-600">{result.score}%</p>
            </div>
            <div className="bg-purple-50 p-4 rounded text-center">
              <p className="text-gray-600 text-sm">Confidence</p>
              <p className="text-2xl font-bold text-purple-600">{result.confidence}%</p>
            </div>
          </div>

          {result.defects.length > 0 && (
            <div>
              <h3 className="font-semibold mb-2">Detected Defects</h3>
              <ul className="list-disc list-inside space-y-1">
                {result.defects.map((defect, idx) => (
                  <li key={idx} className="text-red-600">{defect}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
