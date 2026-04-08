'use client';

import React, { useState } from 'react';
import { Camera, Upload, Sparkles, TrendingUp, AlertCircle, CheckCircle, XCircle, Zap } from 'lucide-react';

interface Detection {
  detection_id: number;
  bbox: number[];
  quality_grade: string;
  quality_score: number;
  classification_confidence: number;
  features: {
    color_uniformity: number;
    texture_score: number;
    shape_regularity: number;
    defects: Record<string, number>;
  };
  class_probabilities: Record<string, number>;
}

interface QualityResult {
  success: boolean;
  overall_quality_score: number;
  overall_grade: string;
  total_detections: number;
  detections: Detection[];
  technology_stack: {
    detection: string;
    classification: string;
    preprocessing: string;
    transfer_learning: string;
  };
  visualization_base64?: string;
}

export default function AIQualityShield() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState<QualityResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setSelectedImage(reader.result as string);
    };
    reader.readAsDataURL(file);

    await analyzeQuality(file);
  };

  const analyzeQuality = async (file: File) => {
    setAnalyzing(true);
    setError(null);
    setResult(null);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('http://localhost:8001/quality-shield/scan?return_visualization=true', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Quality scan failed');
      }

      const data: QualityResult = await response.json();
      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Analysis failed');
      console.error('Quality scan error:', err);
    } finally {
      setAnalyzing(false);
    }
  };

  const getGradeColor = (grade: string) => {
    const colors: Record<string, string> = {
      'Premium': 'text-green-600 bg-green-50 border-green-200',
      'Grade A': 'text-green-500 bg-green-50 border-green-200',
      'Grade B': 'text-yellow-600 bg-yellow-50 border-yellow-200',
      'Grade C': 'text-orange-600 bg-orange-50 border-orange-200',
      'Rejected': 'text-red-600 bg-red-50 border-red-200',
    };
    return colors[grade] || 'text-gray-600 bg-gray-50 border-gray-200';
  };

  const getGradeIcon = (grade: string) => {
    if (grade === 'Premium' || grade === 'Grade A') return <CheckCircle className="w-5 h-5" />;
    if (grade === 'Rejected') return <XCircle className="w-5 h-5" />;
    return <AlertCircle className="w-5 h-5" />;
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-purple-600" />
            AI Quality Shield Scanner
          </h2>
          <p className="text-sm text-gray-600 mt-1">
            YOLOv8 + EfficientNet + Transfer Learning + OpenCV
          </p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1 bg-purple-50 rounded-lg">
          <Zap className="w-4 h-4 text-purple-600" />
          <span className="text-sm font-medium text-purple-600">AI Powered</span>
        </div>
      </div>

      {/* Upload Section */}
      <div className="mb-6">
        <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-purple-500 transition-colors bg-gray-50 hover:bg-gray-100">
          <div className="flex flex-col items-center justify-center pt-5 pb-6">
            {selectedImage ? (
              <img src={selectedImage} alt="Selected" className="max-h-48 rounded-lg" />
            ) : (
              <>
                <Upload className="w-12 h-12 text-gray-400 mb-3" />
                <p className="mb-2 text-sm text-gray-500">
                  <span className="font-semibold">Click to upload</span> or drag and drop
                </p>
                <p className="text-xs text-gray-500">PNG, JPG or JPEG (MAX. 10MB)</p>
              </>
            )}
          </div>
          <input
            type="file"
            className="hidden"
            accept="image/*"
            onChange={handleImageUpload}
            disabled={analyzing}
          />
        </label>
      </div>

      {/* Analyzing State */}
      {analyzing && (
        <div className="flex flex-col items-center justify-center py-8">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-600 mb-4"></div>
          <p className="text-gray-600 font-medium">Analyzing with AI Quality Shield...</p>
          <p className="text-sm text-gray-500 mt-2">Processing with YOLOv8 & EfficientNet</p>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
          <XCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-medium text-red-900">Analysis Failed</p>
            <p className="text-sm text-red-700 mt-1">{error}</p>
          </div>
        </div>
      )}

      {/* Results */}
      {result && result.success && (
        <div className="space-y-6">
          {/* Overall Score */}
          <div className={`rounded-xl p-6 border-2 ${getGradeColor(result.overall_grade)}`}>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                {getGradeIcon(result.overall_grade)}
                <div>
                  <h3 className="text-2xl font-bold">{result.overall_grade}</h3>
                  <p className="text-sm opacity-75">Overall Quality Grade</p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold">{result.overall_quality_score.toFixed(1)}</div>
                <p className="text-sm opacity-75">Quality Score</p>
              </div>
            </div>
            <div className="w-full bg-white bg-opacity-50 rounded-full h-3">
              <div
                className="h-3 rounded-full transition-all duration-500"
                style={{
                  width: `${result.overall_quality_score}%`,
                  backgroundColor: result.overall_quality_score >= 90 ? '#10b981' :
                    result.overall_quality_score >= 75 ? '#84cc16' :
                    result.overall_quality_score >= 60 ? '#eab308' :
                    result.overall_quality_score >= 40 ? '#f97316' : '#ef4444'
                }}
              />
            </div>
          </div>

          {/* Technology Stack */}
          <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg p-4">
            <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-purple-600" />
              Technology Stack
            </h4>
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-white rounded-lg p-3">
                <p className="text-xs text-gray-600">Detection</p>
                <p className="font-semibold text-purple-600">{result.technology_stack.detection}</p>
              </div>
              <div className="bg-white rounded-lg p-3">
                <p className="text-xs text-gray-600">Classification</p>
                <p className="font-semibold text-blue-600">{result.technology_stack.classification}</p>
              </div>
              <div className="bg-white rounded-lg p-3">
                <p className="text-xs text-gray-600">Preprocessing</p>
                <p className="font-semibold text-green-600">{result.technology_stack.preprocessing}</p>
              </div>
              <div className="bg-white rounded-lg p-3">
                <p className="text-xs text-gray-600">Transfer Learning</p>
                <p className="font-semibold text-orange-600">{result.technology_stack.transfer_learning}</p>
              </div>
            </div>
          </div>

          {/* Visualization */}
          {result.visualization_base64 && (
            <div>
              <h4 className="font-semibold text-gray-900 mb-3">AI Detection Visualization</h4>
              <img
                src={`data:image/jpeg;base64,${result.visualization_base64}`}
                alt="Quality visualization"
                className="w-full rounded-lg border-2 border-gray-200"
              />
            </div>
          )}

          {/* Detections */}
          <div>
            <h4 className="font-semibold text-gray-900 mb-3">
              Detected Items ({result.total_detections})
            </h4>
            <div className="space-y-3">
              {result.detections.map((detection) => (
                <div key={detection.detection_id} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${getGradeColor(detection.quality_grade)}`}>
                        {detection.quality_grade}
                      </span>
                      <span className="text-sm text-gray-600">
                        Score: {detection.quality_score.toFixed(1)}
                      </span>
                    </div>
                    <span className="text-sm text-gray-500">
                      Confidence: {(detection.classification_confidence * 100).toFixed(1)}%
                    </span>
                  </div>

                  {/* Features */}
                  <div className="grid grid-cols-3 gap-3 mb-3">
                    <div className="bg-white rounded p-2">
                      <p className="text-xs text-gray-600">Color Uniformity</p>
                      <p className="font-semibold text-sm">{detection.features.color_uniformity.toFixed(1)}</p>
                    </div>
                    <div className="bg-white rounded p-2">
                      <p className="text-xs text-gray-600">Texture Score</p>
                      <p className="font-semibold text-sm">{detection.features.texture_score.toFixed(1)}</p>
                    </div>
                    <div className="bg-white rounded p-2">
                      <p className="text-xs text-gray-600">Shape Regularity</p>
                      <p className="font-semibold text-sm">{detection.features.shape_regularity.toFixed(2)}</p>
                    </div>
                  </div>

                  {/* Defects */}
                  {Object.values(detection.features.defects).some(v => v > 0) && (
                    <div className="bg-red-50 rounded p-2">
                      <p className="text-xs font-medium text-red-900 mb-1">Detected Defects:</p>
                      <div className="flex flex-wrap gap-2">
                        {Object.entries(detection.features.defects)
                          .filter(([_, count]) => count > 0)
                          .map(([defect, count]) => (
                            <span key={defect} className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded">
                              {defect.replace('_', ' ')}: {count}
                            </span>
                          ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
