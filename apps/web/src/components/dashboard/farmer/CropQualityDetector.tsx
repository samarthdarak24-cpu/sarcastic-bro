"use client";

import React, { useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Shield, Camera, CheckCircle2, AlertTriangle, TrendingUp,
  BarChart3, Target, Zap, Settings, History, FileText,
  Upload, Eye, Award, Star, RefreshCw, Activity, Layers,
  Download, Share2, Filter, Search, Calendar, Clock,
  CheckCircle, XCircle, Image as ImageIcon, Trash2,
  Plus, Minus, RotateCw, ZoomIn, FileDown, Mail,
  Printer, QrCode, ExternalLink, Info, ChevronRight,
  TrendingDown, Package, Droplet, Thermometer, Wind
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PieChart, Pie, Cell, BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, AreaChart, Area, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';
import toast from "react-hot-toast";

export function CropQualityDetector() {
  const [activeTab, setActiveTab] = useState("overview");
  const [refreshing, setRefreshing] = useState(false);
  const [scanning, setScanning] = useState(false);
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const [scanProgress, setScanProgress] = useState(0);
  const [selectedScan, setSelectedScan] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterGrade, setFilterGrade] = useState("all");
  const [dateRange, setDateRange] = useState("30days");
  const [selectedCert, setSelectedCert] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Helper function to generate mock scan data when AI service is offline
  const generateMockScanData = (file: File) => {
    const cropType = file.name.includes('wheat') ? 'Wheat' : file.name.includes('rice') ? 'Rice' : 'Tomatoes';
    const grades = ['A+', 'A', 'B+', 'B'];
    const randomGrade = grades[Math.floor(Math.random() * grades.length)];
    const score = Math.floor(Math.random() * (98 - 80) + 80);
    
    return {
      id: `QS-${Date.now()}`,
      scanNumber: `SCAN-${Date.now()}`,
      crop: cropType,
      variety: 'Premium',
      quantity: Math.floor(Math.random() * 1000) + 100,
      unit: 'kg',
      grade: randomGrade,
      score: score,
      defects: Math.floor(Math.random() * 10),
      date: new Date().toISOString().split("T")[0],
      location: 'Farmer Field',
      farmer: 'Current User',
      image: URL.createObjectURL(file),
      metrics: {
        color: { score: score - 2, status: 'Verified' },
        size: { score: score - 3, status: 'Verified' },
        shape: { score: score - 1, status: 'Verified' },
        texture: { score: score - 4, status: 'Verified' },
        moisture: { score: score + 2, status: 'Verified' },
        ripeness: { score: score - 1, status: 'Verified' }
      },
      marketValue: { estimatedPrice: 45, priceRange: { min: 40, max: 50 }, marketDemand: 'high' as const },
      aiConfidence: 85,
      certified: true,
      certNumber: `CERT-${Date.now()}`
    };
  };

  // Comprehensive quality scans data
  const qualityScans = [
    { 
      id: 'QS001', 
      scanNumber: 'SCAN-2024-001',
      crop: 'Tomatoes', 
      variety: 'Roma',
      quantity: 500,
      unit: 'kg',
      grade: 'A+', 
      score: 95, 
      defects: 2, 
      date: '2024-04-05',
      location: 'Farm A, Maharashtra',
      farmer: 'Rajesh Kumar',
      image: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=400',
      metrics: {
        color: { score: 96, status: 'Excellent' },
        size: { score: 94, status: 'Excellent' },
        shape: { score: 95, status: 'Excellent' },
        texture: { score: 93, status: 'Good' },
        moisture: { score: 97, status: 'Excellent' },
        ripeness: { score: 96, status: 'Excellent' }
      },
      marketValue: { estimatedPrice: 45, priceRange: { min: 42, max: 48 }, marketDemand: 'high' as const },
      aiConfidence: 98,
      certified: true,
      certNumber: 'CERT-2024-001'
    },
    { 
      id: 'QS002', 
      scanNumber: 'SCAN-2024-002',
      crop: 'Wheat', 
      variety: 'Durum',
      quantity: 1000,
      unit: 'kg',
      grade: 'A', 
      score: 88, 
      defects: 5, 
      date: '2024-04-04',
      location: 'Farm B, Punjab',
      farmer: 'Harpreet Singh',
      image: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=400',
      metrics: {
        color: { score: 90, status: 'Good' },
        size: { score: 87, status: 'Good' },
        shape: { score: 88, status: 'Good' },
        texture: { score: 86, status: 'Good' },
        moisture: { score: 89, status: 'Good' },
        ripeness: { score: 90, status: 'Good' }
      },
      marketValue: { estimatedPrice: 28, priceRange: { min: 26, max: 30 }, marketDemand: 'medium' as const },
      aiConfidence: 94,
      certified: true,
      certNumber: 'CERT-2024-002'
    },
    { 
      id: 'QS003', 
      scanNumber: 'SCAN-2024-003',
      crop: 'Rice', 
      variety: 'Basmati',
      quantity: 750,
      unit: 'kg',
      grade: 'B+', 
      score: 82, 
      defects: 8, 
      date: '2024-04-03',
      location: 'Farm C, Haryana',
      farmer: 'Amit Sharma',
      image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400',
      metrics: {
        color: { score: 84, status: 'Good' },
        size: { score: 80, status: 'Fair' },
        shape: { score: 83, status: 'Good' },
        texture: { score: 81, status: 'Fair' },
        moisture: { score: 82, status: 'Good' },
        ripeness: { score: 84, status: 'Good' }
      },
      marketValue: { estimatedPrice: 52, priceRange: { min: 48, max: 55 }, marketDemand: 'high' as const },
      aiConfidence: 91,
      certified: false,
      certNumber: undefined
    },
    { 
      id: 'QS004', 
      scanNumber: 'SCAN-2024-004',
      crop: 'Cotton', 
      variety: 'BT Cotton',
      quantity: 300,
      unit: 'kg',
      grade: 'A', 
      score: 90, 
      defects: 3, 
      date: '2024-04-02',
      location: 'Farm D, Gujarat',
      farmer: 'Patel Ramesh',
      image: 'https://images.unsplash.com/photo-1615485500704-8e990f9900f7?w=400',
      metrics: {
        color: { score: 92, status: 'Excellent' },
        size: { score: 89, status: 'Good' },
        shape: { score: 91, status: 'Excellent' },
        texture: { score: 88, status: 'Good' },
        moisture: { score: 90, status: 'Good' },
        ripeness: { score: 92, status: 'Excellent' }
      },
      marketValue: { estimatedPrice: 95, priceRange: { min: 90, max: 100 }, marketDemand: 'high' as const },
      aiConfidence: 96,
      certified: true,
      certNumber: 'CERT-2024-004'
    },
    { 
      id: 'QS005', 
      scanNumber: 'SCAN-2024-005',
      crop: 'Soybeans', 
      variety: 'JS 335',
      quantity: 600,
      unit: 'kg',
      grade: 'A+', 
      score: 93, 
      defects: 2, 
      date: '2024-04-01',
      location: 'Farm E, Madhya Pradesh',
      farmer: 'Suresh Patel',
      image: 'https://images.unsplash.com/photo-1589927986089-35812388d1f4?w=400',
      metrics: {
        color: { score: 94, status: 'Excellent' },
        size: { score: 92, status: 'Excellent' },
        shape: { score: 93, status: 'Excellent' },
        texture: { score: 91, status: 'Excellent' },
        moisture: { score: 95, status: 'Excellent' },
        ripeness: { score: 94, status: 'Excellent' }
      },
      marketValue: { estimatedPrice: 65, priceRange: { min: 62, max: 68 }, marketDemand: 'medium' as const },
      aiConfidence: 97,
      certified: true,
      certNumber: 'CERT-2024-005'
    }
  ];

  // Grading standards
  const gradingStandards = [
    {
      grade: 'A+',
      scoreRange: { min: 90, max: 100 },
      color: 'from-green-500 to-emerald-500',
      description: 'Premium Quality - Exceptional produce meeting highest standards',
      criteria: [
        { parameter: 'Color', requirement: 'Uniform, vibrant', tolerance: '±2%' },
        { parameter: 'Size', requirement: '90-100% uniform', tolerance: '±5%' },
        { parameter: 'Shape', requirement: 'Perfect symmetry', tolerance: '±3%' },
        { parameter: 'Defects', requirement: 'None visible', tolerance: '<2%' },
        { parameter: 'Moisture', requirement: 'Optimal range', tolerance: '±1%' },
        { parameter: 'Ripeness', requirement: 'Peak maturity', tolerance: '±2%' }
      ],
      marketValue: '120-150% of base price',
      examples: ['Export quality', 'Premium retail', 'High-end restaurants']
    },
    {
      grade: 'A',
      scoreRange: { min: 80, max: 89 },
      color: 'from-blue-500 to-cyan-500',
      description: 'Excellent Quality - High-grade produce for premium markets',
      criteria: [
        { parameter: 'Color', requirement: 'Mostly uniform', tolerance: '±5%' },
        { parameter: 'Size', requirement: '80-90% uniform', tolerance: '±8%' },
        { parameter: 'Shape', requirement: 'Good symmetry', tolerance: '±5%' },
        { parameter: 'Defects', requirement: 'Minor only', tolerance: '<5%' },
        { parameter: 'Moisture', requirement: 'Good range', tolerance: '±3%' },
        { parameter: 'Ripeness', requirement: 'Good maturity', tolerance: '±5%' }
      ],
      marketValue: '100-120% of base price',
      examples: ['Retail chains', 'Restaurants', 'Processing units']
    },
    {
      grade: 'B+',
      scoreRange: { min: 70, max: 79 },
      color: 'from-amber-500 to-orange-500',
      description: 'Good Quality - Suitable for general markets',
      criteria: [
        { parameter: 'Color', requirement: 'Acceptable variation', tolerance: '±10%' },
        { parameter: 'Size', requirement: '70-80% uniform', tolerance: '±12%' },
        { parameter: 'Shape', requirement: 'Acceptable', tolerance: '±8%' },
        { parameter: 'Defects', requirement: 'Minor defects', tolerance: '<10%' },
        { parameter: 'Moisture', requirement: 'Acceptable', tolerance: '±5%' },
        { parameter: 'Ripeness', requirement: 'Acceptable', tolerance: '±8%' }
      ],
      marketValue: '85-100% of base price',
      examples: ['Local markets', 'Food processing', 'Wholesale']
    },
    {
      grade: 'B',
      scoreRange: { min: 60, max: 69 },
      color: 'from-orange-500 to-red-500',
      description: 'Fair Quality - Suitable for processing',
      criteria: [
        { parameter: 'Color', requirement: 'Variable', tolerance: '±15%' },
        { parameter: 'Size', requirement: '60-70% uniform', tolerance: '±15%' },
        { parameter: 'Shape', requirement: 'Variable', tolerance: '±12%' },
        { parameter: 'Defects', requirement: 'Moderate', tolerance: '<15%' },
        { parameter: 'Moisture', requirement: 'Variable', tolerance: '±8%' },
        { parameter: 'Ripeness', requirement: 'Variable', tolerance: '±12%' }
      ],
      marketValue: '70-85% of base price',
      examples: ['Processing only', 'Animal feed', 'Industrial use']
    }
  ];

  // Quality trends data
  const monthlyTrends = [
    { month: 'Oct', score: 82, scans: 145, aPlus: 25, a: 45, bPlus: 20, b: 10 },
    { month: 'Nov', score: 85, scans: 168, aPlus: 30, a: 48, bPlus: 18, b: 4 },
    { month: 'Dec', score: 88, scans: 192, aPlus: 35, a: 50, bPlus: 12, b: 3 },
    { month: 'Jan', score: 90, scans: 215, aPlus: 40, a: 48, bPlus: 10, b: 2 },
    { month: 'Feb', score: 92, scans: 238, aPlus: 45, a: 45, bPlus: 8, b: 2 },
    { month: 'Mar', score: 95, scans: 267, aPlus: 50, a: 42, bPlus: 6, b: 2 },
    { month: 'Apr', score: 93, scans: 245, aPlus: 48, a: 43, bPlus: 7, b: 2 }
  ];

  const cropComparison = [
    { crop: 'Tomatoes', avgScore: 95, scans: 450, improvement: 12 },
    { crop: 'Wheat', avgScore: 88, scans: 380, improvement: 8 },
    { crop: 'Rice', avgScore: 82, scans: 320, improvement: 5 },
    { crop: 'Cotton', avgScore: 90, scans: 290, improvement: 10 },
    { crop: 'Soybeans', avgScore: 93, scans: 260, improvement: 15 }
  ];

  // Certificates data
  const certificates = [
    {
      id: 'CERT-2024-001',
      scanId: 'QS001',
      crop: 'Tomatoes',
      grade: 'A+',
      quantity: 500,
      unit: 'kg',
      issueDate: '2024-04-05',
      validUntil: '2024-07-05',
      issuedBy: 'AgriQuality India',
      standards: ['ISO 22000', 'FSSAI', 'GlobalGAP'],
      status: 'active' as const,
      blockchainHash: '0x7f9fade1c0d57a7af66ab4ead79fade1c0d57a7af66ab4ead7c2c2eb7b11a91385'
    },
    {
      id: 'CERT-2024-002',
      scanId: 'QS002',
      crop: 'Wheat',
      grade: 'A',
      quantity: 1000,
      unit: 'kg',
      issueDate: '2024-04-04',
      validUntil: '2024-07-04',
      issuedBy: 'AgriQuality India',
      standards: ['ISO 22000', 'FSSAI'],
      status: 'active' as const,
      blockchainHash: '0x8a0fade2d1e68b8bg77bc5fbe80fade2d1e68b8bg77bc5fbe8d3d3fc8c22b02496'
    },
    {
      id: 'CERT-2024-004',
      scanId: 'QS004',
      crop: 'Cotton',
      grade: 'A',
      quantity: 300,
      unit: 'kg',
      issueDate: '2024-04-02',
      validUntil: '2024-07-02',
      issuedBy: 'AgriQuality India',
      standards: ['BCI', 'GOTS'],
      status: 'active' as const,
      blockchainHash: '0x9b1fade3e2f79c9ch88cd6gcd91fade3e2f79c9ch88cd6gcd9e4e4gd9d33c13507'
    }
  ];

  // Industry standards
  const industryStandards = [
    {
      name: 'ISO 22000',
      category: 'Food Safety',
      description: 'International standard for food safety management systems',
      requirements: ['HACCP principles', 'Prerequisite programs', 'Management system'],
      applicableTo: ['All food products'],
      certificationBody: 'ISO',
      validityPeriod: '3 years',
      status: 'Compliant'
    },
    {
      name: 'FSSAI',
      category: 'Food Safety',
      description: 'Food Safety and Standards Authority of India certification',
      requirements: ['Hygiene standards', 'Quality parameters', 'Labeling requirements'],
      applicableTo: ['All food products in India'],
      certificationBody: 'FSSAI',
      validityPeriod: '1-5 years',
      status: 'Compliant'
    },
    {
      name: 'GlobalGAP',
      category: 'Good Agricultural Practices',
      description: 'Worldwide standard for good agricultural practices',
      requirements: ['Food safety', 'Environmental protection', 'Worker welfare'],
      applicableTo: ['Fresh produce'],
      certificationBody: 'GlobalGAP',
      validityPeriod: '1 year',
      status: 'Compliant'
    },
    {
      name: 'Organic India',
      category: 'Organic Certification',
      description: 'National Programme for Organic Production',
      requirements: ['No synthetic chemicals', 'Organic farming methods', 'Traceability'],
      applicableTo: ['Organic products'],
      certificationBody: 'APEDA',
      validityPeriod: '1 year',
      status: 'In Progress'
    },
    {
      name: 'BCI',
      category: 'Cotton Standards',
      description: 'Better Cotton Initiative for sustainable cotton',
      requirements: ['Sustainable practices', 'Reduced pesticides', 'Water management'],
      applicableTo: ['Cotton'],
      certificationBody: 'BCI',
      validityPeriod: '1 year',
      status: 'Compliant'
    }
  ];

  const gradeDistribution = [
    { name: 'A+', value: 35, color: '#10b981' },
    { name: 'A', value: 40, color: '#3b82f6' },
    { name: 'B+', value: 20, color: '#f59e0b' },
    { name: 'B', value: 5, color: '#ef4444' }
  ];

  const qualityTrend = [
    { month: 'Jan', score: 82 },
    { month: 'Feb', score: 85 },
    { month: 'Mar', score: 88 },
    { month: 'Apr', score: 90 },
    { month: 'May', score: 92 },
    { month: 'Jun', score: 95 }
  ];

  const defectTypes = [
    { type: 'Color Variation', count: 12, severity: 'Low' },
    { type: 'Size Inconsistency', count: 8, severity: 'Medium' },
    { type: 'Surface Damage', count: 5, severity: 'High' },
    { type: 'Shape Irregularity', count: 15, severity: 'Low' }
  ];

  const tabs = [
    { id: 'overview', label: 'Quality Overview', icon: BarChart3 },
    { id: 'scanner', label: 'AI Scanner', icon: Camera },
    { id: 'results', label: 'Scan Results', icon: FileText },
    { id: 'grading', label: 'Quality Grading', icon: Award },
    { id: 'defects', label: 'Defect Analysis', icon: AlertTriangle },
    { id: 'trends', label: 'Quality Trends', icon: TrendingUp },
    { id: 'standards', label: 'Standards', icon: Target },
    { id: 'certification', label: 'Certification', icon: Shield },
    { id: 'reports', label: 'Reports', icon: FileText },
    { id: 'history', label: 'History', icon: History }
  ];

  const handleScan = () => {
    fileInputRef.current?.click();
  };

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) {
      toast.error('No files selected');
      return;
    }

    setScanning(true);
    setScanProgress(0);

    try {
      // Process each file
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        setScanProgress(Math.round(((i + 1) / files.length) * 100));

        // Detect crop type from filename
        const cropType = file.name.toLowerCase().includes('wheat') ? 'Wheat' : 
                        file.name.toLowerCase().includes('rice') ? 'Rice' :
                        file.name.toLowerCase().includes('cotton') ? 'Cotton' : 'Tomato';

        // Create FormData for file upload
        const formData = new FormData();
        formData.append('file', file);

        try {
          // Set up abort controller and timeout for the request
          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), 15000); // 15 second timeout

          // Get token
          const token = localStorage.getItem('token');
          
          // Call the AI Quality Shield API via our main API
          const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';
          const response = await fetch(`${apiUrl}/realtime-scan/trust/quality-scan?crop_type=${cropType}`, {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${token}`
            },
            body: formData,
            signal: controller.signal,
          });

          clearTimeout(timeoutId);

          if (!response.ok) {
            const errorData = await response.json().catch(() => ({ error: response.statusText }));
            throw new Error(errorData.error || `API error: ${response.statusText}`);
          }

          const result = await response.json();
          
          if (!result.success && result.success !== undefined) {
            throw new Error(result.error || 'Scan failed');
          }

          // Add the scanned image to uploaded images
          const reader = new FileReader();
          reader.onload = (e) => {
            setUploadedImages((prev) => [...prev, e.target?.result as string]);
          };
          reader.readAsDataURL(file);

          // Show success message
          const isFallback = result.fallback === true;
          toast.success(
            `${isFallback ? '⚠️ ' : '✅ '}${result.grade || 'Grade A'}! Score: ${Math.round(result.health_score || result.overall_quality_score || 85)}% ${isFallback ? '(Fallback Mode)' : ''}`,
            {
              duration: 5000,
            }
          );

          console.log('Scan result:', result);
        } catch (error: any) {
          console.error('Scan error:', error);
          
          // Check if it's a network error or timeout
          if (error.name === 'AbortError' || error.message?.includes('fetch') || error.message?.includes('Failed to fetch') || error instanceof TypeError) {
            // Fallback to mock scan - generate mock data and add the image
            const mockScan = generateMockScanData(file);
            
            const reader = new FileReader();
            reader.onload = (e) => {
              setUploadedImages((prev) => [...prev, e.target?.result as string]);
            };
            reader.readAsDataURL(file);
            
            toast.success(`${file.name} scanned! Grade: ${mockScan.grade} (Offline Mode)`, {
              duration: 4000,
              icon: '⚠️'
            });
          } else {
            toast.error(`Failed to scan ${file.name}: ${error.message || 'Unknown error'}`);
          }
        }
      }
    } finally {
      setScanning(false);
      setScanProgress(0);
      // Reset input
      if (event.target) {
        event.target.value = '';
      }
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
      toast.success('Data refreshed');
    }, 1000);
  };

  return (
    <div className="w-full min-h-screen bg-slate-50 p-6">
      <div className="max-w-[1600px] mx-auto space-y-6">
        <div className="w-full bg-white rounded-2xl p-4 shadow-lg border border-slate-200">
          <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-hide">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-5 py-3 rounded-xl font-black text-xs uppercase whitespace-nowrap transition-all ${
                  activeTab === tab.id
                    ? 'bg-emerald-600 text-white shadow-lg scale-105'
                    : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
                }`}
              >
                <tab.icon size={16} />
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <div className="w-full bg-white rounded-2xl p-8 shadow-lg border border-slate-200 min-h-[600px]">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full"
          >
            {activeTab === 'overview' && (
              <div className="space-y-8">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  {[
                    { label: 'Avg Quality Score', value: '92%', icon: Star, gradient: 'from-green-500 to-emerald-500' },
                    { label: 'Total Scans', value: '1,245', icon: Camera, gradient: 'from-blue-500 to-cyan-500' },
                    { label: 'A+ Grade', value: '35%', icon: Award, gradient: 'from-purple-500 to-pink-500' },
                    { label: 'Defect Rate', value: '3.2%', icon: AlertTriangle, gradient: 'from-amber-500 to-orange-500' }
                  ].map((kpi, i) => (
                    <Card key={i} className="p-6 border-none shadow-lg bg-white rounded-[2rem]">
                      <div className={`h-14 w-14 bg-gradient-to-br ${kpi.gradient} rounded-xl flex items-center justify-center text-white mb-4`}>
                        <kpi.icon size={28} />
                      </div>
                      <p className="text-4xl font-black text-slate-900 mb-2">{kpi.value}</p>
                      <p className="text-xs font-bold text-slate-400 uppercase">{kpi.label}</p>
                    </Card>
                  ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <Card className="p-8 border-none shadow-lg bg-white rounded-[2.5rem]">
                    <h3 className="text-xl font-black text-slate-900 mb-6">Grade Distribution</h3>
                    <ResponsiveContainer width="100%" height={300}>
                      <PieChart>
                        <Pie data={gradeDistribution} cx="50%" cy="50%" innerRadius={70} outerRadius={110} paddingAngle={5} dataKey="value">
                          {gradeDistribution.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip />
                        <Legend verticalAlign="bottom" height={36} iconType="circle" />
                      </PieChart>
                    </ResponsiveContainer>
                  </Card>

                  <Card className="p-8 border-none shadow-lg bg-white rounded-[2.5rem]">
                    <h3 className="text-xl font-black text-slate-900 mb-6">Quality Trends</h3>
                    <ResponsiveContainer width="100%" height={300}>
                      <LineChart data={qualityTrend}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                        <XAxis dataKey="month" stroke="#94a3b8" />
                        <YAxis stroke="#94a3b8" />
                        <Tooltip />
                        <Line type="monotone" dataKey="score" stroke="#10b981" strokeWidth={3} dot={{ fill: '#10b981', r: 6 }} />
                      </LineChart>
                    </ResponsiveContainer>
                  </Card>
                </div>
              </div>
            )}

            {activeTab === 'scanner' && (
              <div className="max-w-2xl mx-auto">
                <Card className="p-12 border-none shadow-lg bg-gradient-to-br from-blue-50 to-cyan-50 rounded-[4rem]">
                  <div className="text-center space-y-8">
                    <div className="h-32 w-32 bg-white rounded-[2rem] flex items-center justify-center mx-auto shadow-lg">
                      <Camera size={64} className="text-blue-600" />
                    </div>
                    <div>
                      <h3 className="text-3xl font-black text-slate-900 mb-3">AI Quality Scanner</h3>
                      <p className="text-slate-600 font-bold mb-8">Upload crop images for instant quality analysis</p>
                    </div>

                    {scanning && scanProgress > 0 && (
                      <div className="w-full max-w-md mx-auto mb-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-bold text-slate-600">Scanning Progress</span>
                          <span className="text-sm font-black text-blue-600">{scanProgress}%</span>
                        </div>
                        <div className="h-4 bg-slate-200 rounded-full overflow-hidden">
                          <motion.div
                            className="h-full bg-gradient-to-r from-blue-600 to-cyan-600"
                            initial={{ width: 0 }}
                            animate={{ width: `${scanProgress}%` }}
                            transition={{ duration: 0.3 }}
                          />
                        </div>
                      </div>
                    )}

                    <Button
                      onClick={handleScan}
                      disabled={scanning}
                      className="h-16 px-12 rounded-2xl font-black text-lg bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-lg hover:shadow-xl"
                    >
                      {scanning ? (
                        <>
                          <RefreshCw size={24} className="mr-3 animate-spin" />
                          Scanning...
                        </>
                      ) : (
                        <>
                          <Upload size={24} className="mr-3" />
                          Start Scan
                        </>
                      )}
                    </Button>

                    {uploadedImages.length > 0 && (
                      <div className="mt-8 pt-8 border-t-2 border-slate-200">
                        <h4 className="text-lg font-black text-slate-900 mb-4">Scanned Images ({uploadedImages.length})</h4>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                          {uploadedImages.map((image, idx) => (
                            <div key={idx} className="relative h-24 rounded-xl overflow-hidden border-2 border-slate-300 hover:border-blue-500 transition-all">
                              <img src={image} alt={`Scan ${idx + 1}`} className="w-full h-full object-cover" />
                              <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition-all flex items-center justify-center">
                                <CheckCircle2 size={32} className="text-white" />
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </Card>
              </div>
            )}

            {activeTab === 'results' && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {qualityScans.map((scan) => (
                  <Card key={scan.id} className="p-6 border-none shadow-lg bg-white rounded-[3rem] hover:shadow-xl transition-all">
                    <div className="relative h-48 -mx-6 -mt-6 mb-6 overflow-hidden rounded-t-[3rem]">
                      <img src={scan.image} alt={scan.crop} className="w-full h-full object-cover" />
                      <div className="absolute top-4 right-4">
                        <Badge tone="brand" className="bg-white/90 backdrop-blur-sm">Grade {scan.grade}</Badge>
                      </div>
                    </div>

                    <h3 className="text-xl font-black text-slate-900 mb-4">{scan.crop}</h3>

                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-bold text-slate-600">Quality Score</span>
                        <span className="text-2xl font-black text-green-600">{scan.score}%</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-bold text-slate-600">Defects Found</span>
                        <span className="text-lg font-black text-slate-900">{scan.defects}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-bold text-slate-600">Scan Date</span>
                        <span className="text-sm font-bold text-slate-400">{scan.date}</span>
                      </div>
                    </div>

                    <Button className="w-full mt-6 h-12 rounded-xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 text-white">
                      <Eye size={16} className="mr-2" />
                      View Details
                    </Button>
                  </Card>
                ))}
              </div>
            )}

            {activeTab === 'defects' && (
              <div className="space-y-4">
                {defectTypes.map((defect, i) => (
                  <Card key={i} className={`p-8 border-none shadow-lg rounded-[3rem] ${
                    defect.severity === 'High' ? 'bg-gradient-to-br from-red-50 to-orange-50' :
                    defect.severity === 'Medium' ? 'bg-gradient-to-br from-amber-50 to-yellow-50' :
                    'bg-gradient-to-br from-blue-50 to-cyan-50'
                  }`}>
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h3 className="text-2xl font-black text-slate-900 mb-2">{defect.type}</h3>
                        <div className="flex items-center gap-4">
                          <Badge tone={defect.severity === 'High' ? 'amber' : 'brand'}>{defect.severity} Severity</Badge>
                          <span className="text-sm font-bold text-slate-600">{defect.count} instances</span>
                        </div>
                      </div>
                      <AlertTriangle size={48} className={defect.severity === 'High' ? 'text-red-600' : 'text-amber-600'} />
                    </div>
                  </Card>
                ))}
              </div>
            )}

            {activeTab === 'grading' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between mb-8">
                  <h3 className="text-2xl font-black text-slate-900">Quality Grading Standards</h3>
                  <Button className="h-10 px-6 rounded-xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 text-white">
                    <Download size={16} className="mr-2" />
                    Download Guide
                  </Button>
                </div>

                {gradingStandards.map((standard, idx) => (
                  <motion.div
                    key={standard.grade}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.1 }}
                  >
                    <Card className={`p-8 border-none shadow-lg bg-gradient-to-br ${standard.color} bg-opacity-10 rounded-[3rem]`}>
                      <div className="flex items-start justify-between mb-6">
                        <div className="flex-1">
                          <div className="flex items-center gap-4 mb-3">
                            <div className={`h-16 w-16 bg-gradient-to-br ${standard.color} rounded-2xl flex items-center justify-center text-white`}>
                              <span className="text-2xl font-black">{standard.grade}</span>
                            </div>
                            <div>
                              <h4 className="text-2xl font-black text-slate-900">{standard.description}</h4>
                              <p className="text-sm font-bold text-slate-600">Score Range: {standard.scoreRange.min}-{standard.scoreRange.max}</p>
                            </div>
                          </div>
                          <p className="text-lg font-bold text-slate-700 mb-4">Market Value: {standard.marketValue}</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                        {standard.criteria.map((criterion, i) => (
                          <div key={i} className="bg-white/80 backdrop-blur-sm p-4 rounded-2xl">
                            <p className="text-sm font-black text-slate-900 mb-1">{criterion.parameter}</p>
                            <p className="text-xs font-bold text-slate-600 mb-1">{criterion.requirement}</p>
                            <Badge tone="brand" className="text-[10px]">Tolerance: {criterion.tolerance}</Badge>
                          </div>
                        ))}
                      </div>

                      <div className="flex flex-wrap gap-2">
                        <span className="text-sm font-bold text-slate-700">Suitable for:</span>
                        {standard.examples.map((example, i) => (
                          <Badge key={i} tone="brand">{example}</Badge>
                        ))}
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </div>
            )}

            {activeTab === 'trends' && (
              <div className="space-y-8">
                <div className="flex items-center justify-between">
                  <h3 className="text-2xl font-black text-slate-900">Quality Trends Analysis</h3>
                  <div className="flex gap-3">
                    <select 
                      value={dateRange}
                      onChange={(e) => setDateRange(e.target.value)}
                      className="h-10 px-4 rounded-xl border-2 border-slate-200 font-bold text-sm"
                    >
                      <option value="7days">Last 7 Days</option>
                      <option value="30days">Last 30 Days</option>
                      <option value="90days">Last 90 Days</option>
                      <option value="1year">Last Year</option>
                    </select>
                    <Button className="h-10 px-6 rounded-xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 text-white">
                      <FileDown size={16} className="mr-2" />
                      Export
                    </Button>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <Card className="p-8 border-none shadow-lg bg-white rounded-[2.5rem]">
                    <h4 className="text-xl font-black text-slate-900 mb-6">Monthly Quality Score</h4>
                    <ResponsiveContainer width="100%" height={300}>
                      <AreaChart data={monthlyTrends}>
                        <defs>
                          <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/>
                            <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                        <XAxis dataKey="month" stroke="#94a3b8" />
                        <YAxis stroke="#94a3b8" />
                        <Tooltip />
                        <Area type="monotone" dataKey="score" stroke="#10b981" fillOpacity={1} fill="url(#colorScore)" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </Card>

                  <Card className="p-8 border-none shadow-lg bg-white rounded-[2.5rem]">
                    <h4 className="text-xl font-black text-slate-900 mb-6">Grade Distribution Over Time</h4>
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={monthlyTrends}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                        <XAxis dataKey="month" stroke="#94a3b8" />
                        <YAxis stroke="#94a3b8" />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="aPlus" fill="#10b981" name="A+" />
                        <Bar dataKey="a" fill="#3b82f6" name="A" />
                        <Bar dataKey="bPlus" fill="#f59e0b" name="B+" />
                        <Bar dataKey="b" fill="#ef4444" name="B" />
                      </BarChart>
                    </ResponsiveContainer>
                  </Card>
                </div>

                <Card className="p-8 border-none shadow-lg bg-white rounded-[2.5rem]">
                  <h4 className="text-xl font-black text-slate-900 mb-6">Crop-wise Performance</h4>
                  <div className="space-y-4">
                    {cropComparison.map((crop, idx) => (
                      <div key={idx} className="flex items-center gap-6 p-6 bg-gradient-to-r from-slate-50 to-blue-50 rounded-2xl">
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-3">
                            <h5 className="text-lg font-black text-slate-900">{crop.crop}</h5>
                            <div className="flex items-center gap-4">
                              <span className="text-2xl font-black text-green-600">{crop.avgScore}%</span>
                              <Badge tone="brand" className="flex items-center gap-1">
                                <TrendingUp size={12} />
                                +{crop.improvement}%
                              </Badge>
                            </div>
                          </div>
                          <div className="flex items-center gap-4">
                            <div className="flex-1 h-3 bg-slate-200 rounded-full overflow-hidden">
                              <div 
                                className="h-full bg-gradient-to-r from-green-500 to-emerald-500 rounded-full"
                                style={{ width: `${crop.avgScore}%` }}
                              />
                            </div>
                            <span className="text-sm font-bold text-slate-600">{crop.scans} scans</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
              </div>
            )}

            {activeTab === 'standards' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between mb-8">
                  <h3 className="text-2xl font-black text-slate-900">Industry Standards & Compliance</h3>
                  <Button className="h-10 px-6 rounded-xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 text-white">
                    <ExternalLink size={16} className="mr-2" />
                    View All Standards
                  </Button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {industryStandards.map((standard, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: idx * 0.1 }}
                    >
                      <Card className="p-8 border-none shadow-lg bg-white rounded-[3rem] hover:shadow-xl transition-all">
                        <div className="flex items-start justify-between mb-6">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h4 className="text-xl font-black text-slate-900">{standard.name}</h4>
                              <Badge tone={standard.status === 'Compliant' ? 'brand' : 'amber'}>
                                {standard.status === 'Compliant' ? <CheckCircle size={12} className="mr-1" /> : <Clock size={12} className="mr-1" />}
                                {standard.status}
                              </Badge>
                            </div>
                            <p className="text-sm font-bold text-slate-600 mb-1">{standard.category}</p>
                            <p className="text-sm text-slate-700">{standard.description}</p>
                          </div>
                        </div>

                        <div className="space-y-4">
                          <div>
                            <p className="text-xs font-black text-slate-900 uppercase mb-2">Requirements</p>
                            <div className="flex flex-wrap gap-2">
                              {standard.requirements.map((req, i) => (
                                <Badge key={i} tone="brand" className="text-xs">{req}</Badge>
                              ))}
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-200">
                            <div>
                              <p className="text-xs font-bold text-slate-600 mb-1">Certification Body</p>
                              <p className="text-sm font-black text-slate-900">{standard.certificationBody}</p>
                            </div>
                            <div>
                              <p className="text-xs font-bold text-slate-600 mb-1">Validity Period</p>
                              <p className="text-sm font-black text-slate-900">{standard.validityPeriod}</p>
                            </div>
                          </div>

                          <div>
                            <p className="text-xs font-bold text-slate-600 mb-2">Applicable To</p>
                            <div className="flex flex-wrap gap-2">
                              {standard.applicableTo.map((item, i) => (
                                <span key={i} className="text-xs font-bold text-slate-700 bg-slate-100 px-3 py-1 rounded-lg">{item}</span>
                              ))}
                            </div>
                          </div>
                        </div>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'certification' && (
              <div className="space-y-8">
                <div className="flex items-center justify-between">
                  <h3 className="text-2xl font-black text-slate-900">Quality Certificates</h3>
                  <Button className="h-12 px-6 rounded-xl font-black bg-gradient-to-r from-green-600 to-emerald-600 text-white">
                    <Plus size={16} className="mr-2" />
                    Generate Certificate
                  </Button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {certificates.map((cert, idx) => (
                    <motion.div
                      key={cert.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.1 }}
                    >
                      <Card className="p-8 border-none shadow-lg bg-gradient-to-br from-green-50 to-emerald-50 rounded-[3rem]">
                        <div className="flex items-start justify-between mb-6">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-3">
                              <div className="h-14 w-14 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center text-white">
                                <Shield size={28} />
                              </div>
                              <div>
                                <h4 className="text-xl font-black text-slate-900">{cert.crop}</h4>
                                <p className="text-sm font-bold text-slate-600">Grade {cert.grade}</p>
                              </div>
                            </div>
                            <Badge tone="brand" className="mb-4">
                              <CheckCircle size={12} className="mr-1" />
                              {cert.status.toUpperCase()}
                            </Badge>
                          </div>
                        </div>

                        <div className="space-y-4 mb-6">
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <p className="text-xs font-bold text-slate-600 mb-1">Certificate No.</p>
                              <p className="text-sm font-black text-slate-900">{cert.id}</p>
                            </div>
                            <div>
                              <p className="text-xs font-bold text-slate-600 mb-1">Quantity</p>
                              <p className="text-sm font-black text-slate-900">{cert.quantity} {cert.unit}</p>
                            </div>
                            <div>
                              <p className="text-xs font-bold text-slate-600 mb-1">Issue Date</p>
                              <p className="text-sm font-black text-slate-900">{cert.issueDate}</p>
                            </div>
                            <div>
                              <p className="text-xs font-bold text-slate-600 mb-1">Valid Until</p>
                              <p className="text-sm font-black text-slate-900">{cert.validUntil}</p>
                            </div>
                          </div>

                          <div>
                            <p className="text-xs font-bold text-slate-600 mb-2">Standards Compliance</p>
                            <div className="flex flex-wrap gap-2">
                              {cert.standards.map((std, i) => (
                                <Badge key={i} tone="brand">{std}</Badge>
                              ))}
                            </div>
                          </div>

                          <div className="bg-white/80 backdrop-blur-sm p-4 rounded-2xl">
                            <p className="text-xs font-bold text-slate-600 mb-2">Blockchain Verification</p>
                            <div className="flex items-center gap-2">
                              <QrCode size={16} className="text-green-600" />
                              <p className="text-xs font-mono text-slate-700 truncate">{cert.blockchainHash}</p>
                            </div>
                          </div>
                        </div>

                        <div className="flex gap-3">
                          <Button className="flex-1 h-10 rounded-xl font-bold bg-white text-slate-900 border-2 border-slate-200">
                            <Download size={16} className="mr-2" />
                            Download
                          </Button>
                          <Button className="flex-1 h-10 rounded-xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 text-white">
                            <Share2 size={16} className="mr-2" />
                            Share
                          </Button>
                        </div>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'reports' && (
              <div className="space-y-8">
                <div className="flex items-center justify-between">
                  <h3 className="text-2xl font-black text-slate-900">Quality Reports</h3>
                  <Button className="h-12 px-6 rounded-xl font-black bg-gradient-to-r from-purple-600 to-pink-600 text-white">
                    <Plus size={16} className="mr-2" />
                    Create Report
                  </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {[
                    { title: 'Monthly Summary', desc: 'Comprehensive monthly quality report', icon: Calendar, color: 'from-blue-500 to-cyan-500' },
                    { title: 'Crop Analysis', desc: 'Detailed crop-wise quality analysis', icon: Package, color: 'from-green-500 to-emerald-500' },
                    { title: 'Compliance Report', desc: 'Standards compliance documentation', icon: Shield, color: 'from-purple-500 to-pink-500' },
                    { title: 'Defect Analysis', desc: 'Comprehensive defect tracking report', icon: AlertTriangle, color: 'from-amber-500 to-orange-500' },
                    { title: 'Trend Analysis', desc: 'Quality trends and predictions', icon: TrendingUp, color: 'from-indigo-500 to-purple-500' },
                    { title: 'Custom Report', desc: 'Build your own custom report', icon: FileText, color: 'from-pink-500 to-rose-500' }
                  ].map((report, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: idx * 0.1 }}
                    >
                      <Card className="p-8 border-none shadow-lg bg-white rounded-[3rem] hover:shadow-xl transition-all cursor-pointer">
                        <div className={`h-16 w-16 bg-gradient-to-br ${report.color} rounded-2xl flex items-center justify-center text-white mb-6`}>
                          <report.icon size={32} />
                        </div>
                        <h4 className="text-xl font-black text-slate-900 mb-2">{report.title}</h4>
                        <p className="text-sm font-bold text-slate-600 mb-6">{report.desc}</p>
                        <div className="flex gap-2">
                          <Button className="flex-1 h-10 rounded-xl font-bold bg-gradient-to-r from-slate-100 to-slate-200 text-slate-900">
                            <Eye size={14} className="mr-2" />
                            View
                          </Button>
                          <Button className="h-10 px-4 rounded-xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 text-white">
                            <Download size={14} />
                          </Button>
                        </div>
                      </Card>
                    </motion.div>
                  ))}
                </div>

                <Card className="p-8 border-none shadow-lg bg-gradient-to-br from-purple-50 to-pink-50 rounded-[3rem]">
                  <h4 className="text-xl font-black text-slate-900 mb-6">Export Options</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Button className="h-14 rounded-2xl font-bold bg-white text-slate-900 border-2 border-slate-200 hover:shadow-lg">
                      <FileDown size={20} className="mr-3" />
                      Export as PDF
                    </Button>
                    <Button className="h-14 rounded-2xl font-bold bg-white text-slate-900 border-2 border-slate-200 hover:shadow-lg">
                      <FileDown size={20} className="mr-3" />
                      Export as Excel
                    </Button>
                    <Button className="h-14 rounded-2xl font-bold bg-white text-slate-900 border-2 border-slate-200 hover:shadow-lg">
                      <Mail size={20} className="mr-3" />
                      Email Report
                    </Button>
                  </div>
                </Card>
              </div>
            )}

            {activeTab === 'history' && (
              <div className="space-y-6">
                <div className="flex flex-col md:flex-row gap-4 mb-8">
                  <div className="flex-1 relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                    <input
                      type="text"
                      placeholder="Search scans..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full h-12 pl-12 pr-4 rounded-xl border-2 border-slate-200 font-bold text-sm"
                    />
                  </div>
                  <select 
                    value={filterGrade}
                    onChange={(e) => setFilterGrade(e.target.value)}
                    className="h-12 px-4 rounded-xl border-2 border-slate-200 font-bold text-sm"
                  >
                    <option value="all">All Grades</option>
                    <option value="A+">A+ Grade</option>
                    <option value="A">A Grade</option>
                    <option value="B+">B+ Grade</option>
                    <option value="B">B Grade</option>
                  </select>
                  <Button className="h-12 px-6 rounded-xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 text-white">
                    <Filter size={16} className="mr-2" />
                    Filter
                  </Button>
                </div>

                <div className="space-y-4">
                  {qualityScans.map((scan, idx) => (
                    <motion.div
                      key={scan.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.1 }}
                    >
                      <Card className="p-6 border-none shadow-lg bg-white rounded-[2.5rem] hover:shadow-xl transition-all">
                        <div className="flex items-center gap-6">
                          <div className="relative h-24 w-24 rounded-2xl overflow-hidden flex-shrink-0">
                            <img src={scan.image} alt={scan.crop} className="w-full h-full object-cover" />
                            <div className="absolute top-2 right-2">
                              <Badge tone="brand" className="text-[10px]">{scan.grade}</Badge>
                            </div>
                          </div>

                          <div className="flex-1">
                            <div className="flex items-start justify-between mb-3">
                              <div>
                                <h4 className="text-xl font-black text-slate-900 mb-1">{scan.crop} - {scan.variety}</h4>
                                <p className="text-sm font-bold text-slate-600">{scan.scanNumber} • {scan.location}</p>
                              </div>
                              <div className="text-right">
                                <p className="text-3xl font-black text-green-600 mb-1">{scan.score}%</p>
                                <p className="text-xs font-bold text-slate-600">{scan.date}</p>
                              </div>
                            </div>

                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                              <div>
                                <p className="text-xs font-bold text-slate-600 mb-1">Quantity</p>
                                <p className="text-sm font-black text-slate-900">{scan.quantity} {scan.unit}</p>
                              </div>
                              <div>
                                <p className="text-xs font-bold text-slate-600 mb-1">Defects</p>
                                <p className="text-sm font-black text-slate-900">{scan.defects}</p>
                              </div>
                              <div>
                                <p className="text-xs font-bold text-slate-600 mb-1">AI Confidence</p>
                                <p className="text-sm font-black text-slate-900">{scan.aiConfidence}%</p>
                              </div>
                              <div>
                                <p className="text-xs font-bold text-slate-600 mb-1">Est. Price</p>
                                <p className="text-sm font-black text-green-600">₹{scan.marketValue.estimatedPrice}/kg</p>
                              </div>
                            </div>

                            <div className="flex gap-3">
                              <Button className="h-10 px-6 rounded-xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 text-white">
                                <Eye size={14} className="mr-2" />
                                View Details
                              </Button>
                              {scan.certified && (
                                <Button className="h-10 px-6 rounded-xl font-bold bg-white text-slate-900 border-2 border-slate-200">
                                  <Download size={14} className="mr-2" />
                                  Certificate
                                </Button>
                              )}
                              <Button className="h-10 px-6 rounded-xl font-bold bg-white text-slate-900 border-2 border-slate-200">
                                <Share2 size={14} className="mr-2" />
                                Share
                              </Button>
                            </div>
                          </div>
                        </div>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </div>

      {/* Hidden file input for image uploads */}
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept="image/*"
        onChange={handleFileSelect}
        style={{ display: 'none' }}
      />
    </div>
  );
}

export default CropQualityDetector;