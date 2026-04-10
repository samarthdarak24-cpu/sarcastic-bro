# FPO (Farmer Producer Organization) Module

Complete implementation of FPO features for AgriTrust B2B Marketplace.

## Features Implemented

### 1. FPO Dashboard
- **Endpoint**: `GET /api/fpo/dashboard`
- **Description**: Overview stats including total farmers, active listings, revenue, and pending orders
- **Frontend**: `/fpo/dashboard`

### 2. Farmer Onboarding
- **Endpoint**: `POST /api/fpo/farmers`
- **Description**: Add farmers manually with offline support
- **Frontend**: `/fpo/farmers/onboard`
- **Fields**: name, phone, aadhaar, bankAccount, ifsc, district, photos

### 3. Farmer Management
- **Endpoints**: 
  - `GET /api/fpo/farmers` - List all farmers with filters
  - `GET /api/fpo/farmers/:id` - Get farmer details
- **Frontend**: `/fpo/farmers`
- **Features**: Search, filter by status, pagination

### 4. Delegated Listing
- **Endpoint**: `POST /api/fpo/farmers/:farmerId/products`
- **Description**: Add products on behalf of farmers
- **Frontend**: `/fpo/products/add`
- **Fields**: cropName, category, variety, quantity, pricePerKg, grade, qualityCertUrl

### 5. Aggregation Engine
- **Endpoints**:
  - `GET /api/fpo/aggregatable-crops` - Get crops that can be aggregated
  - `POST /api/fpo/aggregate` - Create aggregated lot
- **Frontend**: `/fpo/aggregate`
- **Logic**: Combines crops with same type + grade + location
- **Calculation**: Weighted average price based on quantity

### 6. Quality Verification
- **Endpoint**: `PUT /api/fpo/crops/:cropId/verify`
- **Description**: Approve or update quality certificates
- **Fields**: qualityCertUrl, grade

### 7. Bulk Listing
- **Endpoint**: `GET /api/fpo/lots`
- **Description**: View all aggregated lots
- **Frontend**: `/fpo/listings`
- **Filters**: status (LISTED, SOLD, PENDING)

### 8. Buyer Chat
- **Endpoints**:
  - `GET /api/fpo/chats` - List all chats
  - `GET /api/fpo/chats/:chatId/messages` - Get messages
  - `POST /api/fpo/chats/:chatId/messages` - Send message
- **Frontend**: `/fpo/chat`
- **Features**: Real-time negotiation with buyers

### 9. Escrow Payout
- **Endpoints**:
  - `POST /api/fpo/orders/:orderId/payout` - Process payout split
  - `GET /api/fpo/payouts` - View payout history
- **Frontend**: `/fpo/payouts`
- **Logic**: 
  - Calculates each farmer's share based on contribution %
  - Deducts FPO commission (configurable rate)
  - Releases escrow after delivery

### 10. Logistics Management
- **Endpoints**:
  - `POST /api/fpo/logistics` - Create shipment
  - `GET /api/fpo/logistics` - List all shipments
  - `GET /api/fpo/logistics/:id` - Track shipment
  - `PUT /api/fpo/logistics/:id` - Update shipment status
- **Frontend**: `/fpo/logistics`
- **Features**: Tracking number, carrier, status updates, location tracking

## Database Schema

### New Tables
- `FPOChat` - Chat conversations with buyers
- `FPOChatMessage` - Individual chat messages
- `FPOLogistics` - Shipment tracking
- `LogisticsEvent` - Shipment status history
- `FPOPayoutSplit` - Payment distribution records

### Updated Tables
- `FPO` - Added commissionRate field
- `User` - Added fpoId relation
- `FPOFarmer` - Added payoutSplits relation
- `Crop` - Added payoutSplits relation
- `Order` - Added logistics and payoutSplits relations

## Authentication

All endpoints require:
- JWT token in Authorization header
- Role: FPO
- Valid fpoId in token payload

## Usage Example

```typescript
// Frontend - Get Dashboard
import fpoService from '@/services/fpo';

const dashboard = await fpoService.getDashboard();
console.log(dashboard.stats);

// Backend - Process Payout
const payouts = await fpoService.processEscrowPayout(orderId, fpoId);
```

## Migration

Run the migration to add FPO features:

```bash
cd apps/api
npx prisma migrate dev --name add_fpo_features
```

Or apply the SQL migration directly:

```bash
psql -d your_database < prisma/migrations/add_fpo_features.sql
```

## Environment Variables

No additional environment variables required. Uses existing:
- `DATABASE_URL` - PostgreSQL connection
- `JWT_ACCESS_SECRET` - For authentication

## Testing

```bash
# Test FPO endpoints
npm test -- fpo

# Test specific feature
npm test -- fpo.service
```

## Frontend Routes

- `/fpo/dashboard` - Main dashboard
- `/fpo/farmers` - Farmer list
- `/fpo/farmers/onboard` - Add new farmer
- `/fpo/farmers/:id` - Farmer details
- `/fpo/products/add` - Add product for farmer
- `/fpo/aggregate` - Crop aggregation
- `/fpo/listings` - Bulk listings
- `/fpo/chat` - Buyer chat
- `/fpo/logistics` - Shipment tracking
- `/fpo/payouts` - Payment history

## API Response Format

```json
{
  "success": true,
  "data": { ... },
  "pagination": {
    "total": 100,
    "page": 1,
    "limit": 20,
    "totalPages": 5
  }
}
```

## Error Handling

All errors return:

```json
{
  "error": "Error message"
}
```

Common status codes:
- 400 - Bad request / validation error
- 401 - Unauthorized
- 403 - Forbidden (wrong role)
- 404 - Resource not found
- 500 - Server error

## Next Steps

1. Add Socket.IO for real-time chat
2. Implement file upload to Cloudinary
3. Add SMS notifications for farmers
4. Create mobile app for farmers
5. Add analytics dashboard
6. Implement payment gateway integration
