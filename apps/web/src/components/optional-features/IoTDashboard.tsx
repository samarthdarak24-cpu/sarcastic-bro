'use client';

import React, { useState, useEffect } from 'react';
import { Activity, AlertCircle, Zap, Droplets, Thermometer } from 'lucide-react';

interface SensorReading {
  sensorType: string;
  value: number;
  unit: string;
  timestamp: Date;
}

interface IoTDevice {
  deviceId: string;
  deviceType: string;
  location: { lat: number; lng: number };
  status: string;
  latestReadings: SensorReading[];
  health: string;
}

export const IoTDashboard: React.FC<{ farmerId: string }> = ({ farmerId }) => {
  const [devices, setDevices] = useState<IoTDevice[]>([]);
  const [alerts, setAlerts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchIoTData();
    const interval = setInterval(fetchIoTData, 30000); // Refresh every 30 seconds
    return () => clearInterval(interval);
  }, [farmerId]);

  const fetchIoTData = async () => {
    try {
      const response = await fetch(`/api/iot/dashboard/${farmerId}`);
      const data = await response.json();
      setDevices(data.devices || []);
      setAlerts(data.alerts || []);
    } catch (error) {
      console.error('Error fetching IoT data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getSensorIcon = (sensorType: string) => {
    switch (sensorType) {
      case 'temperature':
        return <Thermometer className="w-5 h-5" />;
      case 'humidity':
        return <Droplets className="w-5 h-5" />;
      case 'soilMoisture':
        return <Droplets className="w-5 h-5" />;
      default:
        return <Activity className="w-5 h-5" />;
    }
  };

  const getHealthColor = (health: string) => {
    switch (health) {
      case 'HEALTHY':
        return 'text-green-600 bg-green-50';
      case 'DEGRADED':
        return 'text-yellow-600 bg-yellow-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  if (loading) {
    return <div className="p-4">Loading IoT data...</div>;
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-2xl font-bold mb-6">IoT Monitoring Dashboard</h2>

      {/* Alerts Section */}
      {alerts.length > 0 && (
        <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-3">
            <AlertCircle className="w-5 h-5 text-red-600" />
            <h3 className="font-semibold text-red-900">Active Alerts</h3>
          </div>
          <div className="space-y-2">
            {alerts.slice(0, 5).map((alert, idx) => (
              <p key={idx} className="text-sm text-red-800">
                {alert.message}
              </p>
            ))}
          </div>
        </div>
      )}

      {/* Devices Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {devices.map((device) => (
          <div
            key={device.deviceId}
            className="border rounded-lg p-4 hover:shadow-md transition"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-900">
                {device.deviceType}
              </h3>
              <span
                className={`px-2 py-1 rounded-full text-xs font-medium ${getHealthColor(device.health)}`}
              >
                {device.health}
              </span>
            </div>

            <p className="text-xs text-gray-500 mb-3">
              ID: {device.deviceId}
            </p>

            {/* Sensor Readings */}
            <div className="space-y-2">
              {device.latestReadings.slice(0, 3).map((reading, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between bg-gray-50 p-2 rounded"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-gray-600">
                      {getSensorIcon(reading.sensorType)}
                    </span>
                    <span className="text-sm text-gray-700">
                      {reading.sensorType}
                    </span>
                  </div>
                  <span className="font-semibold text-gray-900">
                    {reading.value} {reading.unit}
                  </span>
                </div>
              ))}
            </div>

            <p className="text-xs text-gray-500 mt-3">
              Last updated:{' '}
              {device.latestReadings[0]
                ? new Date(device.latestReadings[0].timestamp).toLocaleTimeString()
                : 'N/A'}
            </p>
          </div>
        ))}
      </div>

      {devices.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          No IoT devices registered yet
        </div>
      )}
    </div>
  );
};
