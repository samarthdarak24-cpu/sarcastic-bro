import api from './api';

export interface LivelinessResult {
  success: boolean;
  confidence: number;
  timestamp: string;
  sessionId: string;
}

export interface AadhaarResult {
  verified: boolean;
  aadhaarLast4: string;
  name: string;
  address?: string;
  timestamp: string;
}

export interface GeoAuditResult {
  verified: boolean;
  currentLocation: { lat: number; lng: number };
  registeredLocation: { lat: number; lng: number };
  distance: number;
  withinRadius: boolean;
  timestamp: string;
}

export interface FamilyMember {
  id: string;
  name: string;
  relation: string;
  aadhaarLast4: string;
  kycStatus: string;
}

export interface FamilyLinksResult {
  familyMembers: FamilyMember[];
  totalMembers: number;
  primaryHolder: string;
}

export interface Subsidy {
  scheme: string;
  amount: number;
  status: 'ACTIVE' | 'PENDING' | 'EXPIRED';
  nextDisbursement: string;
}

export interface SubsidyResult {
  eligible: boolean;
  subsidies: Subsidy[];
  totalAmount: number;
}

export interface BlacklistResult {
  isBlacklisted: boolean;
  reason?: string;
  blacklistedDate?: string;
  authority?: string;
  status: 'CLEAR' | 'FLAGGED' | 'BLACKLISTED';
  verificationScore?: number;
  databasesChecked?: number;
  totalDatabases?: number;
  databases?: Array<{
    name: string;
    authority: string;
    checked: boolean;
    found: boolean;
    lastUpdated: string;
  }>;
}

export interface ReKYCResult {
  kycRequired: boolean;
  lastKycDate: string;
  nextKycDue: string;
  daysRemaining: number;
  status: 'VALID' | 'EXPIRING_SOON' | 'EXPIRED';
  completionPercentage?: number;
  documentsVerified?: number;
  totalDocuments?: number;
  kycDocuments?: Array<{
    type: string;
    status: string;
    uploadedDate: string;
    verifiedDate: string | null;
    expiryDate: string | null;
    documentUrl: string;
  }>;
  renewalChecklist?: Array<{
    item: string;
    completed: boolean;
    required: boolean;
  }>;
  completedRequired?: number;
  requiredItems?: number;
  estimatedRenewalDays?: number;
  penalty?: {
    amount: number;
    currency: string;
    description: string;
  } | null;
  recommendations?: Array<{
    priority: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
    message: string;
    action: string;
  }>;
}

export const complianceAPI = {
  // 1. Liveliness Check
  checkLiveliness: (sessionId: string, photoData: string) =>
    api.post('/api/compliance/liveliness', { sessionId, photoData }),

  // 2. Aadhaar Verification
  verifyAadhaar: (aadhaarNumber: string) =>
    api.post('/api/compliance/aadhaar/verify', { aadhaarNumber }),

  // 3. Geo-Audit
  performGeoAudit: (latitude: number, longitude: number) =>
    api.post('/api/compliance/geo-audit', { latitude, longitude }),

  // 4. Family Links
  getFamilyLinks: () =>
    api.get('/api/compliance/family-links'),

  // 5. Subsidy Check
  checkSubsidies: () =>
    api.get('/api/compliance/subsidies'),

  // 6. Blacklist Check
  checkBlacklist: () =>
    api.get('/api/compliance/blacklist-check'),

  // 7. Re-KYC Timer
  checkReKYCTimer: () =>
    api.get('/api/compliance/rekyc-timer'),

  // Get compliance logs
  getComplianceLogs: (limit: number = 20) =>
    api.get(`/api/compliance/logs?limit=${limit}`),
};

export default complianceAPI;
