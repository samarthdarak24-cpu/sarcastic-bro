/**
 * FPO Dashboard Navigation Configuration
 * All FPO features with icons, paths, and descriptions
 */

export interface NavigationItem {
  id: number;
  name: string;
  icon: string;
  path: string;
  description: string;
  badge?: string | number;
  children?: NavigationItem[];
}

export const fpoNavigation: NavigationItem[] = [
  {
    id: 1,
    name: 'Dashboard',
    icon: 'HomeIcon',
    path: '/fpo/dashboard',
    description: 'Overview stats and analytics'
  },
  {
    id: 2,
    name: 'Farmers',
    icon: 'UsersIcon',
    path: '/fpo/farmers',
    description: 'Manage FPO farmers',
    children: [
      {
        id: 21,
        name: 'All Farmers',
        icon: 'ViewListIcon',
        path: '/fpo/farmers',
        description: 'View all registered farmers'
      },
      {
        id: 22,
        name: 'Add Farmer',
        icon: 'UserPlusIcon',
        path: '/fpo/add-farmer',
        description: 'Register new farmer'
      },
      {
        id: 23,
        name: 'Farmer Requests',
        icon: 'ClipboardListIcon',
        path: '/fpo/farmer-requests',
        description: 'Pending farmer requests',
        badge: 'pendingRequestsCount'
      }
    ]
  },
  {
    id: 3,
    name: 'Products',
    icon: 'CubeIcon',
    path: '/fpo/products',
    description: 'Manage farmer products',
    children: [
      {
        id: 31,
        name: 'All Products',
        icon: 'ViewGridIcon',
        path: '/fpo/products',
        description: 'View all products'
      },
      {
        id: 32,
        name: 'Add Product',
        icon: 'PlusCircleIcon',
        path: '/fpo/add-product',
        description: 'Add product for farmer'
      },
      {
        id: 33,
        name: 'Product Categories',
        icon: 'TagIcon',
        path: '/fpo/product-categories',
        description: 'Manage product categories'
      }
    ]
  },
  {
    id: 4,
    name: 'Aggregation',
    icon: 'CollectionIcon',
    path: '/fpo/aggregation',
    description: 'Aggregate farmer products',
    children: [
      {
        id: 41,
        name: 'Eligible Products',
        icon: 'CheckCircleIcon',
        path: '/fpo/eligible-products',
        description: 'Products ready for aggregation'
      },
      {
        id: 42,
        name: 'Create Lot',
        icon: 'PlusIcon',
        path: '/fpo/create-lot',
        description: 'Create aggregated lot'
      },
      {
        id: 43,
        name: 'Aggregated Lots',
        icon: 'ArchiveIcon',
        path: '/fpo/aggregated-lots',
        description: 'View all aggregated lots'
      }
    ]
  },
  {
    id: 5,
    name: 'Quality Control',
    icon: 'ShieldCheckIcon',
    path: '/fpo/quality',
    description: 'Quality verification',
    children: [
      {
        id: 51,
        name: 'Pending Verifications',
        icon: 'ClockIcon',
        path: '/fpo/pending-verifications',
        description: 'Certificates awaiting verification',
        badge: 'pendingVerificationsCount'
      },
      {
        id: 52,
        name: 'All Certificates',
        icon: 'DocumentTextIcon',
        path: '/fpo/all-certificates',
        description: 'View all quality certificates'
      },
      {
        id: 53,
        name: 'Upload Certificate',
        icon: 'UploadIcon',
        path: '/fpo/upload-certificate',
        description: 'Upload quality certificate'
      }
    ]
  },
  {
    id: 6,
    name: 'Marketplace',
    icon: 'ShoppingBagIcon',
    path: '/fpo/marketplace',
    description: 'Publish lots to marketplace',
    children: [
      {
        id: 61,
        name: 'Published Lots',
        icon: 'EyeIcon',
        path: '/fpo/published-lots',
        description: 'View published lots'
      },
      {
        id: 62,
        name: 'Publish New Lot',
        icon: 'PaperAirplaneIcon',
        path: '/fpo/publish-new-lot',
        description: 'Publish lot to marketplace'
      }
    ]
  },
  {
    id: 7,
    name: 'Orders',
    icon: 'ClipboardListIcon',
    path: '/fpo/orders',
    description: 'Manage orders',
    badge: 'activeOrdersCount',
    children: [
      {
        id: 71,
        name: 'All Orders',
        icon: 'ViewListIcon',
        path: '/fpo/orders',
        description: 'View all orders'
      },
      {
        id: 72,
        name: 'Pending Orders',
        icon: 'ClockIcon',
        path: '/fpo/pending-orders',
        description: 'Orders awaiting confirmation',
        badge: 'pendingOrdersCount'
      },
      {
        id: 73,
        name: 'In Transit',
        icon: 'TruckIcon',
        path: '/fpo/in-transit',
        description: 'Orders in transit'
      },
      {
        id: 74,
        name: 'Delivered',
        icon: 'CheckIcon',
        path: '/fpo/delivered',
        description: 'Completed deliveries'
      }
    ]
  },
  {
    id: 8,
    name: 'Payments',
    icon: 'CurrencyRupeeIcon',
    path: '/fpo/payments',
    description: 'Manage payments',
    children: [
      {
        id: 81,
        name: 'Pending Escrow',
        icon: 'LockClosedIcon',
        path: '/fpo/pending-escrow',
        description: 'Payments in escrow',
        badge: 'pendingEscrowCount'
      },
      {
        id: 82,
        name: 'Release Payments',
        icon: 'BanknotesIcon',
        path: '/fpo/release-payments',
        description: 'Release payments to farmers'
      },
      {
        id: 83,
        name: 'Payment History',
        icon: 'DocumentTextIcon',
        path: '/fpo/payment-history',
        description: 'View payment history'
      }
    ]
  },
  {
    id: 9,
    name: 'Messages',
    icon: 'ChatBubbleLeftRightIcon',
    path: '/fpo/messages',
    description: 'Chat with buyers',
    badge: 'unreadCount',
    children: [
      {
        id: 91,
        name: 'All Conversations',
        icon: 'InboxIcon',
        path: '/fpo/conversations',
        description: 'View all conversations'
      },
      {
        id: 92,
        name: 'Unread Messages',
        icon: 'EnvelopeIcon',
        path: '/fpo/unread-messages',
        description: 'Unread messages',
        badge: 'unreadCount'
      }
    ]
  },
  {
    id: 10,
    name: 'Logistics',
    icon: 'TruckIcon',
    path: '/fpo/logistics',
    description: 'Manage logistics',
    children: [
      {
        id: 101,
        name: 'Shipment Tracking',
        icon: 'MapPinIcon',
        path: '/fpo/shipment-tracking',
        description: 'Track shipments'
      },
      {
        id: 102,
        name: 'Delivery Management',
        icon: 'ClipboardDocumentCheckIcon',
        path: '/fpo/delivery-management',
        description: 'Manage deliveries'
      }
    ]
  },
  {
    id: 11,
    name: 'Analytics',
    icon: 'ChartBarIcon',
    path: '/fpo/analytics',
    description: 'Performance analytics'
  },
  {
    id: 12,
    name: 'Settings',
    icon: 'CogIcon',
    path: '/fpo/settings',
    description: 'FPO settings'
  }
];

/**
 * Quick Actions for FPO Dashboard
 */
export const quickActions = [
  {
    id: 1,
    name: 'Add Farmer',
    icon: 'UserPlusIcon',
    path: '/fpo/add-farmer',
    color: 'green'
  },
  {
    id: 2,
    name: 'Create Lot',
    icon: 'PlusCircleIcon',
    path: '/fpo/create-lot',
    color: 'blue'
  },
  {
    id: 3,
    name: 'Publish Lot',
    icon: 'PaperAirplaneIcon',
    path: '/fpo/publish-new-lot',
    color: 'purple'
  },
  {
    id: 4,
    name: 'Release Payment',
    icon: 'BanknotesIcon',
    path: '/fpo/release-payments',
    color: 'orange'
  }
];

/**
 * Feature Status Badges
 */
export const featureStatus = {
  farmer: {
    active: { text: 'Active', color: 'green' },
    pending: { text: 'Pending', color: 'yellow' },
    inactive: { text: 'Inactive', color: 'gray' }
  },
  product: {
    listed: { text: 'Listed', color: 'blue' },
    sold: { text: 'Sold', color: 'green' },
    pending: { text: 'Pending', color: 'yellow' }
  },
  lot: {
    draft: { text: 'Draft', color: 'gray' },
    published: { text: 'Published', color: 'blue' },
    sold: { text: 'Sold', color: 'green' }
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
    released: { text: 'Released', color: 'green' }
  },
  quality: {
    pending: { text: 'Pending', color: 'yellow' },
    verified: { text: 'Verified', color: 'green' },
    rejected: { text: 'Rejected', color: 'red' }
  }
};

/**
 * Get navigation item by path
 */
export const getNavigationByPath = (path: string): NavigationItem | undefined => {
  for (const item of fpoNavigation) {
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
  return fpoNavigation.filter(item => {
    // All items are available for FPO by default
    return true;
  });
};
