const DUMMY_PAYMENTS = [
  {
    id: 'PAY-001',
    orderId: 'ORD-12345',
    buyer: 'Reliance Fresh',
    amount: 50000,
    dueDate: '2024-01-20T00:00:00Z',
    status: 'completed',
    method: 'Bank Transfer',
    completedAt: '2024-01-19T14:30:00Z'
  },
  {
    id: 'PAY-002',
    orderId: 'ORD-12346',
    buyer: 'BigBasket',
    amount: 35000,
    dueDate: '2024-01-25T00:00:00Z',
    status: 'pending',
    method: 'UPI',
    completedAt: null
  },
  {
    id: 'PAY-003',
    orderId: 'ORD-12347',
    buyer: 'DMart',
    amount: 75000,
    dueDate: '2024-01-18T00:00:00Z',
    status: 'overdue',
    method: 'Bank Transfer',
    completedAt: null
  },
  {
    id: 'PAY-004',
    orderId: 'ORD-12348',
    buyer: 'Walmart India',
    amount: 120000,
    dueDate: '2024-01-28T00:00:00Z',
    status: 'pending',
    method: 'NEFT',
    completedAt: null
  },
  {
    id: 'PAY-005',
    orderId: 'ORD-12349',
    buyer: 'FCI',
    amount: 250000,
    dueDate: '2024-01-22T00:00:00Z',
    status: 'processing',
    method: 'RTGS',
    completedAt: null
  },
  {
    id: 'PAY-006',
    orderId: 'ORD-12340',
    buyer: 'More Supermarket',
    amount: 45000,
    dueDate: '2024-01-15T00:00:00Z',
    status: 'completed',
    method: 'UPI',
    completedAt: '2024-01-15T10:00:00Z'
  },
  {
    id: 'PAY-007',
    orderId: 'ORD-12341',
    buyer: 'Spencer\'s Retail',
    amount: 28000,
    dueDate: '2024-01-12T00:00:00Z',
    status: 'failed',
    method: 'Bank Transfer',
    completedAt: null
  },
  {
    id: 'PAY-008',
    orderId: 'ORD-12342',
    buyer: 'Nature\'s Basket',
    amount: 62000,
    dueDate: '2024-02-01T00:00:00Z',
    status: 'pending',
    method: 'IMPS',
    completedAt: null
  }
];

class PaymentScheduleService {
  async getPayments(filter: string = 'all') {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    if (filter === 'all') {
      return DUMMY_PAYMENTS;
    }
    
    return DUMMY_PAYMENTS.filter(p => p.status === filter);
  }

  async getPaymentById(id: string) {
    await new Promise(resolve => setTimeout(resolve, 300));
    return DUMMY_PAYMENTS.find(p => p.id === id);
  }

  async sendReminder(paymentId: string) {
    await new Promise(resolve => setTimeout(resolve, 500));
    return { success: true, message: 'Reminder sent successfully' };
  }

  async escalatePayment(paymentId: string) {
    await new Promise(resolve => setTimeout(resolve, 500));
    return { success: true, message: 'Payment escalated to support team' };
  }
}

export const paymentScheduleService = new PaymentScheduleService();
