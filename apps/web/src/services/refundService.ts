const DUMMY_REFUNDS = [
  {
    id: 'REF-001',
    orderId: 'ORD-12338',
    amount: 8000,
    reason: 'Delivery Failed',
    description: 'Delivery was delayed by 3 days causing product spoilage. Requesting refund for damaged goods.',
    status: 'completed',
    requestedAt: '2024-01-05T09:00:00Z',
    processedAt: '2024-01-08T15:00:00Z',
    evidence: ['spoilage_photos.jpg', 'delivery_tracking.pdf'],
    adminNotes: 'Refund approved. Compensation of 20% of order value credited.'
  },
  {
    id: 'REF-002',
    orderId: 'ORD-12350',
    amount: 15000,
    reason: 'Quality Issue',
    description: 'Buyer rejected the produce citing quality issues not matching the agreed standards.',
    status: 'pending',
    requestedAt: '2024-01-14T11:30:00Z',
    evidence: ['quality_report.pdf', 'buyer_complaint.pdf'],
    adminNotes: null
  },
  {
    id: 'REF-003',
    orderId: 'ORD-12351',
    amount: 25000,
    reason: 'Order Cancelled',
    description: 'Buyer cancelled the order before delivery. Requesting refund of advance payment.',
    status: 'approved',
    requestedAt: '2024-01-12T14:00:00Z',
    processedAt: '2024-01-13T10:00:00Z',
    evidence: ['cancellation_notice.pdf'],
    adminNotes: 'Approved. Refund will be processed within 3-5 business days.'
  },
  {
    id: 'REF-004',
    orderId: 'ORD-12352',
    amount: 5000,
    reason: 'Payment Error',
    description: 'Double payment was made due to technical error. Requesting refund of duplicate payment.',
    status: 'processing',
    requestedAt: '2024-01-11T16:20:00Z',
    evidence: ['payment_receipts.pdf'],
    adminNotes: 'Verified. Processing refund.'
  },
  {
    id: 'REF-005',
    orderId: 'ORD-12353',
    amount: 12000,
    reason: 'Quality Issue',
    description: 'Product quality did not meet the specifications mentioned in the contract.',
    status: 'rejected',
    requestedAt: '2024-01-09T10:00:00Z',
    processedAt: '2024-01-10T14:00:00Z',
    evidence: ['product_photos.jpg'],
    adminNotes: 'Rejected. Quality inspection report shows product meets Grade B standards as per contract.'
  },
  {
    id: 'REF-006',
    orderId: 'ORD-12354',
    amount: 18000,
    reason: 'Delivery Failed',
    description: 'Logistics partner failed to deliver on time, causing order cancellation.',
    status: 'pending',
    requestedAt: '2024-01-15T09:30:00Z',
    evidence: ['logistics_report.pdf', 'cancellation_email.pdf'],
    adminNotes: null
  },
  {
    id: 'REF-007',
    orderId: 'ORD-12355',
    amount: 7500,
    reason: 'Other',
    description: 'Incorrect product was delivered. Buyer refused to accept.',
    status: 'completed',
    requestedAt: '2024-01-03T12:00:00Z',
    processedAt: '2024-01-05T16:00:00Z',
    evidence: ['delivery_receipt.pdf', 'product_mismatch.jpg'],
    adminNotes: 'Refund processed. Logistics partner penalized for error.'
  }
];

class RefundService {
  async getRefunds(filter: string = 'all') {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    if (filter === 'all') {
      return DUMMY_REFUNDS;
    }
    
    return DUMMY_REFUNDS.filter(r => r.status === filter);
  }

  async getRefundById(id: string) {
    await new Promise(resolve => setTimeout(resolve, 300));
    return DUMMY_REFUNDS.find(r => r.id === id);
  }

  async createRefund(data: any) {
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const newRefund = {
      id: `REF-${String(DUMMY_REFUNDS.length + 1).padStart(3, '0')}`,
      ...data,
      status: 'pending',
      requestedAt: new Date().toISOString(),
      adminNotes: null
    };
    
    return newRefund;
  }

  async cancelRefund(refundId: string) {
    await new Promise(resolve => setTimeout(resolve, 500));
    return { success: true, message: 'Refund request cancelled' };
  }

  async uploadEvidence(refundId: string, files: File[]) {
    await new Promise(resolve => setTimeout(resolve, 1000));
    return { success: true, files: files.map(f => f.name) };
  }
}

export const refundService = new RefundService();
