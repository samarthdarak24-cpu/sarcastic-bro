"use client";

import { useEffect, useRef } from "react";
import { getSocket } from "@/lib/socket";
import { useRealtimeStore } from "@/store/realtimeStore";
import { authService } from "@/services/auth";
import toast from "react-hot-toast";

// Mandi crop prices - simulated live feed
const MANDI_PRICES: Record<string, number> = {
  "tomato": 28, "wheat": 42, "rice": 88, "onion": 35,
  "potato": 22, "chilli": 140, "turmeric": 120, "ginger": 95,
  "garlic": 180, "cotton": 65, "soybean": 55, "maize": 32,
};

export function RealtimeProvider({ children }: { children: React.ReactNode }) {
  const user = typeof window !== 'undefined' ? authService.getUser() : null;
  const {
    setConnected, setConnectedUsers, updateLivePrice,
    flashPrice, addNotification, updateLiveOrder, updateDashboardStats
  } = useRealtimeStore();

  const priceIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const statsIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const currentPricesRef = useRef<Record<string, number>>({ ...MANDI_PRICES });

  useEffect(() => {
    // Only run on client side
    if (typeof window === 'undefined') return;

    try {
      const socket = getSocket();

      // ── Connection events ──────────────────────────────────────────────
      socket.on("connect", () => {
        setConnected(true);
        if (user?.id) socket.emit("join-user-room", user.id);
      });

      socket.on("disconnect", () => setConnected(false));

      // ── Order updates ──────────────────────────────────────────────────
      socket.on("order-status-update", (data: any) => {
        updateLiveOrder({ id: data.orderId, orderNumber: data.orderNumber, status: data.status, updatedAt: new Date() });
        addNotification({ type: 'order', title: 'Order Updated', message: `Order #${data.orderNumber} → ${data.status}` });
        toast.success(`📦 Order #${data.orderNumber} is now ${data.status}`);
      });

      // ── Price updates ──────────────────────────────────────────────────
      socket.on("price-update", (data: any) => {
        const prev = currentPricesRef.current[data.productId] || data.newPrice;
        updateLivePrice({
          productId: data.productId,
          productName: data.productName || data.productId,
          price: data.newPrice,
          prevPrice: prev,
          change: data.newPrice - prev,
          changePercent: ((data.newPrice - prev) / prev) * 100,
          direction: data.newPrice > prev ? 'up' : data.newPrice < prev ? 'down' : 'stable',
          updatedAt: new Date(),
        });
        flashPrice(data.productId);
        currentPricesRef.current[data.productId] = data.newPrice;
      });

      // ── Proposal updates ───────────────────────────────────────────────
      socket.on("proposal-update", (data: any) => {
        addNotification({ type: 'proposal', title: 'Proposal Update', message: data.message || `Proposal ${data.status}` });
        toast(`💼 ${data.message || 'Proposal updated'}`, { duration: 4000 });
      });

      // ── Tender updates ─────────────────────────────────────────────────
      socket.on("tender-update", (data: any) => {
        addNotification({ type: 'tender', title: 'Tender Update', message: data.message });
        toast.success(`📋 ${data.message}`, { duration: 5000 });
      });

      // ── Quality scan ───────────────────────────────────────────────────
      socket.on("quality-scan-complete", (data: any) => {
        addNotification({ type: 'quality', title: 'Quality Scan Done', message: `Grade ${data.grade} — Score: ${data.score}%` });
        toast.success(`🔬 Quality Grade: ${data.grade} (${data.score}%)`, { duration: 5000 });
      });

      // ── Payment updates ────────────────────────────────────────────────
      socket.on("payment-update", (data: any) => {
        addNotification({ type: 'payment', title: 'Payment', message: `₹${data.amount} — ${data.status}` });
        toast.success(`💰 Payment ${data.status}: ₹${data.amount}`, { duration: 4000 });
      });

      // ── System announcements ───────────────────────────────────────────
      socket.on("system-announcement", (data: any) => {
        addNotification({ type: 'system', title: data.title, message: data.message });
        toast(data.message, { icon: '📢', duration: 6000 });
      });

      // ── Simulated live Mandi price feed (every 8 seconds) ─────────────
      priceIntervalRef.current = setInterval(() => {
        const crops = Object.keys(MANDI_PRICES);
        // Update 2-3 random crops each tick
        const count = Math.floor(Math.random() * 2) + 1;
        for (let i = 0; i < count; i++) {
          const crop = crops[Math.floor(Math.random() * crops.length)];
          const prev = currentPricesRef.current[crop];
          const delta = (Math.random() - 0.48) * prev * 0.03; // ±3% max
          const newPrice = Math.max(prev + delta, prev * 0.85);
          const rounded = Math.round(newPrice * 10) / 10;

          currentPricesRef.current[crop] = rounded;
          updateLivePrice({
            productId: crop,
            productName: crop.charAt(0).toUpperCase() + crop.slice(1),
            price: rounded,
            prevPrice: prev,
            change: rounded - prev,
            changePercent: ((rounded - prev) / prev) * 100,
            direction: rounded > prev ? 'up' : rounded < prev ? 'down' : 'stable',
            updatedAt: new Date(),
          });
          flashPrice(crop);
        }
      }, 8000);

      // ── Simulated dashboard stats refresh (every 15 seconds) ──────────
      statsIntervalRef.current = setInterval(() => {
        updateDashboardStats({
          totalRevenue: 142500 + Math.floor(Math.random() * 5000),
          totalOrders: 154 + Math.floor(Math.random() * 5),
          activeProducts: 24 + Math.floor(Math.random() * 3),
          successRate: 94 + Math.random() * 2,
        });
      }, 15000);

      // Initial connection check
      if (socket.connected) setConnected(true);

      return () => {
        socket.off("connect");
        socket.off("disconnect");
        socket.off("order-status-update");
        socket.off("price-update");
        socket.off("proposal-update");
        socket.off("tender-update");
        socket.off("quality-scan-complete");
        socket.off("payment-update");
        socket.off("system-announcement");
        if (priceIntervalRef.current) clearInterval(priceIntervalRef.current);
        if (statsIntervalRef.current) clearInterval(statsIntervalRef.current);
      };
    } catch (error) {
      console.error('RealtimeProvider error:', error);
      // Continue without socket connection
      return () => {
        if (priceIntervalRef.current) clearInterval(priceIntervalRef.current);
        if (statsIntervalRef.current) clearInterval(statsIntervalRef.current);
      };
    }
  }, [user?.id]);

  return <>{children}</>;
}
