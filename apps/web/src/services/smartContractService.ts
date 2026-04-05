// Smart Contract Service with dummy data
const DUMMY_CONTRACTS = [
  {
    id: 'SC-001',
    title: 'Tomato Supply Agreement - Reliance Fresh',
    type: 'sale' as const,
    status: 'active' as const,
    parties: [
      {
        name: 'Rajesh Kumar (You)',
        role: 'Seller',
        address: 'Village Khandala, Pune, Maharashtra',
        signature: '0x7a8f9c...',
        signedAt: '2024-01-10T09:00:00Z'
      },
      {
        name: 'Reliance Fresh Pvt Ltd',
        role: 'Buyer',
        address: 'Mumbai, Maharashtra',
        signature: '0x3b4e2d...',
        signedAt: '2024-01-10T10:30:00Z'
      }
    ],
    value: 150000,
    startDate: '2024-01-15T00:00:00Z',
    endDate: '2024-04-15T00:00:00Z',
    terms: [
      {
        id: 'T1',
        title: 'Quality Standards',
        description: 'All tomatoes must be Grade A with minimum 60mm diameter',
        condition: 'IF quality_grade == "A" AND diameter >= 60',
        action: 'ACCEPT_DELIVERY'
      },
      {
        id: 'T2',
        title: 'Payment Terms',
        description: 'Payment within 3 days of delivery confirmation',
        condition: 'IF delivery_confirmed == true',
        action: 'RELEASE_PAYMENT after 3 days'
      },
      {
        id: 'T3',
        title: 'Penalty Clause',
        description: 'Late delivery penalty of 2% per day',
        condition: 'IF delivery_date > due_date',
        action: 'DEDUCT 2% * days_late FROM payment'
      }
    ],
    milestones: [
      {
        id: 'M1',
        title: 'First Delivery - 500kg',
        description: 'Deliver 500kg of Grade A tomatoes',
        dueDate: '2024-01-20T00:00:00Z',
        status: 'completed' as const,
        payment: 50000,
        autoRelease: true
      },
      {
        id: 'M2',
        title: 'Second Delivery - 500kg',
        description: 'Deliver 500kg of Grade A tomatoes',
        dueDate: '2024-02-20T00:00:00Z',
        status: 'pending' as const,
        payment: 50000,
        autoRelease: true
      },
      {
        id: 'M3',
        title: 'Final Delivery - 500kg',
        description: 'Deliver 500kg of Grade A tomatoes',
        dueDate: '2024-03-20T00:00:00Z',
        status: 'pending' as const,
        payment: 50000,
        autoRelease: true
      }
    ],
    autoExecute: true,
    blockchainHash: '0x8f3a9c2d5e7b1f4a6c8d9e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b',
    createdAt: '2024-01-08T00:00:00Z'
  },
  {
    id: 'SC-002',
    title: 'Wheat Purchase Contract - FCI',
    type: 'sale' as const,
    status: 'pending' as const,
    parties: [
      {
        name: 'Rajesh Kumar (You)',
        role: 'Seller',
        address: 'Village Khandala, Pune, Maharashtra',
        signature: '0x7a8f9c...',
        signedAt: '2024-01-12T14:00:00Z'
      },
      {
        name: 'Food Corporation of India',
        role: 'Buyer',
        address: 'New Delhi',
        signature: undefined,
        signedAt: undefined
      }
    ],
    value: 250000,
    startDate: '2024-02-01T00:00:00Z',
    endDate: '2024-05-01T00:00:00Z',
    terms: [
      {
        id: 'T1',
        title: 'MSP Guarantee',
        description: 'Purchase at Minimum Support Price of ₹2125 per quintal',
        condition: 'IF quality_approved == true',
        action: 'PAY msp_rate * quantity'
      },
      {
        id: 'T2',
        title: 'Moisture Content',
        description: 'Wheat moisture content must not exceed 12%',
        condition: 'IF moisture_content <= 12',
        action: 'ACCEPT_DELIVERY'
      }
    ],
    milestones: [
      {
        id: 'M1',
        title: 'Quality Inspection',
        description: 'FCI quality inspection and approval',
        dueDate: '2024-01-25T00:00:00Z',
        status: 'pending' as const,
        payment: 0,
        autoRelease: false
      },
      {
        id: 'M2',
        title: 'Full Delivery',
        description: 'Deliver 1000 quintals of wheat',
        dueDate: '2024-04-15T00:00:00Z',
        status: 'pending' as const,
        payment: 250000,
        autoRelease: true
      }
    ],
    autoExecute: true,
    blockchainHash: undefined,
    createdAt: '2024-01-12T00:00:00Z'
  },
  {
    id: 'SC-003',
    title: 'Land Lease Agreement',
    type: 'lease' as const,
    status: 'active' as const,
    parties: [
      {
        name: 'Rajesh Kumar (You)',
        role: 'Lessee',
        address: 'Village Khandala, Pune, Maharashtra',
        signature: '0x7a8f9c...',
        signedAt: '2023-12-01T10:00:00Z'
      },
      {
        name: 'Suresh Patil',
        role: 'Lessor',
        address: 'Village Khandala, Pune, Maharashtra',
        signature: '0x9d2e4f...',
        signedAt: '2023-12-01T11:00:00Z'
      }
    ],
    value: 120000,
    startDate: '2024-01-01T00:00:00Z',
    endDate: '2024-12-31T00:00:00Z',
    terms: [
      {
        id: 'T1',
        title: 'Monthly Rent',
        description: 'Pay ₹10,000 per month on 1st of each month',
        condition: 'IF date == 1st_of_month',
        action: 'AUTO_PAY 10000'
      },
      {
        id: 'T2',
        title: 'Late Payment Penalty',
        description: 'Late payment penalty of ₹500 per day',
        condition: 'IF payment_date > due_date',
        action: 'ADD_PENALTY 500 * days_late'
      }
    ],
    milestones: [
      {
        id: 'M1',
        title: 'January Rent',
        description: 'Monthly rent for January 2024',
        dueDate: '2024-01-01T00:00:00Z',
        status: 'completed' as const,
        payment: 10000,
        autoRelease: true
      },
      {
        id: 'M2',
        title: 'February Rent',
        description: 'Monthly rent for February 2024',
        dueDate: '2024-02-01T00:00:00Z',
        status: 'pending' as const,
        payment: 10000,
        autoRelease: true
      }
    ],
    autoExecute: true,
    blockchainHash: '0x1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b',
    createdAt: '2023-12-01T00:00:00Z'
  },
  {
    id: 'SC-004',
    title: 'Partnership Agreement - Organic Farming',
    type: 'partnership' as const,
    status: 'active' as const,
    parties: [
      {
        name: 'Rajesh Kumar (You)',
        role: 'Partner A',
        address: 'Village Khandala, Pune, Maharashtra',
        signature: '0x7a8f9c...',
        signedAt: '2024-01-05T09:00:00Z'
      },
      {
        name: 'Amit Sharma',
        role: 'Partner B',
        address: 'Village Lonavala, Pune, Maharashtra',
        signature: '0x5c6d7e...',
        signedAt: '2024-01-05T10:00:00Z'
      }
    ],
    value: 300000,
    startDate: '2024-01-10T00:00:00Z',
    endDate: '2025-01-10T00:00:00Z',
    terms: [
      {
        id: 'T1',
        title: 'Profit Sharing',
        description: 'Profits split 60-40 between partners',
        condition: 'IF profit > 0',
        action: 'DISTRIBUTE profit * 0.6 to Partner_A, profit * 0.4 to Partner_B'
      },
      {
        id: 'T2',
        title: 'Loss Sharing',
        description: 'Losses split equally between partners',
        condition: 'IF profit < 0',
        action: 'DISTRIBUTE loss * 0.5 to each partner'
      },
      {
        id: 'T3',
        title: 'Decision Making',
        description: 'Major decisions require both partners approval',
        condition: 'IF decision_type == "major"',
        action: 'REQUIRE approval from both partners'
      }
    ],
    milestones: [
      {
        id: 'M1',
        title: 'Initial Investment',
        description: 'Both partners contribute initial capital',
        dueDate: '2024-01-10T00:00:00Z',
        status: 'completed' as const,
        payment: 150000,
        autoRelease: false
      },
      {
        id: 'M2',
        title: 'Q1 Review',
        description: 'First quarter performance review',
        dueDate: '2024-04-10T00:00:00Z',
        status: 'pending' as const,
        payment: 0,
        autoRelease: false
      }
    ],
    autoExecute: true,
    blockchainHash: '0x2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c',
    createdAt: '2024-01-05T00:00:00Z'
  },
  {
    id: 'SC-005',
    title: 'Equipment Purchase - Tractor',
    type: 'purchase' as const,
    status: 'completed' as const,
    parties: [
      {
        name: 'Rajesh Kumar (You)',
        role: 'Buyer',
        address: 'Village Khandala, Pune, Maharashtra',
        signature: '0x7a8f9c...',
        signedAt: '2023-12-15T10:00:00Z'
      },
      {
        name: 'Mahindra Tractors',
        role: 'Seller',
        address: 'Pune, Maharashtra',
        signature: '0x8e9f0a...',
        signedAt: '2023-12-15T11:00:00Z'
      }
    ],
    value: 800000,
    startDate: '2023-12-15T00:00:00Z',
    endDate: '2024-06-15T00:00:00Z',
    terms: [
      {
        id: 'T1',
        title: 'EMI Payment',
        description: 'Pay ₹140,000 per month for 6 months',
        condition: 'IF date == 15th_of_month',
        action: 'AUTO_PAY 140000'
      },
      {
        id: 'T2',
        title: 'Warranty',
        description: '2-year comprehensive warranty included',
        condition: 'IF issue_reported == true AND within_warranty',
        action: 'PROVIDE_FREE_SERVICE'
      }
    ],
    milestones: [
      {
        id: 'M1',
        title: 'Down Payment',
        description: 'Initial down payment of ₹160,000',
        dueDate: '2023-12-15T00:00:00Z',
        status: 'completed' as const,
        payment: 160000,
        autoRelease: false
      },
      {
        id: 'M2',
        title: 'EMI 1-5',
        description: 'Monthly EMI payments',
        dueDate: '2024-05-15T00:00:00Z',
        status: 'completed' as const,
        payment: 700000,
        autoRelease: true
      },
      {
        id: 'M3',
        title: 'Final EMI',
        description: 'Last EMI payment',
        dueDate: '2024-06-15T00:00:00Z',
        status: 'pending' as const,
        payment: 140000,
        autoRelease: true
      }
    ],
    autoExecute: true,
    blockchainHash: '0x3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d',
    createdAt: '2023-12-15T00:00:00Z'
  }
];

class SmartContractService {
  async getContracts(filter: string = 'all') {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    if (filter === 'all') {
      return DUMMY_CONTRACTS;
    }
    
    return DUMMY_CONTRACTS.filter(c => c.status === filter);
  }

  async getContractById(id: string) {
    await new Promise(resolve => setTimeout(resolve, 300));
    return DUMMY_CONTRACTS.find(c => c.id === id);
  }

  async createContract(data: any) {
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const newContract = {
      id: `SC-${String(DUMMY_CONTRACTS.length + 1).padStart(3, '0')}`,
      ...data,
      status: 'draft' as const,
      createdAt: new Date().toISOString()
    };
    
    return newContract;
  }

  async signContract(contractId: string) {
    await new Promise(resolve => setTimeout(resolve, 1000));
    return { success: true, signature: '0x' + Math.random().toString(16).substr(2, 8) };
  }

  async deployToBlockchain(contractId: string) {
    await new Promise(resolve => setTimeout(resolve, 2000));
    return {
      success: true,
      blockchainHash: '0x' + Math.random().toString(16).substr(2, 64)
    };
  }

  async updateMilestone(contractId: string, milestoneId: string, status: string) {
    await new Promise(resolve => setTimeout(resolve, 500));
    return { success: true, status };
  }

  async terminateContract(contractId: string, reason: string) {
    await new Promise(resolve => setTimeout(resolve, 800));
    return { success: true, terminatedAt: new Date().toISOString() };
  }
}

export const smartContractService = new SmartContractService();
