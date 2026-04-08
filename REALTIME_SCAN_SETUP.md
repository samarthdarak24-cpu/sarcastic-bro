# Real-Time Crop Scanner - Setup Guide

## Quick Start

### 1. Access the Real-Time Scanner

Navigate to: `http://localhost:3000/realtime-scanner`

### 2. Component Integration

The real-time scanner is available in two ways:

#### Option A: Standalone Page
```
/realtime-scanner - Full-page real-time scanning interface
```

#### Option B: Dashboard Component
```
Import in your dashboard:
import { RealtimeCropScanner } from '@/components/dashboard/farmer/RealtimeCropScanner';
```

### 3. Features

#### Live Video Streaming
- 30 FPS real-time video capture
- GPU-accelerated frame processing
- Sub-100ms latency

#### Advanced AI Detection
- **YOLOv8**: Object detection and localization
- **EfficientNet**: Feature extraction
- **Custom CNN**: Defect detection
- **Vision Transformer**: Fine-grained analysis

#### Real-Time Metrics
- Grade (A+, A, B+, B)
- Quality Score (0-100%)
- Confidence Level
- Defect Detection
- Performance Stats (FPS, CPU, Memory, Latency)

#### Quality Analysis
- Color Uniformity
- Texture Score
- Shape Regularity
- Size Consistency
- Moisture Level

#### Session Management
- Start/Stop scanning
- Pause/Resume functionality
- Download detection reports
- View detection history

### 4. API Integration

#### Initialize Session
```typescript
const sessionId = await realtimeScanService.initializeSession(userId);
```

#### Process Frames
```typescript
const detection = await realtimeScanService.processFrame(imageBuffer);
```

#### Get Statistics
```typescript
const stats = await realtimeScanService.getStats();
```

#### End Session
```typescript
const result = await realtimeScanService.endSession();
```

### 5. Using the Hook

```typescript
import { useRealtimeScan } from '@/hooks/useRealtimeScan';

function MyComponent() {
  const {
    isConnected,
    isScanning,
    currentDetection,
    detections,
    stats,
    startScan,
    endScan,
    pauseScan,
    resumeScan
  } = useRealtimeScan(userId);

  return (
    <div>
      {isConnected && <p>Connected</p>}
      {isScanning && <p>Scanning...</p>}
      {currentDetection && <p>Grade: {currentDetection.grade}</p>}
    </div>
  );
}
```

### 6. WebSocket Events

Listen for real-time events:

```typescript
// Detection result
realtimeScanService.onDetection((data) => {
  console.log('Detection:', data.detection);
});

// Scan paused
realtimeScanService.onPaused((data) => {
  console.log('Scan paused');
});

// Scan resumed
realtimeScanService.onResumed((data) => {
  console.log('Scan resumed');
});

// Scan ended
realtimeScanService.onEnded((data) => {
  console.log('Scan ended:', data.result);
});
```

### 7. Performance Optimization

#### Frontend
- Frame rate: 30 FPS
- Processing latency: 50-100ms
- Memory usage: 100-200MB
- CPU usage: 20-40%

#### Backend
- Throughput: 30+ frames/second
- Model inference: 50-100ms
- Database write: <10ms
- WebSocket latency: <50ms

### 8. Browser Requirements

- Chrome/Chromium 90+
- Firefox 88+
- Safari 14+
- Edge 90+

### 9. Network Requirements

- Minimum: 2 Mbps upload
- Recommended: 5+ Mbps
- Latency: <100ms

### 10. Troubleshooting

#### Camera Not Accessible
```
Error: Failed to access camera
Solution: Check browser permissions and HTTPS requirement
```

#### Connection Failed
```
Error: Not connected to server
Solution: Ensure backend is running on port 3001
```

#### Low FPS
```
Issue: FPS dropping below 20
Solution: Reduce video resolution or close other applications
```

#### High Latency
```
Issue: Processing time > 200ms
Solution: Check network connection and server load
```

### 11. Database Schema

The system automatically creates these tables:

```sql
-- Scan Sessions
CREATE TABLE ScanSession (
  sessionId VARCHAR PRIMARY KEY,
  userId VARCHAR NOT NULL,
  startTime DATETIME NOT NULL,
  endTime DATETIME,
  status VARCHAR(20),
  metadata JSON
);

-- Detections
CREATE TABLE Detection (
  detectionId VARCHAR PRIMARY KEY,
  sessionId VARCHAR NOT NULL,
  grade VARCHAR(5),
  score INT,
  confidence INT,
  defects JSON,
  metrics JSON,
  timestamp DATETIME,
  FOREIGN KEY (sessionId) REFERENCES ScanSession(sessionId)
);
```

### 12. Environment Variables

Add to `.env.local`:

```
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_SOCKET_URL=http://localhost:3001
```

### 13. Advanced Configuration

#### Model Selection
```typescript
// Use different model variants
const modelConfig = {
  yolo: 'yolov8n', // nano, small, medium, large, xlarge
  efficientnet: 'b0', // b0-b7
  cnn: 'custom-v1'
};
```

#### Processing Parameters
```typescript
const processingConfig = {
  frameRate: 30,
  resolution: { width: 1920, height: 1080 },
  inferenceTimeout: 100,
  batchSize: 1
};
```

### 14. Monitoring & Analytics

Track performance metrics:

```typescript
const metrics = {
  fps: stats.fps,
  cpuUsage: stats.cpuUsage,
  memoryUsage: stats.memoryUsage,
  latency: stats.processingTime,
  detectionRate: stats.detectionRate
};
```

### 15. Export & Reporting

Download scan reports:

```typescript
// Automatic report generation
const report = {
  timestamp: new Date().toISOString(),
  totalDetections: detections.length,
  averageScore: calculateAverage(detections),
  detections: detections.slice(-20),
  stats: stats
};
```

## Support

For issues or questions:
1. Check the troubleshooting section
2. Review the advanced tech documentation
3. Check browser console for errors
4. Verify network connectivity

## Next Steps

1. Integrate with your dashboard
2. Customize quality thresholds
3. Set up notifications for low-quality detections
4. Configure automated reporting
5. Implement blockchain integration for immutable records
