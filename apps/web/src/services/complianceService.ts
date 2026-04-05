const DUMMY_COMPLIANCE_DATA = {
  overallScore: 82,
  compliantCount: 18,
  pendingCount: 5,
  nonCompliantCount: 2,
  activeCertificates: 12,
  expiringCount: 3,
  violations: 2,
  auditsCompleted: 8,
  categories: [
    {
      id: 'food-safety',
      name: 'Food Safety Standards',
      icon: '🍎',
      status: 'compliant',
      completionRate: 95,
      compliantItems: 19,
      totalItems: 20,
      requirements: [
        {
          id: 'fs1',
          title: 'FSSAI License',
          description: 'Valid Food Safety and Standards Authority of India license',
          status: 'compliant',
          priority: 'high',
          lastUpdated: '2024-01-10T00:00:00Z',
          expiryDate: '2025-06-30T00:00:00Z',
          documents: ['FSSAI_License_2024.pdf']
        },
        {
          id: 'fs2',
          title: 'Pesticide Residue Testing',
          description: 'Regular testing for pesticide residues in produce',
          status: 'compliant',
          priority: 'high',
          lastUpdated: '2024-01-12T00:00:00Z',
          documents: ['Pesticide_Test_Report_Jan2024.pdf']
        },
        {
          id: 'fs3',
          title: 'Storage Facility Inspection',
          description: 'Annual inspection of storage facilities',
          status: 'pending',
          priority: 'medium',
          lastUpdated: '2023-12-15T00:00:00Z',
          expiryDate: '2024-02-15T00:00:00Z',
          documents: []
        }
      ]
    },
    {
      id: 'organic',
      name: 'Organic Certification',
      icon: '🌱',
      status: 'compliant',
      completionRate: 100,
      compliantItems: 8,
      totalItems: 8,
      requirements: [
        {
          id: 'oc1',
          title: 'Organic India Certification',
          description: 'Valid organic farming certification',
          status: 'compliant',
          priority: 'high',
          lastUpdated: '2024-01-05T00:00:00Z',
          expiryDate: '2025-03-31T00:00:00Z',
          documents: ['Organic_Certificate_2024.pdf']
        },
        {
          id: 'oc2',
          title: 'Soil Testing Report',
          description: 'Annual soil quality and organic content testing',
          status: 'compliant',
          priority: 'medium',
          lastUpdated: '2024-01-08T00:00:00Z',
          documents: ['Soil_Test_Report_2024.pdf']
        }
      ]
    },
    {
      id: 'quality',
      name: 'Quality Standards',
      icon: '⭐',
      status: 'partially-compliant',
      completionRate: 75,
      compliantItems: 6,
      totalItems: 8,
      requirements: [
        {
          id: 'qs1',
          title: 'ISO 22000 Certification',
          description: 'Food safety management system certification',
          status: 'compliant',
          priority: 'high',
          lastUpdated: '2023-11-20T00:00:00Z',
          expiryDate: '2024-11-20T00:00:00Z',
          documents: ['ISO_22000_Certificate.pdf']
        },
        {
          id: 'qs2',
          title: 'Quality Grading System',
          description: 'Implementation of standardized quality grading',
          status: 'non-compliant',
          priority: 'medium',
          lastUpdated: '2023-12-01T00:00:00Z',
          documents: []
        },
        {
          id: 'qs3',
          title: 'Traceability System',
          description: 'Product traceability from farm to market',
          status: 'pending',
          priority: 'high',
          lastUpdated: '2024-01-01T00:00:00Z',
          documents: []
        }
      ]
    },
    {
      id: 'environmental',
      name: 'Environmental Compliance',
      icon: '🌍',
      status: 'compliant',
      completionRate: 88,
      compliantItems: 7,
      totalItems: 8,
      requirements: [
        {
          id: 'ec1',
          title: 'Water Usage Permit',
          description: 'Valid permit for agricultural water usage',
          status: 'compliant',
          priority: 'high',
          lastUpdated: '2024-01-03T00:00:00Z',
          expiryDate: '2025-12-31T00:00:00Z',
          documents: ['Water_Permit_2024.pdf']
        },
        {
          id: 'ec2',
          title: 'Waste Management Plan',
          description: 'Approved agricultural waste management plan',
          status: 'compliant',
          priority: 'medium',
          lastUpdated: '2023-12-20T00:00:00Z',
          documents: ['Waste_Management_Plan.pdf']
        },
        {
          id: 'ec3',
          title: 'Carbon Footprint Assessment',
          description: 'Annual carbon footprint calculation and reporting',
          status: 'pending',
          priority: 'low',
          lastUpdated: '2023-11-15T00:00:00Z',
          documents: []
        }
      ]
    },
    {
      id: 'labor',
      name: 'Labor Standards',
      icon: '👷',
      status: 'compliant',
      completionRate: 90,
      compliantItems: 9,
      totalItems: 10,
      requirements: [
        {
          id: 'ls1',
          title: 'Labor Law Compliance',
          description: 'Adherence to minimum wage and working hours',
          status: 'compliant',
          priority: 'high',
          lastUpdated: '2024-01-01T00:00:00Z',
          documents: ['Labor_Compliance_Report.pdf']
        },
        {
          id: 'ls2',
          title: 'Worker Safety Training',
          description: 'Regular safety training for farm workers',
          status: 'compliant',
          priority: 'high',
          lastUpdated: '2023-12-10T00:00:00Z',
          documents: ['Safety_Training_Records.pdf']
        },
        {
          id: 'ls3',
          title: 'Insurance Coverage',
          description: 'Valid insurance for all farm workers',
          status: 'pending',
          priority: 'medium',
          lastUpdated: '2023-12-01T00:00:00Z',
          expiryDate: '2024-03-31T00:00:00Z',
          documents: []
        }
      ]
    },
    {
      id: 'financial',
      name: 'Financial Compliance',
      icon: '💰',
      status: 'compliant',
      completionRate: 100,
      compliantItems: 6,
      totalItems: 6,
      requirements: [
        {
          id: 'fc1',
          title: 'GST Registration',
          description: 'Valid GST registration and filing',
          status: 'compliant',
          priority: 'high',
          lastUpdated: '2024-01-15T00:00:00Z',
          documents: ['GST_Certificate.pdf']
        },
        {
          id: 'fc2',
          title: 'Income Tax Returns',
          description: 'Filed income tax returns for current year',
          status: 'compliant',
          priority: 'high',
          lastUpdated: '2023-07-31T00:00:00Z',
          documents: ['ITR_2023.pdf']
        },
        {
          id: 'fc3',
          title: 'Bank Account Verification',
          description: 'Verified bank account for transactions',
          status: 'compliant',
          priority: 'high',
          lastUpdated: '2024-01-01T00:00:00Z',
          documents: ['Bank_Verification.pdf']
        }
      ]
    }
  ],
  upcomingDeadlines: [
    {
      id: 'd1',
      title: 'Storage Facility Inspection',
      description: 'Annual inspection of storage facilities due',
      date: '2024-02-15T00:00:00Z',
      urgency: 'high'
    },
    {
      id: 'd2',
      title: 'Worker Insurance Renewal',
      description: 'Renew insurance coverage for farm workers',
      date: '2024-03-31T00:00:00Z',
      urgency: 'medium'
    },
    {
      id: 'd3',
      title: 'Organic Certification Renewal',
      description: 'Submit renewal application for organic certification',
      date: '2025-03-01T00:00:00Z',
      urgency: 'low'
    },
    {
      id: 'd4',
      title: 'ISO 22000 Audit',
      description: 'Annual surveillance audit for ISO 22000',
      date: '2024-11-01T00:00:00Z',
      urgency: 'medium'
    }
  ]
};

class ComplianceService {
  async getComplianceOverview() {
    await new Promise(resolve => setTimeout(resolve, 500));
    return DUMMY_COMPLIANCE_DATA;
  }

  async getCategoryDetails(categoryId: string) {
    await new Promise(resolve => setTimeout(resolve, 300));
    return DUMMY_COMPLIANCE_DATA.categories.find(c => c.id === categoryId);
  }

  async uploadDocument(requirementId: string, file: File) {
    await new Promise(resolve => setTimeout(resolve, 1000));
    return { success: true, filename: file.name };
  }

  async updateRequirementStatus(requirementId: string, status: string) {
    await new Promise(resolve => setTimeout(resolve, 500));
    return { success: true, status };
  }

  async getComplianceReport(format: 'pdf' | 'excel') {
    await new Promise(resolve => setTimeout(resolve, 1500));
    return { success: true, downloadUrl: '/downloads/compliance_report.' + format };
  }
}

export const complianceService = new ComplianceService();
