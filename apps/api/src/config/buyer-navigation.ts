/**
 * Buyer Dashboard Navigation Configuration
 * All 10 buyer features with icons, paths, and descriptions
 */

export interface NavigationItem {
  id: number;
  name: string;
  icon: string;
  path: string;
  description: string;
  badge?: string | number;
  showBalance?: boolean;
  children?: NavigationItem[];
}

export const buyerNavigation: NavigationItem[] = [
  {
    id: 1,
    name: 'Dashboard',
    icon: 'HomeIcon',
    path: '/buyer/dashboard',
    description: 'Overview stats and analytics'
  },
  {
    id: 2,
    name: 'KYC Verification',
    icon: 'ShieldCheckIcon',
    path: '/buyer/kyc',
    description: 'Business KYC & GST verification',
    badge: 'Required'
  },
  {
    id: 3,
    name: 'Wallet',
    icon: 'WalletIcon',
    path: '/buyer/wallet',
    description: 'Manage funds and transactions',
    showBalance: true
  },
  {
    id: 4,
    name: 'Marketplace',
    icon: 'ShoppingCartIcon',
    path: '/buyer/marketplace',
    description: 'Browse aggregated bulk crops',
    children: [
      {
        id: 41,
        name: 'All Products',
        icon: 'ViewGridIcon',
        path: '/buyer/marketplace/products',
        description: 'Browse all available products'
      },
      {
        id: 42,
        name: 'Aggregated Lots',
        icon: 'CollectionIcon',
        path: '/buyer/marketplace/lots',
        description: 'FPO aggregated bulk crops'
      },
      {
        id: 43,
        name: 'Individual Crops',
        icon: 'UserIcon',
        path: '/buyer/marketplace/crops',
        description: 'Direct from farmers'
      }
    ]
  },
  {
    id: 5,
    name: 'My Orders',
    icon: 'ClipboardListIcon',
    path: '/buyer/orders',
    description: 'View and manage orders',
    badge: 'activeOrdersCount'
  },
  {
    id: 6,
    name: 'Order Tracking',
    icon: 'TruckIcon',
    path: '/buyer/tracking',
    description: 'Real-time delivery tracking'
  },
  {
    id: 7,
    name: 'Escrow',
    icon: 'LockClosedIcon',
    path: '/buyer/escrow',
    description: 'Secure payment management'
  },
  {
    id: 8,
    name: 'Messages',
    icon: 'ChatBubbleLeftRightIcon',
    path: '/buyer/chat',
    description: 'Chat with farmers & FPOs',
    badge: 'unreadCount'
  },
  {
    id: 9,
    name: 'Suppliers',
    icon: 'UsersIcon',
    path: '/buyer/suppliers',
    description: 'View and manage suppliers'
  },
  {
    id: 10,
    name: 'Analytics',
    icon: 'ChartBarIcon',
    path: '/buyer/analytics',
    description: 'Spending and performance analytics'
  }
];

/**
 * Quick Actions for Dashboard
 */
export const quickActions = [
  {
    id: 1,
    name: 'Add Funds',
    icon: 'PlusCircleIcon',
    action: 'openAddFundsModal',
    color: 'green'
  },
  {
    id: 2,
    name: 'Browse Products',
    icon: 'ShoppingCartIcon',
    path: '/buyer/marketplace',
    color: 'blue'
  },
  {
    id: 3,
    name: 'Track Order',
    icon: 'TruckIcon',
    path: '/buyer/tracking',
    color: 'purple'
  },
  {
    id: 4,
    name: 'Contact Supplier',
    icon: 'ChatIcon',
    path: '/buyer/chat',
    color: 'orange'
  }
];

/**
 * Feature Status Badges
 */
export const featureStatus = {
  kyc: {
    verified: { text: 'Verified', color: 'green' },
    pending: { text: 'Pending', color: 'yellow' },
    required: { text: 'Required', color: 'red' }
  },
  order: {
    pending: { text: 'Pending', color: 'yellow' },
    confirmed: { text: 'Confirmed', color: 'blue' },
    inTransit: { text: 'In Transit', color: 'purple' },
    delivered: { text: 'Delivered', color: 'green' },
    cancelled: { text: 'Cancelled', color: 'red' }
  },
  escrow: {
    held: { text: 'Held', color: 'yellow' },
    released: { text: 'Released', color: 'green' },
    refunded: { text: 'Refunded', color: 'blue' }
  }
};

/**
 * Get navigation item by path
 */
export const getNavigationByPath = (path: string): NavigationItem | undefined => {
  for (const item of buyerNavigation) {
    if (item.path === path) return item;
    if (item.children) {
      const child = item.children.find(c => c.path === path);
      if (child) return child;
    }
  }
  return undefined;
};

/**
 * Get active navigation items based on user permissions
 */
export const getActiveNavigation = (userPermissions: string[]): NavigationItem[] => {
  return buyerNavigation.filter(item => {
    // All items are available for buyers by default
    return true;
  });
};
