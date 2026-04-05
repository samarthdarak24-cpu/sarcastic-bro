const DUMMY_TRANSACTIONS = [
  {
    id: 'TXN-001',
    type: 'credit',
    amount: 50000,
    description: 'Payment received from Reliance Fresh',
    category: 'Sales',
    status: 'Completed',
    timestamp: '2024-01-19T14:30:00Z',
    icon: '💰',
    orderId: 'ORD-12345',
    paymentMethod: 'Bank Transfer',
    referenceNumber: 'REF123456789'
  },
  {
    id: 'TXN-002',
    type: 'debit',
    amount: 5000,
    description: 'Platform commission fee',
    category: 'Fees',
    status: 'Completed',
    timestamp: '2024-01-19T14:35:00Z',
    icon: '💳',
    paymentMethod: 'Auto-deduct'
  },
  {
    id: 'TXN-003',
    type: 'credit',
    amount: 35000,
    description: 'Payment received from BigBasket',
    category: 'Sales',
    status: 'Completed',
    timestamp: '2024-01-18T10:15:00Z',
    icon: '💰',
    orderId: 'ORD-12346',
    paymentMethod: 'UPI',
    referenceNumber: 'UPI987654321'
  },
  {
    id: 'TXN-004',
    type: 'debit',
    amount: 12000,
    description: 'Logistics charges',
    category: 'Logistics',
    status: 'Completed',
    timestamp: '2024-01-17T16:20:00Z',
    icon: '🚚',
    paymentMethod: 'Bank Transfer'
  },
  {
    id: 'TXN-005',
    type: 'refund',
    amount: 8000,
    description: 'Refund for cancelled order',
    category: 'Refunds',
    status: 'Completed',
    timestamp: '2024-01-16T11:00:00Z',
    icon: '↩️',
    orderId: 'ORD-12338',
    paymentMethod: 'Bank Transfer',
    referenceNumber: 'REF555666777'
  },
  {
    id: 'TXN-006',
    type: 'credit',
    amount: 120000,
    description: 'Payment received from Walmart India',
    category: 'Sales',
    status: 'Completed',
    timestamp: '2024-01-15T09:30:00Z',
    icon: '💰',
    orderId: 'ORD-12348',
    paymentMethod: 'NEFT',
    referenceNumber: 'NEFT111222333'
  },
  {
    id: 'TXN-007',
    type: 'debit',
    amount: 3500,
    description: 'Quality inspection fee',
    category: 'Fees',
    status: 'Completed',
    timestamp: '2024-01-14T14:00:00Z',
    icon: '🔍',
    paymentMethod: 'Auto-deduct'
  },
  {
    id: 'TXN-008',
    type: 'credit',
    amount: 75000,
    description: 'Payment received from DMart',
    category: 'Sales',
    status: 'Pending',
    timestamp: '2024-01-13T16:45:00Z',
    icon: '💰',
    orderId: 'ORD-12347',
    paymentMethod: 'Bank Transfer'
  },
  {
    id: 'TXN-009',
    type: 'debit',
    amount: 8500,
    description: 'Packaging materials',
    category: 'Supplies',
    status: 'Completed',
    timestamp: '2024-01-12T10:00:00Z',
    icon: '📦',
    paymentMethod: 'UPI'
  },
  {
    id: 'TXN-010',
    type: 'credit',
    amount: 45000,
    description: 'Payment received from More Supermarket',
    category: 'Sales',
    status: 'Completed',
    timestamp: '2024-01-11T13:20:00Z',
    icon: '💰',
    orderId: 'ORD-12340',
    paymentMethod: 'UPI',
    referenceNumber: 'UPI444555666'
  },
  {
    id: 'TXN-011',
    type: 'fee',
    amount: 2500,
    description: 'Payment gateway charges',
    category: 'Fees',
    status: 'Completed',
    timestamp: '2024-01-11T13:25:00Z',
    icon: '💳',
    paymentMethod: 'Auto-deduct'
  },
  {
    id: 'TXN-012',
    type: 'credit',
    amount: 250000,
    description: 'Payment received from FCI',
    category: 'Sales',
    status: 'Processing',
    timestamp: '2024-01-10T11:00:00Z',
    icon: '💰',
    orderId: 'ORD-12349',
    paymentMethod: 'RTGS'
  }
];

class TransactionService {
  async getTransactions(filter: any) {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    let filtered = DUMMY_TRANSACTIONS;
    
    if (filter.type !== 'all') {
      filtered = filtered.filter(t => t.type === filter.type);
    }
    
    // Filter by period
    const now = new Date();
    const periodDays = {
      '7days': 7,
      '30days': 30,
      '90days': 90,
      '1year': 365,
      'all': Infinity
    };
    
    const days = periodDays[filter.period as keyof typeof periodDays] || 30;
    if (days !== Infinity) {
      const cutoffDate = new Date(now.getTime() - days * 24 * 60 * 60 * 1000);
      filtered = filtered.filter(t => new Date(t.timestamp) >= cutoffDate);
    }
    
    return filtered;
  }

  async getTransactionById(id: string) {
    await new Promise(resolve => setTimeout(resolve, 300));
    return DUMMY_TRANSACTIONS.find(t => t.id === id);
  }

  async exportTransactions(format: 'csv' | 'pdf') {
    await new Promise(resolve => setTimeout(resolve, 1000));
    return { success: true, downloadUrl: '/downloads/transactions.' + format };
  }
}

export const transactionService = new TransactionService();
