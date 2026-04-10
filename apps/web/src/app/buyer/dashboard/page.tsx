'use client';

import { Suspense, type ReactNode, useCallback, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';
import type { LucideIcon } from 'lucide-react';
import {
  ArrowRight,
  BarChart3,
  Building2,
  CheckCircle2,
  DollarSign,
  FileCheck,
  Loader2,
  MapPin,
  MessageCircle,
  Package,
  ShoppingBag,
  Store,
  Truck,
  Users,
  Wallet,
} from 'lucide-react';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import OrdersSection from '@/components/buyer/OrdersSection';
import WalletSection from '@/components/buyer/WalletSection';
import DeliveryConfirmationModal from '@/components/buyer/DeliveryConfirmationModal';
import BuyerQualityCertificate from '@/components/dashboard/buyer/QualityCertificate';
import KYC from '@/components/dashboard/buyer/KYC';
import { useWallet } from '@/hooks/useWallet';
import { authService } from '@/services/auth';
import buyerAPI, { Order } from '@/services/buyer';
import buyerService from '@/services/buyerService';

type DashboardStats = {
  totalOrders: number;
  activeOrders: number;
  deliveredOrders: number;
  pendingDelivery: number;
  totalSpend: number;
  activeSuppliers: number;
};

type SupplierSummary = {
  id: string;
  name: string;
  orders: number;
  totalSpent: number;
};

type SpendingBreakdown = {
  category: string;
  amount: number;
  percentage: number;
};

type SpendingOverview = {
  period: string;
  totalSpent: number;
  orderCount: number;
  averageOrderValue: number;
  categoryBreakdown: SpendingBreakdown[];
};

type ConversationSummary = {
  partnerId: string;
  partnerName: string;
  partnerRole: string;
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
};

type EscrowOrderSummary = {
  id: string;
  amount: number;
  status: string;
  createdAt: string;
  order?: {
    id?: string;
    crop?: { cropName?: string };
    lot?: { cropName?: string };
    product?: { name?: string };
  };
};

type MarketTrend = {
  name: string;
  price: number;
  change: number;
  available?: string;
};

type SectionStat = {
  label: string;
  value: string;
};

const DEFAULT_MARKET_TRENDS: MarketTrend[] = [
  { name: 'Tomatoes', price: 42, change: 8.4, available: '2.5T' },
  { name: 'Potatoes', price: 28, change: -3.1, available: '5T' },
  { name: 'Wheat', price: 35, change: 5.2, available: '10T' },
  { name: 'Rice', price: 48, change: 12.5, available: '8T' },
  { name: 'Onions', price: 32, change: -2.4, available: '3T' },
  { name: 'Carrots', price: 38, change: 6.8, available: '1.5T' },
];

function formatCurrency(amount: number) {
  return `Rs. ${Math.round(amount).toLocaleString('en-IN')}`;
}

function formatCompactCurrency(amount: number) {
  const absoluteAmount = Math.abs(amount);

  if (absoluteAmount >= 100000) {
    return `Rs. ${(amount / 100000).toFixed(1)}L`;
  }

  if (absoluteAmount >= 1000) {
    return `Rs. ${(amount / 1000).toFixed(1)}K`;
  }

  return formatCurrency(amount);
}

function getOrdersFromResponse(response: any): Order[] {
  return response?.data?.orders || response?.data?.data?.orders || response?.data || [];
}

function getEscrowsFromResponse(response: any): EscrowOrderSummary[] {
  return response?.data?.escrows || response?.data?.data?.escrows || response?.data || [];
}

function getConversationsFromResponse(response: any): ConversationSummary[] {
  return response?.data?.data || response?.data || [];
}

function getMarketTrendsFromResponse(response: any): MarketTrend[] {
  const payload = response?.data?.data || response?.data || [];
  return Array.isArray(payload) ? payload : DEFAULT_MARKET_TRENDS;
}

function getOrderTitle(order: Order) {
  return order.crop?.cropName || order.lot?.cropName || 'Produce order';
}

function getOrderSubtitle(order: Order) {
  if (order.crop?.variety) {
    return order.crop.variety;
  }

  if (order.lot?.fpo?.name) {
    return order.lot.fpo.name;
  }

  return 'Supplier details available in order view';
}

function getEscrowTitle(escrow: EscrowOrderSummary) {
  return (
    escrow.order?.product?.name ||
    escrow.order?.crop?.cropName ||
    escrow.order?.lot?.cropName ||
    'Protected order'
  );
}

function buildOrderStats(orders: Order[]): DashboardStats {
  const activeOrders = orders.filter((order) =>
    ['PENDING', 'CONFIRMED', 'IN_TRANSIT'].includes(order.status),
  ).length;
  const deliveredOrders = orders.filter((order) => order.status === 'DELIVERED').length;
  const pendingDelivery = orders.filter(
    (order) => order.status === 'DELIVERED' && !order.confirmedByBuyer,
  ).length;
  const totalSpend = orders
    .filter((order) => order.status === 'DELIVERED')
    .reduce((sum, order) => sum + order.totalAmount, 0);
  const supplierIds = new Set(
    orders.flatMap((order) => [order.cropId, order.lotId].filter(Boolean) as string[]),
  );

  return {
    totalOrders: orders.length,
    activeOrders,
    deliveredOrders,
    pendingDelivery,
    totalSpend,
    activeSuppliers: supplierIds.size,
  };
}

function SectionHero({
  eyebrow,
  title,
  description,
  gradient,
  icon: Icon,
  stats,
  highlights,
  actions,
}: {
  eyebrow: string;
  title: string;
  description: string;
  gradient: string;
  icon: LucideIcon;
  stats: SectionStat[];
  highlights: string[];
  actions?: ReactNode;
}) {
  return (
    <div className={`relative overflow-hidden rounded-[36px] bg-gradient-to-br ${gradient} p-8 text-white shadow-xl`}>
      <div className="absolute -right-16 -top-20 h-56 w-56 rounded-full bg-white/10 blur-2xl" />
      <div className="absolute -bottom-24 left-0 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
      <div className="relative z-10">
        <div className="flex flex-col gap-6 xl:flex-row xl:items-start xl:justify-between">
          <div className="max-w-3xl">
            <div className="inline-flex rounded-full bg-white/15 px-4 py-1 text-xs font-semibold uppercase tracking-[0.28em] text-white/90">
              {eyebrow}
            </div>
            <h1 className="mt-4 text-4xl font-black tracking-tight md:text-5xl">{title}</h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-white/85 md:text-base">{description}</p>
            <div className="mt-5 flex flex-wrap gap-2">
              {highlights.map((highlight) => (
                <span
                  key={highlight}
                  className="rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-medium text-white/90"
                >
                  {highlight}
                </span>
              ))}
            </div>
          </div>
          <div className="flex flex-col items-start gap-4 xl:items-end">
            <div className="flex h-16 w-16 items-center justify-center rounded-[24px] bg-white/15 shadow-lg shadow-black/10 backdrop-blur">
              <Icon className="h-8 w-8 text-white" />
            </div>
            {actions}
          </div>
        </div>
        <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="rounded-[24px] border border-white/20 bg-white/10 px-5 py-4 backdrop-blur"
            >
              <p className="text-2xl font-black md:text-3xl">{stat.value}</p>
              <p className="mt-1 text-sm text-white/80">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function SurfaceCard({
  title,
  description,
  children,
  className = '',
}: {
  title: string;
  description?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={`rounded-[32px] border border-slate-200 bg-white p-6 shadow-sm ${className}`}>
      <div className="mb-5">
        <h3 className="text-xl font-black text-slate-900">{title}</h3>
        {description && <p className="mt-1 text-sm text-slate-500">{description}</p>}
      </div>
      {children}
    </div>
  );
}

function EmptyPanel({
  icon: Icon,
  title,
  description,
}: {
  icon: LucideIcon;
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-[28px] border border-dashed border-slate-300 bg-slate-50 px-8 py-14 text-center">
      <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-white shadow-sm">
        <Icon className="h-8 w-8 text-slate-400" />
      </div>
      <h4 className="text-lg font-black text-slate-900">{title}</h4>
      <p className="mx-auto mt-2 max-w-md text-sm text-slate-500">{description}</p>
    </div>
  );
}

function BuyerDashboardContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const selectedSection = searchParams.get('section') || 'dashboard';
  const {
    wallet,
    transactions,
    loading: walletLoading,
    fetchWallet,
    fetchTransactions,
    addFunds,
  } = useWallet();

  const [userName, setUserName] = useState('Buyer');
  const [orders, setOrders] = useState<Order[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [dashboardLoading, setDashboardLoading] = useState(true);
  const [stats, setStats] = useState<DashboardStats>({
    totalOrders: 0,
    activeOrders: 0,
    deliveredOrders: 0,
    pendingDelivery: 0,
    totalSpend: 0,
    activeSuppliers: 0,
  });
  const [topSuppliers, setTopSuppliers] = useState<SupplierSummary[]>([]);
  const [spendingOverview, setSpendingOverview] = useState<SpendingOverview | null>(null);
  const [marketTrends, setMarketTrends] = useState<MarketTrend[]>(DEFAULT_MARKET_TRENDS);
  const [escrowOrders, setEscrowOrders] = useState<EscrowOrderSummary[]>([]);
  const [escrowLoading, setEscrowLoading] = useState(false);
  const [conversations, setConversations] = useState<ConversationSummary[]>([]);
  const [chatLoading, setChatLoading] = useState(false);
  const [selectedApprovalOrder, setSelectedApprovalOrder] = useState<Order | null>(null);

  const syncOrders = useCallback((nextOrders: Order[]) => {
    setOrders(nextOrders);
    setStats(buildOrderStats(nextOrders));
  }, []);

  const refreshOrders = useCallback(async () => {
    setOrdersLoading(true);
    try {
      const response = await buyerAPI.getOrders();
      syncOrders(getOrdersFromResponse(response));
    } catch (error) {
      console.error('Failed to fetch buyer orders:', error);
    } finally {
      setOrdersLoading(false);
    }
  }, [syncOrders]);

  const refreshEscrows = useCallback(async () => {
    setEscrowLoading(true);
    try {
      const response = await buyerAPI.getEscrowOrders();
      setEscrowOrders(getEscrowsFromResponse(response));
    } catch (error) {
      console.error('Failed to fetch escrow orders:', error);
      setEscrowOrders([]);
    } finally {
      setEscrowLoading(false);
    }
  }, []);

  const refreshConversations = useCallback(async () => {
    setChatLoading(true);
    try {
      const response = await buyerAPI.getConversations();
      setConversations(getConversationsFromResponse(response));
    } catch (error) {
      console.error('Failed to fetch buyer conversations:', error);
      setConversations([]);
    } finally {
      setChatLoading(false);
    }
  }, []);

  const loadWalletPanel = useCallback(
    async (includeTransactions: boolean) => {
      await fetchWallet();
      if (includeTransactions) {
        await fetchTransactions();
      }
    },
    [fetchTransactions, fetchWallet],
  );

  const refreshDashboard = useCallback(async () => {
    setDashboardLoading(true);

    try {
      const [ordersResult, marketResult, suppliersResult, spendingResult] = await Promise.allSettled([
        buyerAPI.getOrders(),
        buyerAPI.getMarketPrices(),
        buyerService.dashboard.getTopSuppliers(5),
        buyerService.dashboard.getSpendingAnalytics('month'),
      ]);

      if (ordersResult.status === 'fulfilled') {
        syncOrders(getOrdersFromResponse(ordersResult.value));
      }

      if (marketResult.status === 'fulfilled') {
        setMarketTrends(getMarketTrendsFromResponse(marketResult.value));
      }

      if (suppliersResult.status === 'fulfilled') {
        setTopSuppliers((suppliersResult.value?.data?.data || suppliersResult.value?.data || []) as SupplierSummary[]);
      } else {
        setTopSuppliers([]);
      }

      if (spendingResult.status === 'fulfilled') {
        setSpendingOverview((spendingResult.value?.data?.data || spendingResult.value?.data || null) as SpendingOverview | null);
      } else {
        setSpendingOverview(null);
      }
    } finally {
      setDashboardLoading(false);
    }
  }, [syncOrders]);

  useEffect(() => {
    const user = authService.getUser();
    if (user?.name) {
      setUserName(user.name);
    }
  }, []);

  useEffect(() => {
    void refreshDashboard();
    void refreshEscrows();
    void refreshConversations();
    void loadWalletPanel(false);
  }, [loadWalletPanel, refreshConversations, refreshDashboard, refreshEscrows]);

  useEffect(() => {
    if (selectedSection === 'orders' || selectedSection === 'bulk-orders' || selectedSection === 'delivery') {
      void refreshOrders();
    }
    if (selectedSection === 'wallet') {
      void loadWalletPanel(true);
    }
    if (selectedSection === 'escrow') {
      void refreshEscrows();
    }
    if (selectedSection === 'chat') {
      void refreshConversations();
    }
  }, [loadWalletPanel, refreshConversations, refreshEscrows, refreshOrders, selectedSection]);

  const pendingApprovalOrders = orders.filter(
    (order) => order.status === 'DELIVERED' && !order.confirmedByBuyer,
  );
  const liveShipmentOrders = orders.filter((order) => ['CONFIRMED', 'IN_TRANSIT'].includes(order.status));
  const bulkOrders = orders.filter((order) => order.quantity >= 500);
  const totalUnreadMessages = conversations.reduce((sum, item) => sum + item.unreadCount, 0);
  const heldEscrows = escrowOrders.filter((escrow) => escrow.status === 'HELD');
  const heldEscrowValue = heldEscrows.reduce((sum, escrow) => sum + (escrow.amount || 0), 0);
  const releasedEscrowValue = escrowOrders
    .filter((escrow) => escrow.status === 'RELEASED')
    .reduce((sum, escrow) => sum + (escrow.amount || 0), 0);
  const recentOrders = [...orders].slice(0, 4);
  const spendBars = [...recentOrders]
    .reverse()
    .map((order) => order.totalAmount)
    .concat(Array.from({ length: Math.max(0, 4 - recentOrders.length) }, () => 0));
  const maxSpend = Math.max(...spendBars, 1);

  const navItems = [
    { label: 'Dashboard', href: '/buyer/dashboard', section: 'dashboard', icon: <BarChart3 /> },
    { label: 'Marketplace', href: '/buyer/marketplace', icon: <Store /> },
    { label: 'My Orders', href: '/buyer/dashboard', section: 'orders', icon: <ShoppingBag />, badge: stats.activeOrders || undefined },
    { label: 'Wallet', href: '/buyer/dashboard', section: 'wallet', icon: <Wallet /> },
    { label: 'Bulk Orders', href: '/buyer/dashboard', section: 'bulk-orders', icon: <Package /> },
    { label: 'Escrow Payments', href: '/buyer/dashboard', section: 'escrow', icon: <DollarSign />, badge: heldEscrows.length || undefined },
    { label: 'Delivery Approval', href: '/buyer/dashboard', section: 'delivery', icon: <Truck />, badge: pendingApprovalOrders.length || undefined },
    { label: 'Quality Certificates', href: '/buyer/dashboard', section: 'certificates', icon: <FileCheck /> },
    { label: 'Real-Time Chat', href: '/buyer/dashboard', section: 'chat', icon: <MessageCircle />, badge: totalUnreadMessages || undefined },
    { label: 'Order Tracking', href: '/buyer/logistics', icon: <MapPin /> },
    { label: 'Business KYC', href: '/buyer/dashboard', section: 'kyc', icon: <Building2 /> },
  ];

  const renderDashboard = () => (
    <div className="space-y-6">
      <SectionHero
        eyebrow="Buyer workspace"
        title={`Welcome back, ${userName}`}
        description="Every buyer action now lives inside one dashboard: marketplace handoff, wallet health, order pipeline, escrow visibility, and supplier follow-up."
        gradient="from-blue-600 via-cyan-600 to-blue-800"
        icon={ShoppingBag}
        highlights={['Live order pipeline', 'Wallet snapshot', 'Supplier watchlist', 'Market price feed']}
        stats={[
          { label: 'Active orders', value: String(stats.activeOrders) },
          { label: 'Delivered orders', value: String(stats.deliveredOrders) },
          { label: 'Wallet balance', value: formatCompactCurrency(wallet?.balance || 0) },
          { label: 'Active suppliers', value: String(stats.activeSuppliers) },
        ]}
        actions={
          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => router.push('/buyer/dashboard?section=orders')}
              className="rounded-full bg-white px-5 py-3 text-sm font-semibold text-blue-700 transition-colors hover:bg-blue-50"
            >
              Review orders
            </button>
            <button
              type="button"
              onClick={() => router.push('/buyer/marketplace')}
              className="rounded-full border border-white/25 bg-white/10 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-white/20"
            >
              Browse marketplace
            </button>
          </div>
        }
      />

      {dashboardLoading ? (
        <div className="flex items-center justify-center rounded-[32px] border border-slate-200 bg-white py-16 shadow-sm">
          <Loader2 className="h-10 w-10 animate-spin text-blue-600" />
        </div>
      ) : (
        <div className="grid gap-6 xl:grid-cols-12">
          <SurfaceCard
            title="Purchase pulse"
            description="Latest delivered order values give you a quick view of ticket size and procurement rhythm."
            className="xl:col-span-7"
          >
            <div className="flex h-56 items-end gap-3">
              {spendBars.map((amount, index) => (
                <div key={`${amount}-${index}`} className="flex flex-1 flex-col items-center gap-3">
                  <div className="flex h-44 w-full items-end rounded-[20px] bg-slate-100 p-2">
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: `${Math.max((amount / maxSpend) * 100, amount > 0 ? 20 : 8)}%` }}
                      transition={{ duration: 0.35, delay: index * 0.05 }}
                      className="w-full rounded-[14px] bg-gradient-to-t from-blue-600 via-cyan-500 to-cyan-300"
                    />
                  </div>
                  <p className="text-xs font-semibold text-slate-500">
                    {amount > 0 ? formatCompactCurrency(amount) : 'No order'}
                  </p>
                </div>
              ))}
            </div>
          </SurfaceCard>

          <SurfaceCard
            title="Order pipeline"
            description="Use these counts to move quickly between follow-up areas."
            className="xl:col-span-5"
          >
            <div className="space-y-4">
              {[
                { label: 'Pending', value: orders.filter((order) => order.status === 'PENDING').length, tone: 'bg-amber-500' },
                { label: 'Confirmed', value: orders.filter((order) => order.status === 'CONFIRMED').length, tone: 'bg-blue-500' },
                { label: 'In transit', value: orders.filter((order) => order.status === 'IN_TRANSIT').length, tone: 'bg-indigo-500' },
                { label: 'Delivered', value: stats.deliveredOrders, tone: 'bg-emerald-500' },
              ].map((item) => (
                <div key={item.label}>
                  <div className="mb-2 flex items-center justify-between text-sm">
                    <span className="font-semibold text-slate-700">{item.label}</span>
                    <span className="font-black text-slate-900">{item.value}</span>
                  </div>
                  <div className="h-2 rounded-full bg-slate-100">
                    <div
                      className={`h-2 rounded-full ${item.tone}`}
                      style={{
                        width: `${stats.totalOrders ? Math.max((item.value / stats.totalOrders) * 100, item.value > 0 ? 12 : 0) : 0}%`,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 grid gap-3">
              {[
                {
                  label: 'Pending approvals',
                  value: pendingApprovalOrders.length,
                  onClick: () => router.push('/buyer/dashboard?section=delivery'),
                },
                {
                  label: 'Escrow protected',
                  value: heldEscrows.length,
                  onClick: () => router.push('/buyer/dashboard?section=escrow'),
                },
              ].map((action) => (
                <button
                  key={action.label}
                  type="button"
                  onClick={action.onClick}
                  className="flex items-center justify-between rounded-[20px] border border-slate-200 px-4 py-4 text-left transition-colors hover:border-blue-200 hover:bg-blue-50"
                >
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">{action.label}</p>
                    <p className="mt-1 text-xl font-black text-slate-900">{action.value}</p>
                  </div>
                  <ArrowRight className="h-5 w-5 text-slate-400" />
                </button>
              ))}
            </div>
          </SurfaceCard>

          <SurfaceCard
            title="Supplier snapshot"
            description="Top supplier relationships by delivered value."
            className="xl:col-span-5"
          >
            {topSuppliers.length === 0 ? (
              <EmptyPanel
                icon={Users}
                title="Supplier insights will appear here"
                description="Once delivered orders accumulate, this panel highlights the suppliers driving the most volume."
              />
            ) : (
              <div className="space-y-3">
                {topSuppliers.map((supplier, index) => (
                  <div
                    key={supplier.id}
                    className="flex items-center justify-between rounded-[22px] bg-slate-50 px-4 py-4"
                  >
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
                        Supplier {index + 1}
                      </p>
                      <p className="mt-1 font-black text-slate-900">{supplier.name}</p>
                      <p className="text-sm text-slate-500">{supplier.orders} completed orders</p>
                    </div>
                    <p className="text-sm font-black text-slate-900">
                      {formatCompactCurrency(supplier.totalSpent)}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </SurfaceCard>

          <SurfaceCard
            title="Market watch"
            description="Daily crop movement to help you time purchases and restocks."
            className="xl:col-span-7"
          >
            <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
              {marketTrends.slice(0, 6).map((trend) => (
                <div
                  key={trend.name}
                  className="rounded-[24px] border border-slate-200 bg-slate-50 p-4 transition-colors hover:bg-slate-100"
                >
                  <div className="flex items-center justify-between">
                    <p className="font-black text-slate-900">{trend.name}</p>
                    <span
                      className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                        trend.change >= 0 ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'
                      }`}
                    >
                      {trend.change >= 0 ? '+' : ''}
                      {trend.change}%
                    </span>
                  </div>
                  <p className="mt-3 text-2xl font-black text-slate-900">
                    Rs. {trend.price.toLocaleString('en-IN')}/kg
                  </p>
                  <p className="mt-1 text-sm text-slate-500">{trend.available || 'Live availability updating'}</p>
                </div>
              ))}
            </div>
          </SurfaceCard>

          <SurfaceCard
            title="Category spend"
            description="Where your delivered order value is concentrated this month."
            className="xl:col-span-6"
          >
            {!spendingOverview || spendingOverview.categoryBreakdown.length === 0 ? (
              <EmptyPanel
                icon={BarChart3}
                title="No spend categories yet"
                description="Delivered orders will turn into a category mix once transactions start settling."
              />
            ) : (
              <div className="space-y-4">
                {spendingOverview.categoryBreakdown.slice(0, 5).map((item) => (
                  <div key={item.category}>
                    <div className="mb-2 flex items-center justify-between text-sm">
                      <span className="font-semibold text-slate-700">{item.category}</span>
                      <span className="font-black text-slate-900">{formatCompactCurrency(item.amount)}</span>
                    </div>
                    <div className="h-2 rounded-full bg-slate-100">
                      <div
                        className="h-2 rounded-full bg-gradient-to-r from-cyan-500 to-blue-600"
                        style={{ width: `${Math.max(item.percentage || 0, item.amount > 0 ? 10 : 0)}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </SurfaceCard>

          <SurfaceCard
            title="Recent orders"
            description="Jump back into the most recent procurements without leaving the dashboard."
            className="xl:col-span-6"
          >
            {recentOrders.length === 0 ? (
              <EmptyPanel
                icon={ShoppingBag}
                title="No orders yet"
                description="Your order activity will start populating here after the first buyer checkout."
              />
            ) : (
              <div className="space-y-3">
                {recentOrders.map((order) => (
                  <button
                    key={order.id}
                    type="button"
                    onClick={() => router.push(`/buyer/orders/${order.id}`)}
                    className="flex w-full items-center justify-between rounded-[22px] bg-slate-50 px-4 py-4 text-left transition-colors hover:bg-slate-100"
                  >
                    <div>
                      <p className="font-black text-slate-900">{getOrderTitle(order)}</p>
                      <p className="text-sm text-slate-500">
                        {getOrderSubtitle(order)} / {order.quantity} kg
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-black text-slate-900">{formatCompactCurrency(order.totalAmount)}</p>
                      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
                        {order.status.replace(/_/g, ' ')}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </SurfaceCard>
        </div>
      )}
    </div>
  );

  const renderOrders = () => (
    <div className="space-y-6">
      <SectionHero
        eyebrow="Orders command"
        title="My orders"
        description="Filter, track, confirm, and drill into every order without leaving the dashboard shell."
        gradient="from-blue-600 via-indigo-600 to-blue-800"
        icon={ShoppingBag}
        highlights={['Status filters', 'Escrow labels', 'Tracking handoff', 'Delivery confirmation']}
        stats={[
          { label: 'Total orders', value: String(stats.totalOrders) },
          { label: 'Active orders', value: String(stats.activeOrders) },
          { label: 'Delivered', value: String(stats.deliveredOrders) },
          { label: 'Pending approval', value: String(pendingApprovalOrders.length) },
        ]}
        actions={
          <button
            type="button"
            onClick={() => router.push('/buyer/marketplace')}
            className="rounded-full bg-white px-5 py-3 text-sm font-semibold text-blue-700 transition-colors hover:bg-blue-50"
          >
            Place a new order
          </button>
        }
      />

      <OrdersSection
        orders={orders}
        loading={ordersLoading}
        onRefresh={() => void refreshOrders()}
        onViewDetails={(orderId) => router.push(`/buyer/orders/${orderId}`)}
        onTrackOrder={(orderId) => router.push(`/buyer/tracking?orderId=${orderId}`)}
      />
    </div>
  );

  const renderWallet = () => (
    <div className="space-y-6">
      <SectionHero
        eyebrow="Funds and settlement"
        title="Wallet"
        description="Monitor spend capacity, escrow reserves, and the live transaction ledger from one buyer finance view."
        gradient="from-emerald-500 via-green-600 to-teal-700"
        icon={Wallet}
        highlights={['Live balance', 'Quick top-ups', 'Escrow reserve', 'Transaction ledger']}
        stats={[
          { label: 'Available balance', value: formatCompactCurrency(wallet?.balance || 0) },
          { label: 'In escrow', value: formatCompactCurrency(wallet?.heldBalance || 0) },
          {
            label: 'Credits',
            value: formatCompactCurrency(
              transactions
                .filter((transaction) => ['ADD_FUNDS', 'REFUND'].includes(transaction.type))
                .reduce((sum, transaction) => sum + transaction.amount, 0),
            ),
          },
          { label: 'Transactions', value: String(transactions.length) },
        ]}
      />

      <WalletSection
        wallet={wallet}
        transactions={transactions}
        loading={walletLoading}
        onAddFunds={addFunds}
        onRefresh={() => {
          void loadWalletPanel(true);
        }}
      />
    </div>
  );

  const renderBulkOrders = () => (
    <div className="space-y-6">
      <SectionHero
        eyebrow="High-volume desk"
        title="Bulk orders"
        description="Use the same dashboard shell to review larger-volume buys, scheduled fulfilment, and large-ticket supplier activity."
        gradient="from-purple-600 via-violet-600 to-purple-800"
        icon={Package}
        highlights={['High-volume orders', 'Supplier lanes', 'Escrow coverage', 'Fast follow-up']}
        stats={[
          { label: 'Bulk-ready orders', value: String(bulkOrders.length) },
          {
            label: 'Total bulk volume',
            value: `${bulkOrders.reduce((sum, order) => sum + order.quantity, 0).toLocaleString('en-IN')} kg`,
          },
          {
            label: 'Bulk value',
            value: formatCompactCurrency(
              bulkOrders.reduce((sum, order) => sum + order.totalAmount, 0),
            ),
          },
          {
            label: 'Avg order size',
            value: `${Math.round(
              bulkOrders.length
                ? bulkOrders.reduce((sum, order) => sum + order.quantity, 0) / bulkOrders.length
                : 0,
            )} kg`,
          },
        ]}
      />

      <div className="grid gap-6 xl:grid-cols-12">
        <SurfaceCard
          title="Bulk order playbook"
          description="What this area now handles inside the buyer dashboard."
          className="xl:col-span-4"
        >
          <div className="space-y-3">
            {[
              {
                title: 'Volume-first sourcing',
                description: 'Identify larger orders quickly and revisit suppliers with proven delivered value.',
              },
              {
                title: 'Escrow-backed settlement',
                description: 'Large transactions stay visible with hold and release states beside each order.',
              },
              {
                title: 'Tracking handoff',
                description: 'Jump straight into live order tracking for shipments already moving through logistics.',
              },
            ].map((item) => (
              <div key={item.title} className="rounded-[22px] bg-slate-50 p-4">
                <p className="font-black text-slate-900">{item.title}</p>
                <p className="mt-1 text-sm text-slate-500">{item.description}</p>
              </div>
            ))}
          </div>
        </SurfaceCard>

        <SurfaceCard
          title="High-volume orders"
          description="Orders of 500 kg or more appear here for quick buyer follow-through."
          className="xl:col-span-8"
        >
          {bulkOrders.length === 0 ? (
            <EmptyPanel
              icon={Package}
              title="No bulk orders yet"
              description="Once larger quantities are purchased, this section becomes your high-volume operating board."
            />
          ) : (
            <div className="space-y-3">
              {bulkOrders.map((order) => (
                <div
                  key={order.id}
                  className="flex flex-col gap-4 rounded-[24px] bg-slate-50 p-5 md:flex-row md:items-center md:justify-between"
                >
                  <div>
                    <p className="font-black text-slate-900">{getOrderTitle(order)}</p>
                    <p className="text-sm text-slate-500">{getOrderSubtitle(order)}</p>
                    <p className="mt-2 text-sm font-semibold text-slate-700">
                      {order.quantity.toLocaleString('en-IN')} kg / {formatCurrency(order.totalAmount)}
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <span className="rounded-full bg-white px-3 py-2 text-xs font-semibold text-slate-600">
                      {order.status.replace(/_/g, ' ')}
                    </span>
                    <button
                      type="button"
                      onClick={() => router.push(`/buyer/orders/${order.id}`)}
                      className="rounded-full bg-purple-600 px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-purple-700"
                    >
                      Open order
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </SurfaceCard>
      </div>
    </div>
  );
  const renderEscrow = () => (
    <div className="space-y-6">
      <SectionHero
        eyebrow="Protected settlement"
        title="Escrow payments"
        description="Track held funds, released payouts, and open protected transactions in the same buyer dashboard flow."
        gradient="from-green-600 via-emerald-600 to-teal-700"
        icon={DollarSign}
        highlights={['Held funds', 'Release visibility', 'Dispute readiness', 'Order context']}
        stats={[
          { label: 'Protected orders', value: String(escrowOrders.length) },
          { label: 'Held value', value: formatCompactCurrency(heldEscrowValue) },
          { label: 'Released value', value: formatCompactCurrency(releasedEscrowValue) },
          { label: 'Awaiting release', value: String(heldEscrows.length) },
        ]}
      />

      <div className="grid gap-6 xl:grid-cols-12">
        <SurfaceCard
          title="Protected funds"
          description="Current escrow orders and their release state."
          className="xl:col-span-7"
        >
          {escrowLoading ? (
            <div className="flex items-center justify-center py-16">
              <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
            </div>
          ) : escrowOrders.length === 0 ? (
            <EmptyPanel
              icon={DollarSign}
              title="No escrow orders yet"
              description="Protected payments will appear here as soon as a buyer order enters the settlement flow."
            />
          ) : (
            <div className="space-y-3">
              {escrowOrders.map((escrow) => (
                <div
                  key={escrow.id}
                  className="flex flex-col gap-3 rounded-[24px] bg-slate-50 p-5 md:flex-row md:items-center md:justify-between"
                >
                  <div>
                    <p className="font-black text-slate-900">{getEscrowTitle(escrow)}</p>
                    <p className="text-sm text-slate-500">
                      Opened {new Date(escrow.createdAt).toLocaleDateString('en-IN')}
                    </p>
                    <p className="mt-2 text-sm font-semibold text-slate-700">
                      {formatCurrency(escrow.amount || 0)}
                    </p>
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span
                      className={`rounded-full px-3 py-2 text-xs font-semibold ${
                        escrow.status === 'HELD'
                          ? 'bg-amber-100 text-amber-700'
                          : escrow.status === 'RELEASED'
                            ? 'bg-emerald-100 text-emerald-700'
                            : 'bg-slate-200 text-slate-700'
                      }`}
                    >
                      {escrow.status}
                    </span>
                    {escrow.order?.id && (
                      <button
                        type="button"
                        onClick={() => router.push(`/buyer/orders/${escrow.order?.id}`)}
                        className="rounded-full border border-slate-300 px-4 py-2 text-xs font-semibold text-slate-700 transition-colors hover:bg-white"
                      >
                        View order
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </SurfaceCard>

        <SurfaceCard
          title="How it works"
          description="The dashboard keeps the settlement process visible at every step."
          className="xl:col-span-5"
        >
          <div className="space-y-4">
            {[
              {
                step: '01',
                title: 'Place the order',
                description: 'Funds are protected inside escrow as soon as the buyer order is created.',
              },
              {
                step: '02',
                title: 'Track fulfillment',
                description: 'Delivery progress stays linked to the same order record and protected amount.',
              },
              {
                step: '03',
                title: 'Release with confidence',
                description: 'The release state updates next to the order once delivery is verified.',
              },
            ].map((item) => (
              <div key={item.step} className="rounded-[22px] bg-slate-50 p-5">
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">{item.step}</p>
                <p className="mt-2 font-black text-slate-900">{item.title}</p>
                <p className="mt-1 text-sm text-slate-500">{item.description}</p>
              </div>
            ))}
          </div>
        </SurfaceCard>
      </div>
    </div>
  );

  const renderDelivery = () => (
    <div className="space-y-6">
      <SectionHero
        eyebrow="Delivery handoff"
        title="Delivery approval"
        description="Review deliveries that still need buyer attention and jump into live tracking for shipments on the move."
        gradient="from-orange-500 via-amber-600 to-orange-700"
        icon={CheckCircle2}
        highlights={['Pending approval queue', 'Live shipment shortcuts', 'Order detail jump', 'Escrow-aware follow-up']}
        stats={[
          { label: 'Awaiting approval', value: String(pendingApprovalOrders.length) },
          { label: 'In transit', value: String(liveShipmentOrders.length) },
          { label: 'Delivered', value: String(stats.deliveredOrders) },
          { label: 'Protected value', value: formatCompactCurrency(heldEscrowValue) },
        ]}
      />

      <div className="grid gap-6 xl:grid-cols-12">
        <SurfaceCard
          title="Approval queue"
          description="Orders delivered but not yet buyer-confirmed."
          className="xl:col-span-7"
        >
          {pendingApprovalOrders.length === 0 ? (
            <EmptyPanel
              icon={CheckCircle2}
              title="No approvals waiting"
              description="Delivered orders that still need confirmation will surface here automatically."
            />
          ) : (
            <div className="space-y-3">
              {pendingApprovalOrders.map((order) => (
                <div
                  key={order.id}
                  className="flex flex-col gap-4 rounded-[24px] bg-slate-50 p-5 md:flex-row md:items-center md:justify-between"
                >
                  <div>
                    <p className="font-black text-slate-900">{getOrderTitle(order)}</p>
                    <p className="text-sm text-slate-500">{getOrderSubtitle(order)}</p>
                    <p className="mt-2 text-sm font-semibold text-slate-700">
                      {order.quantity} kg / {formatCurrency(order.totalAmount)}
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => setSelectedApprovalOrder(order)}
                      className="rounded-full bg-emerald-600 px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-emerald-700"
                    >
                      Confirm delivery
                    </button>
                    <button
                      type="button"
                      onClick={() => router.push(`/buyer/orders/${order.id}`)}
                      className="rounded-full border border-slate-300 px-4 py-2 text-xs font-semibold text-slate-700 transition-colors hover:bg-white"
                    >
                      Open order
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </SurfaceCard>

        <SurfaceCard
          title="Incoming shipments"
          description="Orders that are already confirmed or in transit."
          className="xl:col-span-5"
        >
          {liveShipmentOrders.length === 0 ? (
            <EmptyPanel
              icon={Truck}
              title="Nothing on the road right now"
              description="As soon as shipments are assigned or in transit, they will show up here."
            />
          ) : (
            <div className="space-y-3">
              {liveShipmentOrders.slice(0, 5).map((order) => (
                <div key={order.id} className="rounded-[22px] bg-slate-50 p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-black text-slate-900">{getOrderTitle(order)}</p>
                      <p className="text-sm text-slate-500">{order.status.replace(/_/g, ' ')}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => router.push(`/buyer/tracking?orderId=${order.id}`)}
                      className="rounded-full bg-orange-600 px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-orange-700"
                    >
                      Track
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </SurfaceCard>
      </div>
    </div>
  );

  const renderCertificates = () => (
    <div className="space-y-6">
      <SectionHero
        eyebrow="Quality verification"
        title="Quality certificates"
        description="Search crop and lot certificates without leaving the buyer dashboard, then verify the supporting files in one flow."
        gradient="from-sky-600 via-blue-600 to-indigo-800"
        icon={FileCheck}
        highlights={['Crop lookup', 'Lot lookup', 'Issuer visibility', 'Download access']}
        stats={[
          { label: 'Certificate search', value: 'Crop and lot' },
          { label: 'Verification mode', value: 'Buyer ready' },
          { label: 'Downloads', value: 'Direct access' },
          { label: 'Trust layer', value: 'Documented' },
        ]}
      />
      <BuyerQualityCertificate />
    </div>
  );

  const renderChat = () => (
    <div className="space-y-6">
      <SectionHero
        eyebrow="Conversation inbox"
        title="Real-time chat"
        description="Buyer conversations, unread counts, and latest supplier replies now stay visible as one dashboard section."
        gradient="from-blue-600 via-indigo-600 to-blue-800"
        icon={MessageCircle}
        highlights={['Conversation list', 'Unread counts', 'Supplier roles', 'Latest reply context']}
        stats={[
          { label: 'Conversations', value: String(conversations.length) },
          { label: 'Unread messages', value: String(totalUnreadMessages) },
          {
            label: 'Supplier threads',
            value: String(conversations.filter((conversation) => conversation.partnerRole !== 'BUYER').length),
          },
          { label: 'Last refresh', value: 'Live fetch' },
        ]}
      />

      <SurfaceCard
        title="Recent conversations"
        description="Latest supplier and FPO threads ordered by most recent message."
      >
        {chatLoading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
          </div>
        ) : conversations.length === 0 ? (
          <EmptyPanel
            icon={MessageCircle}
            title="No conversations yet"
            description="Buyer chat threads will start appearing here once you begin messaging farmers or FPOs."
          />
        ) : (
          <div className="space-y-3">
            {conversations.map((conversation) => (
              <div
                key={conversation.partnerId}
                className="flex flex-col gap-4 rounded-[24px] bg-slate-50 p-5 md:flex-row md:items-center md:justify-between"
              >
                <div className="flex min-w-0 items-start gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 text-sm font-black text-white">
                    {conversation.partnerName.charAt(0).toUpperCase()}
                  </div>
                  <div className="min-w-0">
                    <p className="font-black text-slate-900">{conversation.partnerName}</p>
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
                      {conversation.partnerRole}
                    </p>
                    <p className="mt-2 truncate text-sm text-slate-500">{conversation.lastMessage}</p>
                  </div>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  {conversation.unreadCount > 0 && (
                    <span className="rounded-full bg-rose-100 px-3 py-2 text-xs font-semibold text-rose-700">
                      {conversation.unreadCount} unread
                    </span>
                  )}
                  <span className="rounded-full bg-white px-3 py-2 text-xs font-semibold text-slate-500">
                    {new Date(conversation.lastMessageTime).toLocaleString('en-IN')}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </SurfaceCard>
    </div>
  );

  const renderKyc = () => (
    <div className="space-y-6">
      <SectionHero
        eyebrow="Business identity"
        title="Business KYC"
        description="GST details, verification progress, and buyer profile completion stay inside the dashboard instead of sending you to a separate setup flow."
        gradient="from-slate-700 via-blue-700 to-slate-900"
        icon={Building2}
        highlights={['GST verification', 'Business info', 'Bank details', 'Profile completion']}
        stats={[
          { label: 'Verification', value: 'Buyer profile' },
          { label: 'Documents', value: 'GST and bank' },
          { label: 'Workflow', value: 'Inline setup' },
          { label: 'Status', value: 'Trackable' },
        ]}
      />
      <KYC />
    </div>
  );

  const sectionContent = (() => {
    switch (selectedSection) {
      case 'orders':
        return renderOrders();
      case 'wallet':
        return renderWallet();
      case 'bulk-orders':
        return renderBulkOrders();
      case 'escrow':
        return renderEscrow();
      case 'delivery':
        return renderDelivery();
      case 'certificates':
        return renderCertificates();
      case 'chat':
        return renderChat();
      case 'kyc':
        return renderKyc();
      case 'dashboard':
        return renderDashboard();
      default:
        return (
          <SurfaceCard
            title="Section not found"
            description="Choose a buyer workflow from the left sidebar to continue."
          >
            <EmptyPanel
              icon={BarChart3}
              title="Unknown section"
              description="That dashboard section is not available yet."
            />
          </SurfaceCard>
        );
    }
  })();

  return (
    <DashboardLayout navItems={navItems} userRole="buyer">
      <AnimatePresence mode="wait">
        <motion.div
          key={selectedSection}
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -18 }}
          transition={{ duration: 0.28 }}
          className="space-y-6"
        >
          {sectionContent}
        </motion.div>
      </AnimatePresence>

      {selectedApprovalOrder && (
        <DeliveryConfirmationModal
          orderId={selectedApprovalOrder.id}
          orderDetails={{
            productName: getOrderTitle(selectedApprovalOrder),
            quantity: selectedApprovalOrder.quantity,
            totalAmount: selectedApprovalOrder.totalAmount,
          }}
          onClose={() => setSelectedApprovalOrder(null)}
          onSuccess={() => {
            setSelectedApprovalOrder(null);
            void refreshOrders();
            void refreshEscrows();
          }}
        />
      )}
    </DashboardLayout>
  );
}

export default function BuyerDashboardPage() {
  return (
    <Suspense
      fallback={
        <div className="flex h-screen w-full items-center justify-center bg-slate-50">
          <Loader2 className="h-14 w-14 animate-spin text-blue-600" />
        </div>
      }
    >
      <BuyerDashboardContent />
    </Suspense>
  );
}
