"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bell, X, CheckCheck, Package, TrendingUp, MessageSquare, FileText, Zap, ShieldCheck } from "lucide-react";
import { useRealtimeStore } from "@/store/realtimeStore";
import api from "@/services/api";

const ICONS: Record<string, any> = {
  order: Package,
  price: TrendingUp,
  proposal: FileText,
  tender: FileText,
  quality: ShieldCheck,
  payment: Zap,
  system: Bell,
};

const COLORS: Record<string, string> = {
  order: "bg-blue-100 text-blue-600",
  price: "bg-emerald-100 text-emerald-600",
  proposal: "bg-purple-100 text-purple-600",
  tender: "bg-orange-100 text-orange-600",
  quality: "bg-teal-100 text-teal-600",
  payment: "bg-yellow-100 text-yellow-600",
  system: "bg-slate-100 text-slate-600",
};

export function LiveNotificationBell() {
  const [open, setOpen] = useState(false);
  const { notifications, unreadCount, markAllRead, addNotification } = useRealtimeStore();
    // Fetch notifications from API on mount
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const res = await api.get("/notifications?limit=20");
        const apiNotifs = res.data.data?.notifications || [];
        apiNotifs.forEach((n: any) => {
          addNotification({
            type: n.type?.toLowerCase() || 'system',
            title: n.title,
            message: n.message,
          });
        });
      } catch (error) {
        // Silently fail - notifications are not critical
        // Don't log anything to avoid console errors
      }
    };
    fetchNotifications();
  }, [addNotification]);

  const handleOpen = () => {
    setOpen(v => !v);
    if (!open && unreadCount > 0) {
      markAllRead();
      // Mark as read in backend
      api.patch("/notifications/read-all").catch(() => {});
    }
  };

  return (
    <div className="relative">
      <button
        onClick={handleOpen}
        className="relative h-10 w-10 rounded-xl bg-slate-100 hover:bg-slate-200 flex items-center justify-center transition-colors"
      >
        <Bell size={18} className="text-slate-600" />
        <AnimatePresence>
          {unreadCount > 0 && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              className="absolute -top-1 -right-1 h-5 w-5 bg-red-500 text-white text-[9px] font-black rounded-full flex items-center justify-center"
            >
              {unreadCount > 9 ? '9+' : unreadCount}
            </motion.div>
          )}
        </AnimatePresence>
      </button>

      <AnimatePresence>
        {open && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
            <motion.div
              initial={{ opacity: 0, y: 8, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8, scale: 0.95 }}
              className="absolute right-0 top-12 w-80 bg-white rounded-2xl shadow-2xl border border-slate-100 z-50 overflow-hidden"
            >
              <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <Bell size={14} className="text-slate-600" />
                  <span className="text-sm font-black text-slate-900">{"Notifications"}</span>
                  <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                </div>
                <button onClick={() => setOpen(false)} className="p-1 rounded-lg hover:bg-slate-100">
                  <X size={14} className="text-slate-400" />
                </button>
              </div>

              <div className="max-h-80 overflow-y-auto">
                {notifications.length === 0 ? (
                  <div className="py-10 text-center">
                    <Bell size={32} className="text-slate-200 mx-auto mb-2" />
                    <p className="text-sm text-slate-400 font-medium">{"No notifications yet"}</p>
                  </div>
                ) : (
                  notifications.slice(0, 20).map((n) => {
                    const Icon = ICONS[n.type] || Bell;
                    return (
                      <motion.div
                        key={n.id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        className={`flex gap-3 px-4 py-3 border-b border-slate-50 hover:bg-slate-50 transition-colors ${!n.read ? 'bg-blue-50/30' : ''}`}
                      >
                        <div className={`h-8 w-8 rounded-xl flex items-center justify-center shrink-0 ${COLORS[n.type] || COLORS.system}`}>
                          <Icon size={14} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-black text-slate-900 leading-tight">{n.title}</p>
                          <p className="text-[11px] text-slate-500 mt-0.5 leading-tight line-clamp-2">{n.message}</p>
                          <p className="text-[10px] text-slate-300 mt-1">
                            {new Date(n.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </p>
                        </div>
                        {!n.read && <div className="h-2 w-2 rounded-full bg-blue-500 shrink-0 mt-1" />}
                      </motion.div>
                    );
                  })
                )}
              </div>

              {notifications.length > 0 && (
                <div className="px-4 py-2 border-t border-slate-100">
                  <button
                    onClick={markAllRead}
                    className="flex items-center gap-1.5 text-[11px] font-bold text-emerald-600 hover:text-emerald-700"
                  >
                    <CheckCheck size={12} />
                    {"Mark all as read"}
                  </button>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

