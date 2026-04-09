# Optional Features Implementation Guide

## Overview
This guide covers the implementation of 5 major optional features for the ODOP Connect agricultural marketplace platform.

## Features Implemented

### 1. Blockchain Tracing (6.11)
**Status**: ✅ Complete

#### Architecture
- **Technology**: Ethereum + Hyperledger Fabric
- **Smart Contracts**: 3 contracts for supply chain tracking
- **Integration**: Web3.js for blockchain interaction

#### Components
- `BlockchainTraceViewer.tsx` - Frontend component for viewing supply chain history
- `blockchain-trace.service.ts` - Backend service for blockchain operations

#### Key Features
- Immutable transaction records
- Supply chain event logging (harvest → storage → transport → delivery)
- Cryptographic verification of product authenticity
- Real-time blockchain verification UI
- Integration with existing order tracking

#### API Endpoints
```
GET /api/blockchain/trace/:productId - Get supply chain history
POST /api/blockchain/trace - Create new trace record
GET /api/blockchain/verify/:productId - Verify product authenticity
```

#### Usage
```typescript
// Frontend
<BlockchainTraceViewer productId="product_123" />

// Backend
const trace = await blockchainService.getSupplyChainHistory(productId);
const verification = await blockchainService.verifyProductAuthenticity(productId);
```

---

### 2. Advanced Analytics (6.12)
**Status**: ✅ Complete

#### Architecture
- **Technology**: TensorFlow, scikit-learn, pandas
- **ML Models**: 2 models (disease prediction, yield forecasting)
- **Data Processing**: Real-time analytics engine

#### Components
- `AdvancedAnalyticsDashboard.tsx` - Frontend dashboard
- `advanced-analytics.service.ts` - Backend analytics service

#### Key Features
- Disease prediction using crop images + weather data
- Yield forecasting with historical trends
- Advanced reporting dashboard with drill-down
- Market trend analysis
- Farmer performance benchmarking

#### API Endpoints
```
POST /api/analytics/predict-disease - Predict crop diseases
POST /api/analytics/forecast-yield - Forecast crop yield
GET /api/analytics/dashboard/:farmerId - Get analytics dashboard
GET /api/analytics/report/:farmerId - Generate detailed report
```

#### Usage
```typescript
// Disease Prediction
const prediction = await analyticsService.predictDisease({
  cropType: 'wheat',
  weatherData: { temperature: 25, humidity: 60, rainfall: 50 },
  soilData: { ph: 7, nitrogen: 100, phosphorus: 50 }
});

// Yield Forecasting
const forecast = await analyticsService.forecastYield({
  farmerId: 'farmer_123',
  cropType: 'wheat',
  areaInHectares: 5,
  historicalYields: [50, 52, 55],
  weatherForecast: {...},
  soilQuality: 0.8
});
```

---

### 3. Video Calling (6.13)
**Status**: ✅ Complete

#### Architecture
- **Technology**: WebRTC + Janus Gateway
- **Signaling**: Socket.IO for WebRTC signaling
- **TURN Servers**: Google STUN + custom TURN

#### Components
- `VideoCallComponent.tsx` - Full-featured video call UI
- `video-calling.service.ts` - Backend call management

#### Key Features
- Peer-to-peer video calls
- Screen sharing for product demonstrations
- Call recording and playback
- Call history with metrics
- Audio-only fallback for low bandwidth
- Real-time call quality monitoring

#### API Endpoints
```
POST /api/video-calls/initiate - Start a video call
POST /api/video-calls/:callId/accept - Accept incoming call
POST /api/video-calls/:callId/end - End call
GET /api/video-calls/history/:userId - Get call history
POST /api/video-calls/:callId/record - Record call
```

#### Usage
```typescript
// Initiate Call
const call = await videoService.initiateVideoCall({
  initiatorId: 'user_123',
  recipientId: 'user_456',
  type: 'PRODUCT_DEMO'
});

// Frontend
<VideoCallComponent 
  callId={call.callId}
  recipientId={call.recipientId}
  onEndCall={handleEndCall}
/>
```

---

### 4. IoT Integration (6.14)
**Status**: ✅ Complete

#### Architecture
- **Technology**: MQTT + AWS IoT Core
- **Sensors**: Soil moisture, temperature, humidity, cameras
- **Data Pipeline**: Real-time ingestion and processing

#### Components
- `IoTDashboard.tsx` - Real-time sensor monitoring UI
- `iot-integration.service.ts` - Backend IoT service

#### Key Features
- Real-time sensor data ingestion
- Device management and provisioning
- Predictive maintenance alerts
- Live sensor visualization
- Anomaly detection
- Integration with advanced analytics

#### API Endpoints
```
POST /api/iot/devices/register - Register new IoT device
POST /api/iot/sensors/ingest - Ingest sensor data
GET /api/iot/dashboard/:farmerId - Get IoT dashboard
GET /api/iot/devices/:deviceId/readings - Get sensor readings
POST /api/iot/devices/:deviceId/maintenance - Predictive maintenance
```

#### Usage
```typescript
// Register Device
const device = await iotService.registerDevice({
  deviceId: 'sensor_001',
  farmerId: 'farmer_123',
  deviceType: 'SOIL_SENSOR',
  location: { lat: 19.0760, lng: 72.8777 }
});

// Ingest Data
await iotService.ingestSensorData({
  deviceId: 'sensor_001',
  sensorType: 'temperature',
  value: 28.5,
  unit: '°C',
  timestamp: new Date()
});

// Get Dashboard
const dashboard = await iotService.getIoTDashboard(farmerId);
```

---

### 5. Government Subsidy Integration (6.15)
**Status**: ✅ Complete

#### Architecture
- **Technology**: REST APIs + eKYC integration
- **Schemes**: PM-KISAN, Crop Insurance, Soil Health, Irrigation
- **Document Processing**: Automated validation

#### Components
- `SubsidyChecker.tsx` - Eligibility checker UI
- `subsidy-integration.service.ts` - Backend subsidy service

#### Key Features
- PM-KISAN scheme integration (₹6000/year)
- Crop insurance eligibility checker
- Soil health card program
- Subsidy application workflow
- Real-time eligibility tracking
- Automated amount calculation
- eKYC and Aadhaar integration

#### Supported Schemes
1. **PM-KISAN**: ₹6000/year direct benefit
2. **Crop Insurance**: Variable coverage
3. **Soil Health Card**: Free soil testing
4. **Drip Irrigation**: ₹50,000 subsidy

#### API Endpoints
```
POST /api/subsidy/check-eligibility - Check eligibility
GET /api/subsidy/programs/:state - Get available programs
POST /api/subsidy/apply - Apply for subsidy
GET /api/subsidy/status/:applicationId - Check application status
GET /api/subsidy/disbursement/:farmerId - Track disbursement
```

#### Usage
```typescript
// Check Eligibility
const eligibility = await subsidyService.checkSubsidyEligibility({
  farmerId: 'farmer_123',
  cropType: 'wheat',
  landHolding: 2.5,
  income: 300000,
  state: 'Maharashtra'
});

// Apply for Subsidy
const application = await subsidyService.applyForSubsidy({
  farmerId: 'farmer_123',
  schemeId: 'pm-kisan',
  documents: ['aadhar.pdf', 'land_certificate.pdf'],
  bankDetails: {
    accountNumber: '1234567890',
    ifscCode: 'SBIN0001234',
    accountHolder: 'Farmer Name'
  }
});
```

---

## Frontend Integration

### Installation
```bash
cd apps/web
npm install
```

### Access Features
Navigate to: `http://localhost:3000/optional-features`

### Components Location
```
apps/web/src/components/optional-features/
├── BlockchainTraceViewer.tsx
├── AdvancedAnalyticsDashboard.tsx
├── VideoCallComponent.tsx
├── IoTDashboard.tsx
└── SubsidyChecker.tsx
```

### Page Location
```
apps/web/src/app/optional-features/page.tsx
```

---

## Backend Integration

### Services Location
```
apps/api/src/modules/
├── blockchain-trace/
│   └── blockchain-trace.service.ts
├── advanced-analytics/
│   └── advanced-analytics.service.ts
├── video-calling/
│   └── video-calling.service.ts
├── iot-integration/
│   └── iot-integration.service.ts
└── subsidy-integration/
    └── subsidy-integration.service.ts
```

### Installation
```bash
cd apps/api
npm install
```

### Environment Variables
```env
# Blockchain
ETHEREUM_RPC_URL=http://localhost:8545

# IoT
MQTT_BROKER_URL=mqtt://localhost:1883

# Video Calling
SIGNALING_SERVER=ws://localhost:3001

# Subsidy
SUBSIDY_API_KEY=your_api_key
```

---

## Running the Features

### Start All Services
```bash
npm run dev
```

### Start Individual Services
```bash
# Frontend
npm run dev:web

# Backend
npm run dev:api

# AI Service
npm run dev:ai
```

### Access Points
- **Frontend**: http://localhost:3000/optional-features
- **Backend API**: http://localhost:3001/api
- **WebSocket**: ws://localhost:3001

---

## Testing

### Test Blockchain Trace
```bash
curl -X GET http://localhost:3001/api/blockchain/trace/product_123
```

### Test Analytics
```bash
curl -X POST http://localhost:3001/api/analytics/predict-disease \
  -H "Content-Type: application/json" \
  -d '{
    "cropType": "wheat",
    "weatherData": {"temperature": 25, "humidity": 60, "rainfall": 50},
    "soilData": {"ph": 7, "nitrogen": 100, "phosphorus": 50}
  }'
```

### Test Video Call
```bash
curl -X POST http://localhost:3001/api/video-calls/initiate \
  -H "Content-Type: application/json" \
  -d '{
    "initiatorId": "user_123",
    "recipientId": "user_456",
    "type": "PRODUCT_DEMO"
  }'
```

### Test IoT
```bash
curl -X POST http://localhost:3001/api/iot/sensors/ingest \
  -H "Content-Type: application/json" \
  -d '{
    "deviceId": "sensor_001",
    "sensorType": "temperature",
    "value": 28.5,
    "unit": "°C"
  }'
```

### Test Subsidy
```bash
curl -X POST http://localhost:3001/api/subsidy/check-eligibility \
  -H "Content-Type: application/json" \
  -d '{
    "farmerId": "farmer_123",
    "cropType": "wheat",
    "landHolding": 2.5,
    "income": 300000,
    "state": "Maharashtra"
  }'
```

---

## Database Models

### Blockchain Trace
```prisma
model BlockchainTrace {
  id String @id @default(cuid())
  productId String
  event String
  txHash String
  location Json
  metadata Json?
  createdAt DateTime @default(now())
}
```

### Video Call
```prisma
model VideoCall {
  id String @id @default(cuid())
  callId String @unique
  initiatorId String
  recipientId String
  type String
  status String
  duration Int?
  recordingUrl String?
  quality String?
  createdAt DateTime @default(now())
}
```

### IoT Device
```prisma
model IoTDevice {
  id String @id @default(cuid())
  deviceId String @unique
  farmerId String
  deviceType String
  location Json
  status String
  calibration Json?
  createdAt DateTime @default(now())
}
```

### Subsidy Application
```prisma
model SubsidyApplication {
  id String @id @default(cuid())
  farmerId String
  schemeId String
  status String
  documents String[]
  bankDetails Json
  disbursedAmount Float?
  submittedAt DateTime
  approvedAt DateTime?
  createdAt DateTime @default(now())
}
```

---

## Performance Metrics

### Expected Performance
- **Blockchain Verification**: < 2 seconds
- **Analytics Prediction**: < 5 seconds
- **Video Call Setup**: < 3 seconds
- **IoT Data Ingestion**: < 500ms
- **Subsidy Check**: < 1 second

### Scalability
- **Concurrent Users**: 10,000+
- **Transactions/sec**: 1,000+
- **Sensor Data Points/sec**: 10,000+

---

## Security Considerations

### Blockchain
- Smart contract audits required
- Private key management
- Transaction signing

### Video Calls
- End-to-end encryption
- DTLS-SRTP for media
- Token-based authentication

### IoT
- Device authentication
- Data encryption in transit
- Rate limiting

### Subsidy
- eKYC verification
- Document encryption
- Audit logging

---

## Future Enhancements

1. **NFT-based Product Certificates**
2. **AI-powered Crop Insurance Pricing**
3. **Drone-based Crop Monitoring**
4. **Blockchain-based Farmer Cooperatives**
5. **Advanced Weather Prediction Models**
6. **Real-time Commodity Exchange Integration**

---

## Support & Documentation

- **API Documentation**: `/api/docs`
- **Component Storybook**: `npm run storybook`
- **Test Coverage**: `npm run test:coverage`
- **Performance Profiling**: `npm run profile`

---

## Deployment

### Docker Deployment
```bash
docker-compose -f docker-compose.prod.yml up -d
```

### Kubernetes Deployment
```bash
kubectl apply -f k8s/optional-features/
```

### Environment Setup
```bash
# Copy environment template
cp .env.example .env

# Update with your values
nano .env

# Deploy
npm run deploy
```

---

## Troubleshooting

### Blockchain Connection Issues
```bash
# Check Ethereum node
curl http://localhost:8545

# Verify contract deployment
npm run verify:contracts
```

### IoT Connection Issues
```bash
# Check MQTT broker
mosquitto_sub -h localhost -t "farm/+/sensors/#"

# Verify device registration
curl http://localhost:3001/api/iot/devices
```

### Video Call Issues
```bash
# Check WebRTC connectivity
npm run test:webrtc

# Verify TURN server
npm run test:turn
```

---

## Version History

- **v1.0.0** - Initial implementation of all 5 optional features
- **v1.1.0** - Added advanced analytics models
- **v1.2.0** - Enhanced blockchain verification
- **v1.3.0** - IoT predictive maintenance
- **v1.4.0** - Subsidy automation

---

## License

ODOP Connect - Agricultural Marketplace Platform
© 2024 All Rights Reserved
