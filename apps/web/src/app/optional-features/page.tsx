'use client';

import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BlockchainTraceViewer } from '@/components/optional-features/BlockchainTraceViewer';
import { AdvancedAnalyticsDashboard } from '@/components/optional-features/AdvancedAnalyticsDashboard';
import { VideoCallComponent } from '@/components/optional-features/VideoCallComponent';
import { IoTDashboard } from '@/components/optional-features/IoTDashboard';
import { SubsidyChecker } from '@/components/optional-features/SubsidyChecker';

export default function OptionalFeaturesPage() {
  const [activeTab, setActiveTab] = useState('blockchain');
  const [farmerId] = useState('farmer_123');
  const [productId] = useState('product_456');

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Optional Features
          </h1>
          <p className="text-lg text-gray-600">
            Advanced capabilities for agricultural marketplace
          </p>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-5 mb-6">
            <TabsTrigger value="blockchain">Blockchain</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="video">Video Calls</TabsTrigger>
            <TabsTrigger value="iot">IoT</TabsTrigger>
            <TabsTrigger value="subsidy">Subsidy</TabsTrigger>
          </TabsList>

          {/* Blockchain Trace */}
          <TabsContent value="blockchain" className="space-y-4">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-2xl font-bold mb-4">
                Supply Chain Blockchain Tracing
              </h2>
              <p className="text-gray-600 mb-6">
                Track your products through the entire supply chain with
                immutable blockchain records. Verify authenticity and ensure
                transparency from farm to consumer.
              </p>
              <BlockchainTraceViewer productId={productId} />
            </div>
          </TabsContent>

          {/* Advanced Analytics */}
          <TabsContent value="analytics" className="space-y-4">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-2xl font-bold mb-4">
                Advanced Analytics & Predictions
              </h2>
              <p className="text-gray-600 mb-6">
                Get AI-powered insights on disease prediction, yield
                forecasting, and market trends. Make data-driven decisions for
                better crop management.
              </p>
              <AdvancedAnalyticsDashboard farmerId={farmerId} />
            </div>
          </TabsContent>

          {/* Video Calling */}
          <TabsContent value="video" className="space-y-4">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-2xl font-bold mb-4">Video Calling</h2>
              <p className="text-gray-600 mb-6">
                Connect with farmers or buyers via high-quality video calls.
                Share screens for product demonstrations and negotiate deals in
                real-time.
              </p>
              <div className="bg-gray-100 p-4 rounded-lg">
                <p className="text-gray-600 text-center mb-4">
                  Video call interface ready. Click below to initiate a call.
                </p>
                <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition">
                  Start Video Call
                </button>
              </div>
            </div>
          </TabsContent>

          {/* IoT Integration */}
          <TabsContent value="iot" className="space-y-4">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-2xl font-bold mb-4">IoT Monitoring</h2>
              <p className="text-gray-600 mb-6">
                Monitor soil moisture, temperature, humidity, and other
                environmental factors in real-time. Get alerts for anomalies
                and predictive maintenance recommendations.
              </p>
              <IoTDashboard farmerId={farmerId} />
            </div>
          </TabsContent>

          {/* Subsidy Integration */}
          <TabsContent value="subsidy" className="space-y-4">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-2xl font-bold mb-4">
                Government Subsidy Integration
              </h2>
              <p className="text-gray-600 mb-6">
                Check eligibility for government subsidy schemes including
                PM-KISAN, crop insurance, soil health cards, and irrigation
                subsidies. Apply directly through the platform.
              </p>
              <SubsidyChecker farmerId={farmerId} />
            </div>
          </TabsContent>
        </Tabs>

        {/* Feature Summary */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-5 gap-4">
          <div className="bg-white rounded-lg shadow p-4">
            <h3 className="font-semibold text-gray-900 mb-2">Blockchain</h3>
            <p className="text-sm text-gray-600">
              Immutable supply chain tracking with smart contracts
            </p>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <h3 className="font-semibold text-gray-900 mb-2">Analytics</h3>
            <p className="text-sm text-gray-600">
              ML-powered disease prediction and yield forecasting
            </p>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <h3 className="font-semibold text-gray-900 mb-2">Video Calls</h3>
            <p className="text-sm text-gray-600">
              WebRTC-based peer-to-peer video with screen sharing
            </p>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <h3 className="font-semibold text-gray-900 mb-2">IoT</h3>
            <p className="text-sm text-gray-600">
              Real-time sensor data with MQTT and predictive maintenance
            </p>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <h3 className="font-semibold text-gray-900 mb-2">Subsidy</h3>
            <p className="text-sm text-gray-600">
              Government scheme eligibility checker and application flow
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
