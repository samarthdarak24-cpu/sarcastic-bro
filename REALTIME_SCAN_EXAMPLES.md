# Real-Time Crop Scanner - Usage Examples

## Example 1: Basic Real-Time Scanning

```typescript
import { RealtimeCropScanner } from '@/components/dashboard/farmer/RealtimeCropScanner';

export function FarmerDashboard() {
  return (
    <div className="w-full">
      <RealtimeCropScanner />
    </div>
  );
}
```

## Example 2: Using the Hook

```typescript
import { useRealtimeScan } from '@/hooks/useRealtimeScan';
import { useEffect } from 'react';

export function ScanningComponent() {
  const userId = 'farmer-123';
  const {
    isConnected,
    isScanning,
    currentDetection,
    stats,
    startScan,
    endScan
  } = useRealtimeScan(userId);

  useEffect(() => {
    if (isConnected) {
      console.log('Ready to scan');
    }
  }, [isConnected]);

  return (
    <div>
      <button onClick={startScan} disabled={isScanning}>
        {isScanning ? 'Scanning...' : 'Start Scan'}
      </button>

      {currentDetection && (
        <div>
          <p>Grade: {currentDetection.grade}</p>
          <p>Score: {currentDetection.score}%</p>
          <p>Confidence: {currentDetection.confidence}%</p>
        </div>
      )}

      {stats && (
        <div>
          <p>FPS: {stats.fps}</p>
          <p>Frames: {stats.totalFrames}</p>
          <p>Average Score: {stats.averageScore}%</p>
        </div>
      )}

      <button onClick={endScan} disabled={!isScanning}>
        End Scan
      </button>
    </div>
  );
}
```

## Example 3: Advanced Detection Handling

```typescript
import { useRealtimeScan } from '@/hooks/useRealtimeScan';
import { useEffect } from 'react';
import toast from 'react-hot-toast';

export function AdvancedScanComponent() {
  const userId = 'farmer-123';
  const {
    isScanning,
    currentDetection,
    detections,
    startScan,
    endScan,
    pauseScan,
    resumeScan
  } = useRealtimeScan(userId);

  // Alert on low quality
  useEffect(() => {
    if (currentDetection && currentDetection.score < 75) {
      toast.error(`Low quality detected: ${currentDetection.grade}`);
    }
  }, [currentDetection]);

  // Track defects
  useEffect(() => {
    if (currentDetection && currentDetection.defects.length > 0) {
      const defectSummary = currentDetection.defects
        .map(d => `${d.type} (${d.severity})`)
        .join(', ');
      console.log('Defects found:', defectSummary);
    }
  }, [currentDetection]);

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <button onClick={startScan} disabled={isScanning}>
          Start
        </button>
        <button onClick={pauseScan} disabled={!isScanning}>
          Pause
        </button>
        <button onClick={resumeScan} disabled={!isScanning}>
          Resume
        </button>
        <button onClick={endScan} disabled={!isScanning}>
          End
        </button>
      </div>

      {currentDetection && (
        <div className="bg-slate-100 p-4 rounded">
          <h3>Current Detection</h3>
          <p>Grade: {currentDetection.grade}</p>
          <p>Score: {currentDetection.score}%</p>
          <p>Confidence: {currentDetection.confidence}%</p>

          {currentDetection.defects.length > 0 && (
            <div>
              <h4>Defects:</h4>
              <ul>
                {currentDetection.defects.map((defect, idx) => (
                  <li key={idx}>
                    {defect.type} - {defect.severity} ({defect.count})
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div>
            <h4>Quality Metrics:</h4>
            <p>Color Uniformity: {currentDetection.metrics.colorUniformity}%</p>
            <p>Texture Score: {currentDetection.metrics.textureScore}%</p>
            <p>Shape Regularity: {currentDetection.metrics.shapeRegularity}%</p>
            <p>Size Consistency: {currentDetection.metrics.sizeConsistency}%</p>
            <p>Moisture Level: {currentDetection.metrics.moistureLevel}%</p>
          </div>
        </div>
      )}

      {detections.length > 0 && (
        <div>
          <h3>Detection History ({detections.length})</h3>
          <div className="grid grid-cols-5 gap-2">
            {detections.slice(-10).map((detection, idx) => (
              <div key={idx} className="bg-slate-200 p-2 rounded text-center">
                <p className="font-bold">{detection.grade}</p>
                <p className="text-sm">{detection.score}%</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
```

## Example 4: Real-Time Service Integration

```typescript
import { realtimeScanService } from '@/services/realtimeScanService';

async function startRealtimeScan(userId: string) {
  try {
    // Connect to server
    await realtimeScanService.connect();
    console.log('Connected');

    // Initialize session
    const sessionId = await realtimeScanService.initializeSession(userId);
    console.log('Session started:', sessionId);

    // Listen for detections
    realtimeScanService.onDetection((data) => {
      console.log('Detection:', data.detection);
      console.log('Grade:', data.detection.grade);
      console.log('Score:', data.detection.score);
    });

    // Listen for pause
    realtimeScanService.onPaused(() => {
      console.log('Scan paused');
    });

    // Listen for resume
    realtimeScanService.onResumed(() => {
      console.log('Scan resumed');
    });

    // Listen for end
    realtimeScanService.onEnded((data) => {
      console.log('Scan ended');
      console.log('Result:', data.result);
    });

    // Simulate frame processing
    for (let i = 0; i < 100; i++) {
      const imageBuffer = 'base64-encoded-image-data';
      await realtimeScanService.processFrame(imageBuffer);
      await new Promise(resolve => setTimeout(resolve, 33)); // ~30 FPS
    }

    // End session
    const result = await realtimeScanService.endSession();
    console.log('Final result:', result);

  } catch (error) {
    console.error('Error:', error);
  } finally {
    realtimeScanService.disconnect();
  }
}
```

## Example 5: Quality Threshold Alerts

```typescript
import { useRealtimeScan } from '@/hooks/useRealtimeScan';
import { useEffect } from 'react';
import toast from 'react-hot-toast';

const QUALITY_THRESHOLDS = {
  excellent: 90,
  good: 80,
  acceptable: 70,
  poor: 0
};

export function QualityAlertComponent() {
  const userId = 'farmer-123';
  const { currentDetection, startScan } = useRealtimeScan(userId);

  useEffect(() => {
    if (!currentDetection) return;

    const { score, defects } = currentDetection;

    // Check quality level
    if (score >= QUALITY_THRESHOLDS.excellent) {
      toast.success('Excellent quality!');
    } else if (score >= QUALITY_THRESHOLDS.good) {
      toast('Good quality', { icon: '👍' });
    } else if (score >= QUALITY_THRESHOLDS.acceptable) {
      toast('Acceptable quality', { icon: '⚠️' });
    } else {
      toast.error('Poor quality - Review required');
    }

    // Check for critical defects
    const criticalDefects = defects.filter(d => d.severity === 'high');
    if (criticalDefects.length > 0) {
      toast.error(`Critical defects found: ${criticalDefects.map(d => d.type).join(', ')}`);
    }

    // Check moisture level
    if (currentDetection.metrics.moistureLevel > 80) {
      toast.error('High moisture detected - Risk of spoilage');
    }

  }, [currentDetection]);

  return (
    <button onClick={startScan}>
      Start Quality Monitoring
    </button>
  );
}
```

## Example 6: Data Export

```typescript
import { useRealtimeScan } from '@/hooks/useRealtimeScan';

export function ExportScanDataComponent() {
  const userId = 'farmer-123';
  const { detections, stats } = useRealtimeScan(userId);

  const exportToJSON = () => {
    const data = {
      timestamp: new Date().toISOString(),
      totalDetections: detections.length,
      averageScore: Math.round(
        detections.reduce((sum, d) => sum + d.score, 0) / detections.length
      ),
      stats,
      detections: detections.slice(-50) // Last 50 detections
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: 'application/json'
    });

    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `crop-scan-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const exportToCSV = () => {
    const headers = ['Timestamp', 'Grade', 'Score', 'Confidence', 'Defects'];
    const rows = detections.map(d => [
      new Date(d.timestamp).toISOString(),
      d.grade,
      d.score,
      d.confidence,
      d.defects.map(df => df.type).join(';')
    ]);

    const csv = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `crop-scan-${Date.now()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex gap-2">
      <button onClick={exportToJSON}>Export JSON</button>
      <button onClick={exportToCSV}>Export CSV</button>
    </div>
  );
}
```

## Example 7: Performance Monitoring

```typescript
import { useRealtimeScan } from '@/hooks/useRealtimeScan';
import { useEffect, useState } from 'react';

export function PerformanceMonitorComponent() {
  const userId = 'farmer-123';
  const { stats } = useRealtimeScan(userId);
  const [performanceAlert, setPerformanceAlert] = useState<string | null>(null);

  useEffect(() => {
    if (!stats) return;

    // Check FPS
    if (stats.fps < 20) {
      setPerformanceAlert('Low FPS - Performance degraded');
    }
    // Check CPU
    else if (stats.cpuUsage > 80) {
      setPerformanceAlert('High CPU usage - Consider closing other apps');
    }
    // Check memory
    else if (stats.memoryUsage > 85) {
      setPerformanceAlert('High memory usage - Restart recommended');
    }
    // Check latency
    else if (stats.uptime > 3600000) { // 1 hour
      setPerformanceAlert('Long session - Consider restarting');
    }
    else {
      setPerformanceAlert(null);
    }
  }, [stats]);

  return (
    <div className="bg-slate-100 p-4 rounded">
      <h3>Performance Metrics</h3>
      {stats && (
        <div>
          <p>FPS: {stats.fps}</p>
          <p>Total Frames: {stats.totalFrames}</p>
          <p>Average Score: {stats.averageScore}%</p>
          <p>Uptime: {Math.round(stats.uptime / 1000)}s</p>
        </div>
      )}
      {performanceAlert && (
        <div className="mt-2 p-2 bg-yellow-100 text-yellow-800 rounded">
          {performanceAlert}
        </div>
      )}
    </div>
  );
}
```

## Example 8: Multi-Session Comparison

```typescript
import { realtimeScanService } from '@/services/realtimeScanService';

async function compareSessions(userId: string) {
  try {
    // Get scan history
    const history = await realtimeScanService.getUserScanHistory(userId, 10);

    // Calculate statistics
    const stats = {
      totalSessions: history.length,
      averageScore: Math.round(
        history.reduce((sum, session) => sum + (session.metadata?.averageScore || 0), 0) / history.length
      ),
      bestSession: history.reduce((best, session) => 
        (session.metadata?.averageScore || 0) > (best.metadata?.averageScore || 0) ? session : best
      ),
      worstSession: history.reduce((worst, session) => 
        (session.metadata?.averageScore || 0) < (worst.metadata?.averageScore || 0) ? session : worst
      )
    };

    console.log('Session Comparison:', stats);
    return stats;
  } catch (error) {
    console.error('Error:', error);
  }
}
```

## Example 9: Automated Quality Control

```typescript
import { useRealtimeScan } from '@/hooks/useRealtimeScan';
import { useEffect } from 'react';

const QUALITY_RULES = {
  minScore: 80,
  maxDefects: 3,
  maxMoisture: 75,
  requiredMetrics: {
    colorUniformity: 75,
    textureScore: 75,
    shapeRegularity: 75
  }
};

export function AutomatedQCComponent() {
  const userId = 'farmer-123';
  const { currentDetection } = useRealtimeScan(userId);

  useEffect(() => {
    if (!currentDetection) return;

    const issues: string[] = [];

    // Check score
    if (currentDetection.score < QUALITY_RULES.minScore) {
      issues.push(`Score too low: ${currentDetection.score}%`);
    }

    // Check defects
    if (currentDetection.defects.length > QUALITY_RULES.maxDefects) {
      issues.push(`Too many defects: ${currentDetection.defects.length}`);
    }

    // Check moisture
    if (currentDetection.metrics.moistureLevel > QUALITY_RULES.maxMoisture) {
      issues.push(`Moisture too high: ${currentDetection.metrics.moistureLevel}%`);
    }

    // Check individual metrics
    Object.entries(QUALITY_RULES.requiredMetrics).forEach(([metric, threshold]) => {
      const value = currentDetection.metrics[metric as keyof typeof currentDetection.metrics];
      if (value < threshold) {
        issues.push(`${metric} below threshold: ${value}%`);
      }
    });

    if (issues.length > 0) {
      console.log('QC Issues:', issues);
      // Trigger rejection or manual review
    } else {
      console.log('QC Passed');
      // Auto-approve
    }
  }, [currentDetection]);

  return <div>Automated QC Active</div>;
}
```

## Example 10: Real-Time Dashboard Integration

```typescript
import { RealtimeCropScanner } from '@/components/dashboard/farmer/RealtimeCropScanner';
import { useRealtimeScan } from '@/hooks/useRealtimeScan';

export function FarmerDashboardWithScanner() {
  const userId = 'farmer-123';
  const { currentDetection, stats, detections } = useRealtimeScan(userId);

  return (
    <div className="grid grid-cols-3 gap-4">
      {/* Scanner */}
      <div className="col-span-2">
        <RealtimeCropScanner />
      </div>

      {/* Stats Sidebar */}
      <div className="space-y-4">
        {/* Current Detection */}
        {currentDetection && (
          <div className="bg-white p-4 rounded shadow">
            <h3 className="font-bold mb-2">Current Detection</h3>
            <p>Grade: {currentDetection.grade}</p>
            <p>Score: {currentDetection.score}%</p>
            <p>Confidence: {currentDetection.confidence}%</p>
          </div>
        )}

        {/* Performance Stats */}
        {stats && (
          <div className="bg-white p-4 rounded shadow">
            <h3 className="font-bold mb-2">Performance</h3>
            <p>FPS: {stats.fps}</p>
            <p>Frames: {stats.totalFrames}</p>
            <p>Avg Score: {stats.averageScore}%</p>
          </div>
        )}

        {/* Summary */}
        <div className="bg-white p-4 rounded shadow">
          <h3 className="font-bold mb-2">Summary</h3>
          <p>Total Detections: {detections.length}</p>
          <p>Session Status: Active</p>
        </div>
      </div>
    </div>
  );
}
```

These examples demonstrate various ways to integrate and use the real-time crop quality scanner in your application.
