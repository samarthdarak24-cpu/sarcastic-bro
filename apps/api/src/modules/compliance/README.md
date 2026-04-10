# Government Compliance Module

Complete working implementation of 7 government compliance APIs with mock data for real-time testing.

## 📋 Features

1. **Liveliness API** - Verify user is physically present (AI-based face detection)
2. **AADHAAR Bridge** - Verify Aadhaar details with UIDAI
3. **Geo-Audit** - Verify user location matches registered location
4. **Family Links** - Get linked family members
5. **Subsidy Check** - Check eligible government subsidies
6. **Blacklist DB** - Check if user is blacklisted
7. **Re-KYC Timer** - Check KYC validity and next due date

## 🚀 API Endpoints

### Base URL
```
http://localhost:3001/api/compliance
```

### 1. Liveliness Check
**POST** `/api/compliance/liveliness`

Verify that the user is physically present using AI-based face detection.

**Request Body:**
```json
{
  "sessionId": "session_1234567890",
  "photoData": "base64_encoded_image_data"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Liveliness verified",
  "data": {
    "success": true,
    "confidence": 95.7,
    "timestamp": "2025-02-15T10:30:00.000Z",
    "sessionId": "session_1234567890"
  }
}
```

---

### 2. AADHAAR Bridge
**POST** `/api/compliance/aadhaar/verify`

Verify Aadhaar number with UIDAI database.

**Request Body:**
```json
{
  "aadhaarNumber": "123456789012"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Aadhaar verified successfully",
  "data": {
    "verified": true,
    "aadhaarLast4": "9012",
    "name": "Rajesh Kumar",
    "address": "Village Nanded, Maharashtra, 431601",
    "timestamp": "2025-02-15T10:30:00.000Z"
  }
}
```

---

### 3. Geo-Audit
**POST** `/api/compliance/geo-audit`

Verify user's current location matches their registered location (within 50km radius).

**Request Body:**
```json
{
  "latitude": 19.1383,
  "longitude": 77.3210
}
```

**Response:**
```json
{
  "success": true,
  "message": "Location verified",
  "data": {
    "verified": true,
    "currentLocation": {
      "lat": 19.1383,
      "lng": 77.3210
    },
    "registeredLocation": {
      "lat": 19.1383,
      "lng": 77.3210
    },
    "distance": 0.05,
    "withinRadius": true,
    "timestamp": "2025-02-15T10:30:00.000Z"
  }
}
```

---

### 4. Family Links
**GET** `/api/compliance/family-links`

Get all family members linked to the user's account.

**Response:**
```json
{
  "success": true,
  "data": {
    "familyMembers": [
      {
        "id": "member_1",
        "name": "Rajesh Kumar",
        "relation": "Self",
        "aadhaarLast4": "1234",
        "kycStatus": "VERIFIED"
      },
      {
        "id": "member_2",
        "name": "Sunita Kumar",
        "relation": "Spouse",
        "aadhaarLast4": "5678",
        "kycStatus": "VERIFIED"
      },
      {
        "id": "member_3",
        "name": "Amit Kumar",
        "relation": "Son",
        "aadhaarLast4": "9012",
        "kycStatus": "PENDING"
      }
    ],
    "totalMembers": 3,
    "primaryHolder": "Rajesh Kumar"
  }
}
```

---

### 5. Subsidy Check
**GET** `/api/compliance/subsidies`

Check all government subsidies the user is eligible for.

**Response:**
```json
{
  "success": true,
  "data": {
    "eligible": true,
    "subsidies": [
      {
        "scheme": "PM-KISAN",
        "amount": 6000,
        "status": "ACTIVE",
        "nextDisbursement": "2025-04-01T00:00:00.000Z"
      },
      {
        "scheme": "Fertilizer Subsidy",
        "amount": 2500,
        "status": "ACTIVE",
        "nextDisbursement": "2025-03-15T00:00:00.000Z"
      },
      {
        "scheme": "Crop Insurance (PMFBY)",
        "amount": 1200,
        "status": "PENDING",
        "nextDisbursement": "2025-06-01T00:00:00.000Z"
      }
    ],
    "totalAmount": 8500
  }
}
```

---

### 6. Blacklist Check
**GET** `/api/compliance/blacklist-check`

Check if the user is blacklisted in any government database.

**Response:**
```json
{
  "success": true,
  "data": {
    "isBlacklisted": false,
    "status": "CLEAR"
  }
}
```

---

### 7. Re-KYC Timer
**GET** `/api/compliance/rekyc-timer`

Check KYC validity and when the next KYC is due.

**Response:**
```json
{
  "success": true,
  "data": {
    "kycRequired": false,
    "lastKycDate": "2024-06-15T00:00:00.000Z",
    "nextKycDue": "2025-06-15T00:00:00.000Z",
    "daysRemaining": 120,
    "status": "VALID"
  }
}
```

---

### 8. Compliance Logs
**GET** `/api/compliance/logs?limit=20`

Get all compliance check logs for the user.

**Query Parameters:**
- `limit` (optional): Number of logs to retrieve (default: 20)

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "log_123",
      "userId": "user_456",
      "type": "LIVELINESS_CHECK",
      "status": "PASSED",
      "details": {
        "sessionId": "session_123",
        "confidence": 95.7,
        "timestamp": "2025-02-15T10:30:00.000Z"
      },
      "createdAt": "2025-02-15T10:30:00.000Z"
    }
  ]
}
```

## 🧪 Testing

### Using cURL

```bash
# 1. Liveliness Check
curl -X POST http://localhost:3001/api/compliance/liveliness \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"sessionId":"session_123","photoData":"base64_data"}'

# 2. Aadhaar Verification
curl -X POST http://localhost:3001/api/compliance/aadhaar/verify \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"aadhaarNumber":"123456789012"}'

# 3. Geo-Audit
curl -X POST http://localhost:3001/api/compliance/geo-audit \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"latitude":19.1383,"longitude":77.3210}'

# 4. Family Links
curl -X GET http://localhost:3001/api/compliance/family-links \
  -H "Authorization: Bearer YOUR_TOKEN"

# 5. Subsidy Check
curl -X GET http://localhost:3001/api/compliance/subsidies \
  -H "Authorization: Bearer YOUR_TOKEN"

# 6. Blacklist Check
curl -X GET http://localhost:3001/api/compliance/blacklist-check \
  -H "Authorization: Bearer YOUR_TOKEN"

# 7. Re-KYC Timer
curl -X GET http://localhost:3001/api/compliance/rekyc-timer \
  -H "Authorization: Bearer YOUR_TOKEN"

# 8. Compliance Logs
curl -X GET "http://localhost:3001/api/compliance/logs?limit=10" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Using Test Script

```bash
# Update token in test script
cd apps/api

# Run test script
npx ts-node scripts/test-compliance.ts
```

## 📊 Mock Data

All APIs return realistic mock data for testing:

### Liveliness
- Confidence score: 85-99% (random)
- Success threshold: >90%

### Aadhaar
- Name: Rajesh Kumar
- Address: Village Nanded, Maharashtra, 431601
- DOB: 1990-05-15

### Geo-Audit
- Registered location: Nanded (19.1383, 77.3210)
- Radius check: 50km
- Uses Haversine formula for distance calculation

### Family Links
- 4 family members (Self, Spouse, Son, Daughter)
- Mixed KYC status (VERIFIED, PENDING)

### Subsidies
- PM-KISAN: ₹6,000/year
- Fertilizer Subsidy: ₹2,500
- Crop Insurance: ₹1,200
- Diesel Subsidy: ₹800 (expired)

### Blacklist
- Default: CLEAR status
- Easy to modify for testing flagged/blacklisted scenarios

### Re-KYC Timer
- Last KYC: 2024-06-15
- Next KYC: 2025-06-15
- Status calculation:
  - VALID: >30 days remaining
  - EXPIRING_SOON: <30 days remaining
  - EXPIRED: <0 days remaining

## 🔒 Security

- All endpoints require JWT authentication
- Compliance logs are stored for audit trail
- Aadhaar numbers are masked (only last 4 digits stored)
- Location data is encrypted at rest

## 📝 Database Schema

The module uses the `ComplianceLog` model:

```prisma
model ComplianceLog {
  id        String   @id @default(uuid())
  userId    String
  type      String   // LIVELINESS_CHECK, AADHAAR_VERIFICATION, GEO_AUDIT, etc.
  status    String   // PASSED, FAILED, SUCCESS, VALID, EXPIRED, etc.
  details   Json     // Detailed result data
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  
  user      User     @relation(fields: [userId], references: [id])
}
```

## 🚧 Production Integration

To integrate with real government APIs:

1. **Liveliness**: Integrate with AI services like AWS Rekognition or Azure Face API
2. **AADHAAR**: Use UIDAI's official API (requires license)
3. **Geo-Audit**: Already production-ready with GPS validation
4. **Family Links**: Integrate with state government family registry
5. **Subsidy Check**: Connect to PM-KISAN and state subsidy databases
6. **Blacklist**: Integrate with RBI/ED blacklist databases
7. **Re-KYC**: Connect to CKYC (Central KYC) registry

## 📖 Additional Resources

- [UIDAI API Documentation](https://uidai.gov.in/)
- [PM-KISAN Official Portal](https://pmkisan.gov.in/)
- [CKYC Registry](https://www.ckycindia.in/)

## 🐛 Troubleshooting

### Common Issues

1. **401 Unauthorized**: Check JWT token validity
2. **400 Bad Request**: Ensure all required fields are provided
3. **500 Internal Error**: Check server logs for details

### Debug Mode

Enable detailed logging:
```bash
DEBUG=compliance:* npm run dev
```

## 📞 Support

For issues or questions, create an issue in the repository or contact the development team.
