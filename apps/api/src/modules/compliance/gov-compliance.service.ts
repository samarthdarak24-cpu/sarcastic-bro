import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export interface LivelinessCheckResult {
  success: boolean;
  confidence: number;
  timestamp: Date;
  sessionId: string;
}

export interface AadhaarVerificationResult {
  verified: boolean;
  aadhaarLast4: string;
  name: string;
  address?: string;
  timestamp: Date;
}

export interface GeoAuditResult {
  verified: boolean;
  currentLocation: { lat: number; lng: number };
  registeredLocation: { lat: number; lng: number };
  distance: number; // in km
  withinRadius: boolean;
  timestamp: Date;
}

export interface FamilyLinkResult {
  familyMembers: Array<{
    id: string;
    name: string;
    relation: string;
    aadhaarLast4: string;
    kycStatus: string;
  }>;
  totalMembers: number;
  primaryHolder: string;
}

export interface SubsidyCheckResult {
  eligible: boolean;
  subsidies: Array<{
    scheme: string;
    amount: number;
    status: 'ACTIVE' | 'PENDING' | 'EXPIRED';
    nextDisbursement: Date;
  }>;
  totalAmount: number;
}

export interface BlacklistCheckResult {
  isBlacklisted: boolean;
  reason?: string;
  blacklistedDate?: Date;
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
    lastUpdated: Date;
  }>;
}

export interface ReKYCTimerResult {
  kycRequired: boolean;
  lastKycDate: Date;
  nextKycDue: Date;
  daysRemaining: number;
  status: 'VALID' | 'EXPIRING_SOON' | 'EXPIRED';
  completionPercentage?: number;
  documentsVerified?: number;
  totalDocuments?: number;
  kycDocuments?: Array<{
    type: string;
    status: string;
    uploadedDate: Date;
    verifiedDate: Date | null;
    expiryDate: Date | null;
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

export class GovComplianceService {
  /**
   * 1. Liveliness API - Verify user is physically present
   */
  async checkLiveliness(userId: string, sessionId: string, photoData: string): Promise<LivelinessCheckResult> {
    // Mock liveliness detection with AI
    const confidence = Math.random() * (99 - 85) + 85; // 85-99%
    const success = confidence > 90;

    // Store check result
    await prisma.complianceLog.create({
      data: {
        userId,
        type: 'LIVELINESS_CHECK',
        status: success ? 'PASSED' : 'FAILED',
        details: {
          sessionId,
          confidence,
          timestamp: new Date()
        }
      }
    });

    return {
      success,
      confidence,
      timestamp: new Date(),
      sessionId
    };
  }

  /**
   * 2. AADHAAR Bridge - Verify Aadhaar details
   */
  async verifyAadhaar(userId: string, aadhaarNumber: string): Promise<AadhaarVerificationResult> {
    // Mock Aadhaar verification (in production, integrate with UIDAI API)
    const aadhaarLast4 = aadhaarNumber.slice(-4);
    
    // Simulated response from UIDAI
    const mockResponse = {
      verified: true,
      name: 'Rajesh Kumar',
      address: 'Village Nanded, Maharashtra, 431601',
      dob: '1990-05-15',
      gender: 'M'
    };

    // Update user KYC
    await prisma.user.update({
      where: { id: userId },
      data: {
        kycStatus: 'VERIFIED'
      }
    });

    // Store verification log
    await prisma.complianceLog.create({
      data: {
        userId,
        type: 'AADHAAR_VERIFICATION',
        status: 'PASSED',
        details: {
          aadhaarLast4,
          timestamp: new Date()
        }
      }
    });

    return {
      verified: mockResponse.verified,
      aadhaarLast4,
      name: mockResponse.name,
      address: mockResponse.address,
      timestamp: new Date()
    };
  }

  /**
   * 3. Geo-Audit - Verify user location matches registered location
   */
  async performGeoAudit(
    userId: string, 
    currentLat: number, 
    currentLng: number
  ): Promise<GeoAuditResult> {
    // Get user's registered location
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        farmer: {
          include: {
            farm: true
          }
        }
      }
    });

    // Mock registered location (in production, get from user profile)
    const registeredLat = 19.1383; // Nanded
    const registeredLng = 77.3210;

    // Calculate distance using Haversine formula
    const distance = this.calculateDistance(
      currentLat, currentLng,
      registeredLat, registeredLng
    );

    // Check if within 50km radius
    const withinRadius = distance <= 50;

    // Store audit log
    await prisma.complianceLog.create({
      data: {
        userId,
        type: 'GEO_AUDIT',
        status: withinRadius ? 'PASSED' : 'FAILED',
        details: {
          currentLocation: { lat: currentLat, lng: currentLng },
          registeredLocation: { lat: registeredLat, lng: registeredLng },
          distance,
          withinRadius,
          timestamp: new Date()
        }
      }
    });

    return {
      verified: withinRadius,
      currentLocation: { lat: currentLat, lng: currentLng },
      registeredLocation: { lat: registeredLat, lng: registeredLng },
      distance,
      withinRadius,
      timestamp: new Date()
    };
  }

  /**
   * 4. Family Links - Get linked family members
   */
  async getFamilyLinks(userId: string): Promise<FamilyLinkResult> {
    // Mock family data (in production, query database)
    const familyMembers = [
      {
        id: 'member_1',
        name: 'Rajesh Kumar',
        relation: 'Self',
        aadhaarLast4: '1234',
        kycStatus: 'VERIFIED'
      },
      {
        id: 'member_2',
        name: 'Sunita Kumar',
        relation: 'Spouse',
        aadhaarLast4: '5678',
        kycStatus: 'VERIFIED'
      },
      {
        id: 'member_3',
        name: 'Amit Kumar',
        relation: 'Son',
        aadhaarLast4: '9012',
        kycStatus: 'PENDING'
      },
      {
        id: 'member_4',
        name: 'Priya Kumar',
        relation: 'Daughter',
        aadhaarLast4: '3456',
        kycStatus: 'VERIFIED'
      }
    ];

    // Store access log
    await prisma.complianceLog.create({
      data: {
        userId,
        type: 'FAMILY_LINKS_ACCESS',
        status: 'SUCCESS',
        details: {
          totalMembers: familyMembers.length,
          timestamp: new Date()
        }
      }
    });

    return {
      familyMembers,
      totalMembers: familyMembers.length,
      primaryHolder: 'Rajesh Kumar'
    };
  }

  /**
   * 5. Subsidy Check - Check eligible subsidies
   */
  async checkSubsidies(userId: string): Promise<SubsidyCheckResult> {
    // Mock subsidy data
    const subsidies = [
      {
        scheme: 'PM-KISAN',
        amount: 6000,
        status: 'ACTIVE' as const,
        nextDisbursement: new Date('2025-04-01')
      },
      {
        scheme: 'Fertilizer Subsidy',
        amount: 2500,
        status: 'ACTIVE' as const,
        nextDisbursement: new Date('2025-03-15')
      },
      {
        scheme: 'Crop Insurance (PMFBY)',
        amount: 1200,
        status: 'PENDING' as const,
        nextDisbursement: new Date('2025-06-01')
      },
      {
        scheme: 'Diesel Subsidy',
        amount: 800,
        status: 'EXPIRED' as const,
        nextDisbursement: new Date('2024-12-31')
      }
    ];

    const activeSubsidies = subsidies.filter(s => s.status === 'ACTIVE');
    const totalAmount = activeSubsidies.reduce((sum, s) => sum + s.amount, 0);

    // Store check log
    await prisma.complianceLog.create({
      data: {
        userId,
        type: 'SUBSIDY_CHECK',
        status: 'SUCCESS',
        details: {
          totalSubsidies: subsidies.length,
          activeSubsidies: activeSubsidies.length,
          totalAmount,
          timestamp: new Date()
        }
      }
    });

    return {
      eligible: activeSubsidies.length > 0,
      subsidies,
      totalAmount
    };
  }

  /**
   * 6. Blacklist DB - Comprehensive blacklist checking across multiple databases
   */
  async checkBlacklist(userId: string): Promise<BlacklistCheckResult> {
    // Get user details for realistic checking
    const user = await prisma.user.findUnique({
      where: { id: userId }
    });

    if (!user) {
      throw new Error('User not found');
    }

    // Mock comprehensive blacklist databases
    const blacklistDatabases = [
      {
        name: 'RBI Defaulters List',
        authority: 'Reserve Bank of India',
        checked: true,
        found: false,
        lastUpdated: new Date('2025-02-10')
      },
      {
        name: 'ED Enforcement Database',
        authority: 'Enforcement Directorate',
        checked: true,
        found: false,
        lastUpdated: new Date('2025-02-12')
      },
      {
        name: 'CBI Criminal Records',
        authority: 'Central Bureau of Investigation',
        checked: true,
        found: false,
        lastUpdated: new Date('2025-02-08')
      },
      {
        name: 'State Agriculture Fraud Database',
        authority: 'Maharashtra Agriculture Dept',
        checked: true,
        found: false,
        lastUpdated: new Date('2025-02-14')
      },
      {
        name: 'GST Non-Compliance List',
        authority: 'GST Council',
        checked: true,
        found: false,
        lastUpdated: new Date('2025-02-13')
      },
      {
        name: 'Bank Loan Defaulters',
        authority: 'Indian Banks Association',
        checked: true,
        found: false,
        lastUpdated: new Date('2025-02-11')
      }
    ];

    // Check if user is in any blacklist (mock: always clear for demo)
    const isBlacklisted = blacklistDatabases.some(db => db.found);
    
    // Determine overall status
    let status: 'CLEAR' | 'FLAGGED' | 'BLACKLISTED';
    let reason = '';
    let blacklistedDate = null;
    let authority = '';

    if (isBlacklisted) {
      const foundDb = blacklistDatabases.find(db => db.found);
      status = 'BLACKLISTED';
      reason = `Found in ${foundDb?.name || 'Unknown Database'}`;
      blacklistedDate = foundDb?.lastUpdated || new Date();
      authority = foundDb?.authority || 'Unknown Authority';
    } else {
      // Check for any flags (warnings that aren't full blacklist)
      const hasFlags = false; // Mock: no flags
      status = hasFlags ? 'FLAGGED' : 'CLEAR';
      reason = hasFlags ? 'Minor discrepancies found' : 'No issues found';
    }

    // Calculate verification score
    const totalDatabases = blacklistDatabases.length;
    const checkedDatabases = blacklistDatabases.filter(db => db.checked).length;
    const verificationScore = (checkedDatabases / totalDatabases) * 100;

    // Store comprehensive check log
    await prisma.complianceLog.create({
      data: {
        userId,
        type: 'BLACKLIST_CHECK',
        status: status,
        details: {
          isBlacklisted,
          status,
          reason,
          authority,
          blacklistedDate,
          databasesChecked: checkedDatabases,
          totalDatabases,
          verificationScore,
          databases: blacklistDatabases.map(db => ({
            name: db.name,
            authority: db.authority,
            status: db.found ? 'FOUND' : 'CLEAR',
            lastUpdated: db.lastUpdated
          })),
          timestamp: new Date()
        }
      }
    });

    return {
      isBlacklisted,
      status,
      reason,
      blacklistedDate: blacklistedDate || undefined,
      authority,
      verificationScore,
      databasesChecked: checkedDatabases,
      totalDatabases,
      databases: blacklistDatabases
    };
  }

  /**
   * 7. Re-KYC Timer - Comprehensive KYC validity and renewal tracking
   */
  async checkReKYCTimer(userId: string): Promise<ReKYCTimerResult> {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        kycDocuments: true
      }
    });

    if (!user) {
      throw new Error('User not found');
    }

    // Mock comprehensive KYC data
    const lastKycDate = new Date('2024-06-15');
    const nextKycDue = new Date('2025-06-15');
    const today = new Date();
    
    // Calculate days remaining
    const daysRemaining = Math.ceil(
      (nextKycDue.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
    );

    // Determine status
    let status: 'VALID' | 'EXPIRING_SOON' | 'EXPIRED';
    if (daysRemaining < 0) {
      status = 'EXPIRED';
    } else if (daysRemaining < 30) {
      status = 'EXPIRING_SOON';
    } else {
      status = 'VALID';
    }

    // KYC Documents status
    const kycDocuments = [
      {
        type: 'AADHAAR',
        status: user.kycStatus === 'VERIFIED' ? 'VERIFIED' : 'PENDING',
        uploadedDate: new Date('2024-06-10'),
        verifiedDate: new Date('2024-06-12'),
        expiryDate: new Date('2025-06-15'),
        documentUrl: '/documents/aadhaar.pdf'
      },
      {
        type: 'PAN_CARD',
        status: user.kycStatus === 'VERIFIED' ? 'VERIFIED' : 'PENDING',
        uploadedDate: new Date('2024-06-10'),
        verifiedDate: new Date('2024-06-12'),
        expiryDate: null, // PAN doesn't expire
        documentUrl: '/documents/pan.pdf'
      },
      {
        type: 'BANK_PASSBOOK',
        status: 'VERIFIED' as const,
        uploadedDate: new Date('2024-06-11'),
        verifiedDate: new Date('2024-06-13'),
        expiryDate: null,
        documentUrl: '/documents/bank.pdf'
      },
      {
        type: 'ADDRESS_PROOF',
        status: user.kycStatus === 'VERIFIED' ? 'VERIFIED' : 'PENDING',
        uploadedDate: new Date('2024-06-11'),
        verifiedDate: new Date('2024-06-14'),
        expiryDate: new Date('2025-06-15'),
        documentUrl: '/documents/address.pdf'
      }
    ];

    // Calculate completion percentage
    const verifiedDocs = kycDocuments.filter(doc => doc.status === 'VERIFIED').length;
    const completionPercentage = (verifiedDocs / kycDocuments.length) * 100;

    // KYC renewal checklist
    const renewalChecklist = [
      { item: 'Update Aadhaar Details', completed: true, required: true },
      { item: 'Verify Bank Account', completed: true, required: true },
      { item: 'Upload Address Proof', completed: true, required: true },
      { item: 'Update PAN Information', completed: true, required: false },
      { item: 'Business Registration', completed: user.kycStatus === 'VERIFIED', required: user.role === 'BUYER' },
      { item: 'GST Certificate', completed: user.kycStatus === 'VERIFIED', required: user.role === 'BUYER' }
    ];

    const completedItems = renewalChecklist.filter(item => item.completed).length;
    const requiredItems = renewalChecklist.filter(item => item.required).length;
    const completedRequired = renewalChecklist.filter(item => item.required && item.completed).length;

    // Estimated renewal time
    const estimatedRenewalDays = 7; // 7 days to complete KYC renewal

    // Penalties for late renewal
    let penalty = null;
    if (daysRemaining < 0) {
      const daysOverdue = Math.abs(daysRemaining);
      penalty = {
        amount: Math.min(daysOverdue * 10, 5000), // ₹10 per day, max ₹5000
        currency: 'INR',
        description: `Late KYC renewal penalty: ₹10/day (Max ₹5,000)`
      };
    }

    // Recommendations
    const recommendations: Array<{ priority: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW'; message: string; action: string }> = [];
    if (status === 'EXPIRED') {
      recommendations.push({
        priority: 'CRITICAL',
        message: 'KYC has expired. Renew immediately to avoid account restrictions.',
        action: 'START_RENEWAL'
      });
    } else if (status === 'EXPIRING_SOON') {
      recommendations.push({
        priority: 'HIGH',
        message: `KYC expires in ${daysRemaining} days. Start renewal process.`,
        action: 'START_RENEWAL'
      });
    }
    
    if (completionPercentage < 100) {
      recommendations.push({
        priority: 'MEDIUM',
        message: `${kycDocuments.length - verifiedDocs} document(s) pending verification.`,
        action: 'UPLOAD_DOCUMENTS'
      });
    }

    // Store comprehensive check log
    await prisma.complianceLog.create({
      data: {
        userId,
        type: 'REKYC_TIMER_CHECK',
        status,
        details: {
          lastKycDate,
          nextKycDue,
          daysRemaining,
          status,
          completionPercentage,
          documentsVerified: verifiedDocs,
          totalDocuments: kycDocuments.length,
          checklistCompleted: completedRequired,
          checklistRequired: requiredItems,
          hasPenalty: penalty !== null,
          penaltyAmount: penalty?.amount || 0,
          timestamp: new Date()
        }
      }
    });

    return {
      kycRequired: status !== 'VALID',
      lastKycDate,
      nextKycDue,
      daysRemaining,
      status,
      completionPercentage,
      documentsVerified: verifiedDocs,
      totalDocuments: kycDocuments.length,
      kycDocuments,
      renewalChecklist,
      completedRequired,
      requiredItems,
      estimatedRenewalDays,
      penalty,
      recommendations
    };
  }

  /**
   * Helper: Calculate distance between two coordinates (Haversine formula)
   */
  private calculateDistance(
    lat1: number, lon1: number,
    lat2: number, lon2: number
  ): number {
    const R = 6371; // Earth's radius in km
    const dLat = this.toRadians(lat2 - lat1);
    const dLon = this.toRadians(lon2 - lon1);
    
    const a = 
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.toRadians(lat1)) * Math.cos(this.toRadians(lat2)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;
    
    return Math.round(distance * 100) / 100; // Round to 2 decimal places
  }

  private toRadians(degrees: number): number {
    return degrees * (Math.PI / 180);
  }

  /**
   * Get all compliance logs for a user
   */
  async getComplianceLogs(userId: string, limit: number = 20) {
    return prisma.complianceLog.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: limit
    });
  }
}
