import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import * as mqtt from 'mqtt';

@Injectable()
export class IoTIntegrationService {
  private prisma: PrismaClient;
  private mqttClient: mqtt.MqttClient;
  private sensorData: Map<string, any> = new Map();

  constructor() {
    this.prisma = new PrismaClient();
    this.initializeMQTT();
  }

  private initializeMQTT() {
    const brokerUrl = process.env.MQTT_BROKER_URL || 'mqtt://localhost:1883';
    this.mqttClient = mqtt.connect(brokerUrl);

    this.mqttClient.on('connect', () => {
      console.log('Connected to MQTT broker');
      this.mqttClient.subscribe('farm/+/sensors/#');
    });

    this.mqttClient.on('message', (topic, message) => {
      this.handleSensorData(topic, message);
    });
  }

  async registerDevice(data: {
    deviceId: string;
    farmerId: string;
    deviceType: 'SOIL_SENSOR' | 'WEATHER_STATION' | 'CAMERA' | 'PUMP';
    location: { lat: number; lng: number };
    calibration?: Record<string, number>;
  }) {
    const device = await this.prisma.iotDevice.create({
      data: {
        deviceId: data.deviceId,
        farmerId: data.farmerId,
        deviceType: data.deviceType,
        location: data.location,
        calibration: data.calibration,
        status: 'ACTIVE',
      },
    });

    return device;
  }

  async ingestSensorData(data: {
    deviceId: string;
    sensorType: string;
    value: number;
    unit: string;
    timestamp: Date;
  }) {
    const sensorReading = await this.prisma.sensorReading.create({
      data: {
        deviceId: data.deviceId,
        sensorType: data.sensorType,
        value: data.value,
        unit: data.unit,
        timestamp: data.timestamp,
      },
    });

    this.sensorData.set(`${data.deviceId}_${data.sensorType}`, data.value);

    // Check for alerts
    await this.checkAlerts(data);

    return sensorReading;
  }

  async getLatestSensorReadings(deviceId: string) {
    const readings = await this.prisma.sensorReading.findMany({
      where: { deviceId },
      orderBy: { timestamp: 'desc' },
      take: 10,
    });

    return readings.map((r) => ({
      sensorType: r.sensorType,
      value: r.value,
      unit: r.unit,
      timestamp: r.timestamp,
    }));
  }

  async getIoTDashboard(farmerId: string) {
    const devices = await this.prisma.iotDevice.findMany({
      where: { farmerId },
    });

    const dashboardData = await Promise.all(
      devices.map(async (device) => {
        const latestReadings = await this.getLatestSensorReadings(device.deviceId);
        return {
          deviceId: device.deviceId,
          deviceType: device.deviceType,
          location: device.location,
          status: device.status,
          latestReadings,
          health: this.calculateDeviceHealth(latestReadings),
        };
      })
    );

    return {
      farmerId,
      devices: dashboardData,
      alerts: await this.getActiveAlerts(farmerId),
      recommendations: this.generateRecommendations(dashboardData),
    };
  }

  async predictiveMaintenance(deviceId: string) {
    const readings = await this.prisma.sensorReading.findMany({
      where: { deviceId },
      orderBy: { timestamp: 'desc' },
      take: 100,
    });

    const anomalies = this.detectAnomalies(readings);

    return {
      deviceId,
      maintenanceRequired: anomalies.length > 5,
      anomalies,
      estimatedFailureTime: anomalies.length > 5 ? '7 days' : 'No issues',
      recommendations: this.getMaintenanceRecommendations(anomalies),
    };
  }

  private async handleSensorData(topic: string, message: Buffer) {
    try {
      const data = JSON.parse(message.toString());
      await this.ingestSensorData({
        deviceId: data.deviceId,
        sensorType: data.type,
        value: data.value,
        unit: data.unit,
        timestamp: new Date(),
      });
    } catch (error) {
      console.error('Error handling sensor data:', error);
    }
  }

  private async checkAlerts(data: any) {
    const thresholds: Record<string, { min: number; max: number }> = {
      temperature: { min: 5, max: 40 },
      humidity: { min: 20, max: 90 },
      soilMoisture: { min: 20, max: 80 },
      ph: { min: 6, max: 8 },
    };

    const threshold = thresholds[data.sensorType];
    if (threshold && (data.value < threshold.min || data.value > threshold.max)) {
      await this.prisma.iotAlert.create({
        data: {
          deviceId: data.deviceId,
          sensorType: data.sensorType,
          value: data.value,
          severity: 'HIGH',
          message: `${data.sensorType} out of range: ${data.value}${data.unit}`,
        },
      });
    }
  }

  private calculateDeviceHealth(readings: any[]): string {
    if (readings.length === 0) return 'UNKNOWN';
    const recentReadings = readings.slice(0, 5);
    const variance = this.calculateVariance(recentReadings.map((r) => r.value));
    if (variance > 50) return 'DEGRADED';
    return 'HEALTHY';
  }

  private calculateVariance(values: number[]): number {
    const mean = values.reduce((a, b) => a + b, 0) / values.length;
    const variance =
      values.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) /
      values.length;
    return Math.sqrt(variance);
  }

  private detectAnomalies(readings: any[]): any[] {
    const anomalies = [];
    const values = readings.map((r) => r.value);
    const mean = values.reduce((a, b) => a + b, 0) / values.length;
    const stdDev = Math.sqrt(
      values.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) /
        values.length
    );

    readings.forEach((reading) => {
      if (Math.abs(reading.value - mean) > 3 * stdDev) {
        anomalies.push(reading);
      }
    });

    return anomalies;
  }

  private async getActiveAlerts(farmerId: string) {
    const devices = await this.prisma.iotDevice.findMany({
      where: { farmerId },
    });

    const alerts = await this.prisma.iotAlert.findMany({
      where: {
        deviceId: { in: devices.map((d) => d.deviceId) },
        resolved: false,
      },
      orderBy: { createdAt: 'desc' },
      take: 10,
    });

    return alerts;
  }

  private generateRecommendations(dashboardData: any[]): string[] {
    const recommendations = [];

    dashboardData.forEach((device) => {
      if (device.health === 'DEGRADED') {
        recommendations.push(`Device ${device.deviceId} needs maintenance`);
      }
    });

    return recommendations;
  }

  private getMaintenanceRecommendations(anomalies: any[]): string[] {
    return [
      'Check sensor calibration',
      'Clean sensor lens',
      'Verify power supply',
      'Check network connectivity',
    ];
  }
}
