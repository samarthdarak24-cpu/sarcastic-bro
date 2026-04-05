// Dispute Service with dummy data
const DUMMY_DISPUTES = [
  {
    id: 'DSP-001',
    orderId: 'ORD-12345',
    type: 'quality' as const,
    status: 'open' as const,
    priority: 'high' as const,
    amount: 15000,
    description: 'Received tomatoes do not match the quality grade specified in the contract. Expected Grade A, received Grade B.',
    createdAt: '2024-01-15T10:30:00Z',
    evidence: ['quality_report.pdf', 'product_photos.jpg', 'contract_copy.pdf'],
    messages: [
      {
        id: 'MSG-001',
        sender: 'Farmer (You)',
        message: 'I have uploaded evidence showing the quality mismatch. Please review.',
        timestamp: '2024-01-15T10:35:00Z'
      },
      {
        id: 'MSG-002',
        sender: 'Support Team',
        message: 'We have received your dispute and are reviewing the evidence. A resolution specialist will be assigned within 24 hours.',
        timestamp: '2024-01-15T11:00:00Z'
      }
    ]
  },
  {
    id: 'DSP-002',
    orderId: 'ORD-12340',
    type: 'payment' as const,
    status: 'in_review' as const,
    priority: 'critical' as const,
    amount: 45000,
    description: 'Payment not received even after 7 days of delivery confirmation. Contract specified payment within 3 days.',
    createdAt: '2024-01-10T14:20:00Z',
    evidence: ['delivery_receipt.pdf', 'contract.pdf', 'bank_statement.pdf'],
    messages: [
      {
        id: 'MSG-003',
        sender: 'Farmer (You)',
        message: 'Payment is overdue by 4 days. This is affecting my cash flow.',
        timestamp: '2024-01-10T14:25:00Z'
      },
      {
        id: 'MSG-004',
        sender: 'Resolution Specialist',
        message: 'We are investigating this with the buyer. Payment should be processed within 48 hours.',
        timestamp: '2024-01-11T09:00:00Z'
      },
      {
        id: 'MSG-005',
        sender: 'Buyer',
        message: 'Apologies for the delay. There was a banking issue. Payment has been initiated.',
        timestamp: '2024-01-12T16:30:00Z'
      }
    ]
  },
  {
    id: 'DSP-003',
    orderId: 'ORD-12338',
    type: 'delivery' as const,
    status: 'resolved' as const,
    priority: 'medium' as const,
    amount: 8000,
    description: 'Delivery was delayed by 3 days causing product spoilage.',
    createdAt: '2024-01-05T09:00:00Z',
    resolvedAt: '2024-01-08T15:00:00Z',
    evidence: ['logistics_tracking.pdf', 'spoilage_photos.jpg'],
    messages: [
      {
        id: 'MSG-006',
        sender: 'Farmer (You)',
        message: 'The logistics partner delayed delivery causing 20% spoilage.',
        timestamp: '2024-01-05T09:10:00Z'
      },
      {
        id: 'MSG-007',
        sender: 'Logistics Team',
        message: 'We acknowledge the delay due to vehicle breakdown. Compensation will be provided.',
        timestamp: '2024-01-06T10:00:00Z'
      }
    ],
    resolution: 'Compensation of ₹1,600 (20% of order value) has been credited to your account for the spoilage caused by delivery delay.'
  },
  {
    id: 'DSP-004',
    orderId: 'ORD-12335',
    type: 'contract' as const,
    status: 'escalated' as const,
    priority: 'critical' as const,
    amount: 75000,
    description: 'Buyer is refusing to accept delivery citing reasons not mentioned in the contract.',
    createdAt: '2024-01-12T11:00:00Z',
    evidence: ['contract.pdf', 'delivery_attempt.pdf', 'communication_log.pdf'],
    messages: [
      {
        id: 'MSG-008',
        sender: 'Farmer (You)',
        message: 'Buyer is refusing delivery without valid reason. This is a breach of contract.',
        timestamp: '2024-01-12T11:15:00Z'
      },
      {
        id: 'MSG-009',
        sender: 'Legal Team',
        message: 'This case has been escalated to our legal department. We will review the contract terms.',
        timestamp: '2024-01-13T09:00:00Z'
      },
      {
        id: 'MSG-010',
        sender: 'Buyer',
        message: 'Market prices have dropped significantly. We need to renegotiate.',
        timestamp: '2024-01-13T14:00:00Z'
      },
      {
        id: 'MSG-011',
        sender: 'Legal Team',
        message: 'Contract terms are binding. Buyer must accept delivery or pay cancellation penalty.',
        timestamp: '2024-01-14T10:00:00Z'
      }
    ]
  },
  {
    id: 'DSP-005',
    orderId: 'ORD-12330',
    type: 'quality' as const,
    status: 'resolved' as const,
    priority: 'low' as const,
    amount: 3500,
    description: 'Minor packaging damage during transit.',
    createdAt: '2024-01-03T16:00:00Z',
    resolvedAt: '2024-01-04T12:00:00Z',
    evidence: ['packaging_photos.jpg'],
    messages: [
      {
        id: 'MSG-012',
        sender: 'Buyer',
        message: 'Some boxes arrived with minor damage but product is intact.',
        timestamp: '2024-01-03T16:10:00Z'
      },
      {
        id: 'MSG-013',
        sender: 'Farmer (You)',
        message: 'I can provide replacement packaging if needed.',
        timestamp: '2024-01-03T17:00:00Z'
      }
    ],
    resolution: 'Both parties agreed that product quality is acceptable. No compensation required.'
  }
];

class DisputeService {
  async getDisputes(filter: string = 'all') {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    if (filter === 'all') {
      return DUMMY_DISPUTES;
    }
    
    return DUMMY_DISPUTES.filter(d => d.status === filter);
  }

  async getDisputeById(id: string) {
    await new Promise(resolve => setTimeout(resolve, 300));
    return DUMMY_DISPUTES.find(d => d.id === id);
  }

  async createDispute(data: any) {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const newDispute = {
      id: `DSP-${String(DUMMY_DISPUTES.length + 1).padStart(3, '0')}`,
      ...data,
      status: 'open' as const,
      priority: 'medium' as const,
      createdAt: new Date().toISOString(),
      messages: []
    };
    
    return newDispute;
  }

  async sendMessage(disputeId: string, message: string) {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    return {
      id: `MSG-${Date.now()}`,
      sender: 'Farmer (You)',
      message,
      timestamp: new Date().toISOString()
    };
  }

  async updateDisputeStatus(disputeId: string, status: string) {
    await new Promise(resolve => setTimeout(resolve, 300));
    return { success: true, status };
  }

  async uploadEvidence(disputeId: string, file: File) {
    await new Promise(resolve => setTimeout(resolve, 800));
    return { success: true, filename: file.name };
  }
}

export const disputeService = new DisputeService();
