# ODOP AI Service - Architecture Overview

## Service Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    ODOP Web Application                     │
│              (Next.js Frontend - apps/web)                  │
└────────────────────┬────────────────────────────────────────┘
                     │
                     │ HTTP/REST API Calls
                     │
        ┌────────────▼────────────────────┐
        │    ODOP API Gateway             │
        │   (Node.js - apps/api)          │
        │  - Authentication               │
        │  - Rate Limiting                │
        │  - Request Routing              │
        └────────────┬─────────────────────┘
                     │
      ┌──────────────┴──────────────┐
      │                             │
      │    Core APIs                │ AI Service Calls
      │  (Product, Order,           │
      │   User routes)              │
      │                             │
      │                    ┌────────▼──────────────────┐
      │                    │  ODOP AI Service         │
      │                    │  (FastAPI - apps/ai)     │
      │                    │                          │
      │                    │  1. Quality Grade        │
      │                    │  2. Buyer Reco.          │
      │                    │  3. Supplier Reco.       │
      │                    │  4. Demand Forecast      │
      │                    │  5. Pest Detection       │
      │                    │                          │
      │                    │  ┌────────────────────┐  │
      │                    │  │  Services Layer    │  │
      │                    │  │                    │  │
      │                    │  │ ├─ Quality Svc    │  │
      │                    │  │ ├─ Recommend Svc  │  │
      │                    │  │ ├─ Forecast Svc   │  │
      │                    │  │ └─ Pest Detect    │  │
      │                    │  └────────────────────┘  │
      │                    │                          │
      │                    └──────────────────────────┘
      │
      └──────────────┬──────────────┐
               │     │     │     │
         (Database operations)
```

## Technology Stack

### AI Service (FastAPI)
- **Framework**: FastAPI 0.104.1
- **Server**: Uvicorn 0.24.0
- **Validation**: Pydantic 2.5.0
- **Async**: asyncio
- **ML/Data**: NumPy, Pandas, Scikit-learn
- **Image Processing**: Pillow

### Supporting Services
- **Main API**: Node.js + Express (apps/api)
- **Frontend**: Next.js (apps/web)
- **Database**: PostgreSQL (via Prisma ORM)
- **Message Queue**: Redis (optional, for async tasks)
- **Cache**: Redis (optional, for caching predictions)

## Endpoint Mapping

| Endpoint | Purpose | Input | Output | Use Case |
|----------|---------|-------|--------|----------|
| `/ai/quality-grade` | Product Analysis | Image + Product Type | Grade A-D + Metrics | Harvest grading, QC |
| `/ai/recommendations/buyer` | Buyer Matching | Buyer Criteria | Farmer List + Match Score | Procurement |
| `/ai/recommendations/supplier` | Supplier Matching | Farm Details | Buyer List + Opportunities | Market Access |
| `/ai/forecast` | Demand Prediction | Product + Duration | Forecast Data | Planning & Pricing |
| `/ai/pest-detection` | Crop Health | Image + Crop Type | Pest List + Health % | Prevention |

## Data Flow

### Quality Grade Analysis Flow
```
Client Request (Image + Product)
        ↓
Validation (Pydantic)
        ↓
QualityGradeService.analyze_quality()
        ├─ Simulate image analysis
        ├─ Extract quality metrics
        ├─ Calculate quality score
        ├─ Assign grade (A-D)
        ├─ Generate recommendations
        └─ Return response
        ↓
JSON Response with Grade + Details
        ↓
Web UI renders results
```

### Recommendation Flow
```
Buyer/Seller Criteria
        ↓
Match Algorithm
        ├─ Score calculation
        ├─ Sorting & filtering
        └─ Ranking
        ↓
Recommend Top Matches
        ├─ Farmer Details (for buyer)
        ├─ Buyer Details (for seller)
        └─ Opportunities
        ↓
Return Ranked List
```

### Forecast Flow
```
Product Name + Duration
        ↓
Get Historical Pattern
        ↓
Apply Seasonal Factors
        ↓
Calculate Growth Trend
        ↓
Generate Monthly Forecasts
        ├─ Predicted Demand
        ├─ Confidence Intervals
        ├─ Price Suggestions
        └─ Quantity Recommendations
        ↓
Return Forecast Data
```

## Integration with Main API (apps/api)

### Request Flow
```
Frontend → API Gateway (apps/api) → Route Handler
                                       ↓
                    Call AI Service endpoint
                   (POST /ai/quality-grade)
                                       ↓
                        Return AI results
                                       ↓
                    Format & send to Frontend
```

### Example Integration Code
```typescript
// In apps/api/src/modules/product/product.service.ts
async analyzeProductQuality(imageUrl: string, productType: string) {
  try {
    const response = await fetch('http://ai-service:8000/ai/quality-grade', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        image_url: imageUrl,
        product_type: productType,
        product_name: productName
      })
    });
    
    return response.json();
  } catch (error) {
    logger.error('AI Service error:', error);
    throw new ApiError('Failed to analyze product quality', 500);
  }
}
```

## Service Configuration

### Environment Setup
```env
# AI Service
AI_SERVICE_URL=http://localhost:8000
AI_SERVICE_TIMEOUT=30000
AI_SERVICE_RETRY_ATTEMPTS=3

# CORS
CORS_ORIGINS=http://localhost:3000,http://api:3001

# Rate Limiting
RATE_LIMIT_PER_MINUTE=100
RATE_LIMIT_PER_HOUR=10000
```

### Service Dependencies
```
AI Service
├── FastAPI framework
├── Uvicorn web server
├── Pydantic validation
├── NumPy (numerical)
├── Pandas (data)
├── Scikit-learn (ML simulation)
├── Pillow (image)
└── Python 3.9+
```

## Scaling Strategy

### Horizontal Scaling
```
┌─────────────┐
│   Nginx     │  Load Balancer
│ (upstream)  │
└──────┬──────┘
       │
   ┌───┴───┬───────┬───────┬───────┐
   │       │       │       │       │
┌──▼──┐┌──▼──┐┌──▼──┐┌──▼──┐┌──▼──┐
│ AI  ││ AI  ││ AI  ││ AI  ││ AI  │
│ #1  ││ #2  ││ #3  ││ #4  ││ #5  │
└─────┘└─────┘└─────┘└─────┘└─────┘

Each instance: 4× workers, 1GB RAM
Recommended: 3-5 instances for production
```

### Vertical Scaling
```
Typical Resource Needs:
- Single Worker: 256MB RAM, 0.25 CPU cores
- 4 Workers: 512MB RAM, 1 CPU core  
- Production (4+ workers): 2GB RAM, 2 CPU cores
```

## Security

### Input Validation
- All requests validated with Pydantic models
- File size limits enforced (10MB max)
- Image format validation
- Query parameter sanitization

### Data Protection
- No sensitive data in logs
- Request/response logging sanitized
- CORS configured for allowed origins
- Rate limiting to prevent abuse

### Deployment Security
- Run in container with limited permissions
- Use network policies (in Kubernetes)
- Regular dependency updates
- Environment-based configuration

## Performance Metrics

### Typical Response Times
| Endpoint | Time | Notes |
|----------|------|-------|
| Quality Grade | 200-300ms | Includes mock processing |
| Buyer Reco. | 150-250ms | In-memory data |
| Forecast | 180-280ms | Calculation intensive |
| Pest Detection | 300-400ms | Image analysis sim |
| Health Check | <10ms | Direct response |

### Throughput
- Single Instance: 50-100 req/s
- 4 Instances Load Balanced: 200-400 req/s
- Full K8s Cluster (autoscaled): 1000+ req/s

## Monitoring Points

### Key Metrics
- Request count per endpoint
- Average response time
- Error rate (4xx, 5xx)
- Memory usage per process
- CPU utilization

### Alert Thresholds
- Response time > 1000ms
- Error rate > 5%
- Memory > 700MB per instance
- CPU > 80% sustained

### Health Checks
```bash
# Every 10 seconds
GET /health

# Expected Response
{"status": "healthy", "service": "ODOP AI Service"}
```

## Logging Strategy

### Log Levels
- **DEBUG**: Development details
- **INFO**: Normal operations, request starts/ends
- **WARNING**: Unusual but recoverable situations
- **ERROR**: Serious problems
- **CRITICAL**: System failures

### Log Format
```
timestamp - logger_name - level - message
2024-04-03 10:30:00 - main - INFO - Quality grade analysis completed - Grade: A
```

### Log Aggregation
```
Local Logs → Filebeat → Elasticsearch → Kibana
```

## Disaster Recovery

### Backup Strategy
- Application code: Git repository
- Configuration: .env files versioned
- Database: Regular scheduled backups
- Logs: Retained for 30 days

### Recovery Procedures
1. **Service Down**: Restart via systemd/Docker
2. **Data Corruption**: Restore from backup
3. **Performance Degradation**: Scale horizontally
4. **Critical Bug**: Rollback to previous version

## Future Enhancements

### Planned Features
- Real ML model integration (TensorFlow, PyTorch)
- WebSocket support for real-time updates
- Advanced caching strategies
- ML model versioning
- A/B testing framework
- Batch processing API

### Optimization Opportunities
- Cache prediction results in Redis
- Implement database connection pooling
- Add query result caching
- Implement async job queue for heavy processing
- Add GraphQL API alongside REST

## Integration Checklist

- [x] AI service endpoint validation
- [x] Error handling and logging
- [ ] Monitoring and alerting setup
- [ ] Performance testing completed
- [ ] Security audit completed
- [ ] Documentation updated
- [ ] Backup procedures documented
- [ ] Scaling strategy documented

---

**Last Updated**: 2024-04-03
**Version**: 1.0.0
**Maintained By**: ODOP Engineering Team
