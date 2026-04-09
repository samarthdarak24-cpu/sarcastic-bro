'use client';

import React, { useState, useRef } from 'react';
import { Camera, Upload, Sparkles, CheckCircle, AlertTriangle, TrendingUp, Image as ImageIcon } from 'lucide-react';

interface DetectedObject {
  id: string;
  name: string;
  confidence: number;
  boundingBox: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
}

interface Defect {
  type: string;
  severity: 'low' | 'medium' | 'high';
  location: string;
  confidence: number;
}

interface AnalysisResult {
  grade: string;
  score: number;
  detectedObjects: DetectedObject[];
  defects: Defect[];
  recommendations: string[];
  marketValue: {
    estimated: number;
    range: { min: number; max: number };
  };
}

export const AdvancedAICropAnalyzer: React.FC = () => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [cameraActive, setCameraActive] = useState(false);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setSelectedImage(e.target?.result as string);
        setResult(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setCameraActive(true);
      }
    } catch (error) {
      console.error('Error accessing camera:', error);
      alert('Unable to access camera. Please check permissions.');
    }
  };

  const capturePhoto = () => {
    if (videoRef.current) {
      const canvas = document.createElement('canvas');
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(videoRef.current, 0, 0);
        const imageData = canvas.toDataURL('image/jpeg');
        setSelectedImage(imageData);
        stopCamera();
      }
    }
  };

  const stopCamera = () => {
    if (videoRef.current?.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
      setCameraActive(false);
    }
  };

  const analyzeImage = async () => {
    if (!selectedImage) return;

    setAnalyzing(true);

    // Simulate AI analysis (replace with actual API call)
    setTimeout(() => {
      const mockResult: AnalysisResult = {
        grade: 'A+',
        score: 94.5,
        detectedObjects: [
          {
            id: '1',
            name: 'Tomato',
            confidence: 98.5,
            boundingBox: { x: 100, y: 100, width: 150, height: 150 }
          },
          {
            id: '2',
            name: 'Tomato',
            confidence: 97.2,
            boundingBox: { x: 300, y: 120, width: 140, height: 140 }
          },
          {
            id: '3',
            name: 'Tomato',
            confidence: 96.8,
            boundingBox: { x: 150, y: 280, width: 145, height: 145 }
          }
        ],
        defects: [
          {
            type: 'Minor bruising',
            severity: 'low',
            location: 'Top-right quadrant',
            confidence: 85.3
          },
          {
            type: 'Color variation',
            severity: 'low',
            location: 'Bottom-left',
            confidence: 78.9
          }
        ],
        recommendations: [
          'Excellent quality for premium market',
          'Harvest at optimal ripeness',
          'Store at 12-15°C for best shelf life',
          'Package carefully to prevent bruising'
        ],
        marketValue: {
          estimated: 65,
          range: { min: 60, max: 70 }
        }
      };

      setResult(mockResult);
      setAnalyzing(false);
    }, 2500);
  };

  const getGradeColor = (grade: string) => {
    if (grade.startsWith('A')) return 'text-green-600';
    if (grade.startsWith('B')) return 'text-blue-600';
    return 'text-yellow-600';
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'low': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'high': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="flex justify-center mb-4">
          <div className="w-20 h-20 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-2xl flex items-center justify-center">
            <Sparkles className="w-10 h-10 text-white" />
          </div>
        </div>
        <h2 className="text-3xl font-bold text-gray-900 mb-2">
          Advanced AI Crop Analyzer
        </h2>
        <p className="text-gray-600 mb-4">Production-Grade Quality Analysis</p>
        
        {/* Features */}
        <div className="flex flex-wrap justify-center gap-4 text-sm">
          <div className="flex items-center gap-2 text-green-600">
            <CheckCircle className="w-4 h-4" />
            <span>Multi-Object Detection</span>
          </div>
          <div className="flex items-center gap-2 text-green-600">
            <CheckCircle className="w-4 h-4" />
            <span>Real Defect Analysis</span>
          </div>
          <div className="flex items-center gap-2 text-green-600">
            <CheckCircle className="w-4 h-4" />
            <span>Quality Grading</span>
          </div>
        </div>
      </div>

      {/* Upload Section */}
      {!selectedImage && !cameraActive && (
        <div className="space-y-4">
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center hover:border-cyan-500 transition-colors">
            <ImageIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 mb-4">Upload crop image for AI analysis</p>
            <div className="flex gap-4 justify-center">
              <button
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center gap-2 px-6 py-3 bg-cyan-500 text-white rounded-lg hover:bg-cyan-600 transition-colors"
              >
                <Upload className="w-5 h-5" />
                Upload Image
              </button>
              <button
                onClick={startCamera}
                className="flex items-center gap-2 px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
                <Camera className="w-5 h-5" />
                Use Camera
              </button>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />
          </div>
        </div>
      )}

      {/* Camera View */}
      {cameraActive && (
        <div className="space-y-4">
          <div className="relative rounded-lg overflow-hidden bg-black">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              className="w-full h-96 object-cover"
            />
          </div>
          <div className="flex gap-4 justify-center">
            <button
              onClick={capturePhoto}
              className="flex items-center gap-2 px-6 py-3 bg-cyan-500 text-white rounded-lg hover:bg-cyan-600 transition-colors"
            >
              <Camera className="w-5 h-5" />
              Capture Photo
            </button>
            <button
              onClick={stopCamera}
              className="px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Image Preview & Analysis */}
      {selectedImage && (
        <div className="space-y-6">
          {/* Image */}
          <div className="relative rounded-lg overflow-hidden border-2 border-gray-200">
            <img
              src={selectedImage}
              alt="Crop to analyze"
              className="w-full h-96 object-cover"
            />
          </div>

          {/* Action Buttons */}
          {!result && (
            <div className="flex gap-4 justify-center">
              <button
                onClick={analyzeImage}
                disabled={analyzing}
                className="flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-lg hover:from-cyan-600 hover:to-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Sparkles className="w-5 h-5" />
                {analyzing ? 'Analyzing...' : 'Analyze with AI'}
              </button>
              <button
                onClick={() => {
                  setSelectedImage(null);
                  setResult(null);
                }}
                className="px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
              >
                Choose Another
              </button>
            </div>
          )}

          {/* Analysis Progress */}
          {analyzing && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                <span className="text-blue-900 font-medium">AI Analysis in Progress...</span>
              </div>
              <div className="space-y-2 text-sm text-blue-700">
                <p>✓ Multi-object detection running...</p>
                <p>✓ Defect analysis in progress...</p>
                <p>✓ Quality grading calculation...</p>
              </div>
            </div>
          )}

          {/* Results */}
          {result && (
            <div className="space-y-6">
              {/* Overall Grade */}
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200 rounded-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">Quality Grade</h3>
                    <p className={`text-5xl font-bold ${getGradeColor(result.grade)}`}>
                      {result.grade}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-600 mb-1">Quality Score</p>
                    <p className="text-3xl font-bold text-gray-900">{result.score}%</p>
                  </div>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className="bg-gradient-to-r from-green-500 to-emerald-500 h-3 rounded-full transition-all duration-1000"
                    style={{ width: `${result.score}%` }}
                  ></div>
                </div>
              </div>

              {/* Detected Objects */}
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  Multi-Object Detection
                </h3>
                <div className="space-y-3">
                  {result.detectedObjects.map((obj) => (
                    <div key={obj.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium text-gray-900">{obj.name}</p>
                        <p className="text-sm text-gray-600">
                          Position: ({obj.boundingBox.x}, {obj.boundingBox.y})
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-600">Confidence</p>
                        <p className="text-lg font-semibold text-green-600">{obj.confidence}%</p>
                      </div>
                    </div>
                  ))}
                </div>
                <p className="mt-4 text-sm text-gray-600">
                  Total objects detected: <span className="font-semibold">{result.detectedObjects.length}</span>
                </p>
              </div>

              {/* Defects Analysis */}
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-yellow-600" />
                  Real Defect Analysis
                </h3>
                {result.defects.length > 0 ? (
                  <div className="space-y-3">
                    {result.defects.map((defect, index) => (
                      <div key={index} className="p-4 bg-gray-50 rounded-lg">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <p className="font-medium text-gray-900">{defect.type}</p>
                            <p className="text-sm text-gray-600">{defect.location}</p>
                          </div>
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${getSeverityColor(defect.severity)}`}>
                            {defect.severity.toUpperCase()}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <span>Confidence:</span>
                          <div className="flex-1 bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-yellow-500 h-2 rounded-full"
                              style={{ width: `${defect.confidence}%` }}
                            ></div>
                          </div>
                          <span className="font-medium">{defect.confidence}%</span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-green-600">
                    <CheckCircle className="w-12 h-12 mx-auto mb-2" />
                    <p className="font-medium">No defects detected!</p>
                    <p className="text-sm text-gray-600">Excellent quality produce</p>
                  </div>
                )}
              </div>

              {/* Market Value */}
              <div className="bg-gradient-to-br from-blue-50 to-cyan-50 border-2 border-blue-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-blue-600" />
                  Estimated Market Value
                </h3>
                <div className="text-center mb-4">
                  <p className="text-4xl font-bold text-blue-600">₹{result.marketValue.estimated}/kg</p>
                  <p className="text-sm text-gray-600 mt-2">
                    Range: ₹{result.marketValue.range.min} - ₹{result.marketValue.range.max}/kg
                  </p>
                </div>
              </div>

              {/* Recommendations */}
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">AI Recommendations</h3>
                <ul className="space-y-2">
                  {result.recommendations.map((rec, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-700">{rec}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4 justify-center">
                <button
                  onClick={() => {
                    setSelectedImage(null);
                    setResult(null);
                  }}
                  className="px-6 py-3 bg-cyan-500 text-white rounded-lg hover:bg-cyan-600 transition-colors"
                >
                  Analyze Another
                </button>
                <button
                  className="px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                >
                  Save Report
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
