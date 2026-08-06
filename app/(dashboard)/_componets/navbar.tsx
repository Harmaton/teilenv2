"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useSidebar } from "@/components/ui/sidebar";
import { Bell, Search, AlertTriangle,  Info, CheckCircle2, ExternalLink, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";
import {
  getNotifications,
  markNotificationRead,
  markAllNotificationsRead,
} from "@/_actions/notifications";
import type { AppNotification, NotificationType } from "@/_actions/notifications";

// ─── Routes ───────────────────────────────────────────────────────────────────

type RouteEntry = { label: string; path: string; group: string };

const ROUTES: RouteEntry[] = [
  { label: "Dashboard",            path: "/dashboard",  group: "Main"                  },
  { label: "Team Management",      path: "/team",       group: "Manage"                },
  { label: "Editorial",            path: "/editorial",  group: "Manage"                },
  { label: "Projects",             path: "/projects",   group: "Manage"                },
  { label: "Cohorts & Programmes", path: "/programmes", group: "Programmes & Learning" },
  { label: "Hackathons",           path: "/hackathons", group: "Programmes & Learning" },
  { label: "Events",               path: "/events",     group: "Programmes & Learning" },
];

// ─── Type → icon + colours ────────────────────────────────────────────────────

const TYPE_META: Record<NotificationType, {
  icon:    React.ReactNode;
  iconBg:  string;
  dot:     string;
  toast:   string;
}> = {
  info:    {
    icon:   <Info          size={11} />,
    iconBg: "bg-blue-500",
    dot:    "bg-blue-500",
    toast:  "border-l-blue-500",
  },
  success: {
    icon:   <CheckCircle2  size={11} />,
    iconBg: "bg-emerald-500",
    dot:    "bg-emerald-500",
    toast:  "border-l-emerald-500",
  },
  warning: {
    icon:   <AlertTriangle size={11} />,
    iconBg: "bg-amber-500",
    dot:    "bg-amber-500",
    toast:  "border-l-amber-500",
  },
  error:   {
    icon:   <X             size={11} />,
    iconBg: "bg-red-500",
    dot:    "bg-red-500",
    toast:  "border-l-red-500",
  },
};

// ─── Toast ────────────────────────────────────────────────────────────────────

interface ToastItem { id: string; notification: AppNotification }

function Toast({ item, onDismiss }: { item: ToastItem; onDismiss: (id: string) => void }) {
  const meta = TYPE_META[item.notification.type];

  useEffect(() => {
    const t = setTimeout(() => onDismiss(item.id), 5000);
    return () => clearTimeout(t);
  }, [item.id, onDismiss]);

  return (
    <div className={cn(
      "flex items-start gap-3 w-72 bg-white rounded-xl border border-black/10",
      "shadow-xl shadow-black/10 px-3.5 py-3 border-l-4 animate-in slide-in-from-right-4",
      "duration-300",
      meta.toast
    )}>
      <div className={cn("w-5 h-5 rounded-full flex items-center justify-center text-white flex-shrink-0 mt-0.5", meta.iconBg)}>
        {meta.icon}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[12px] font-semibold text-black leading-snug">{item.notification.title}</p>
        {item.notification.body && (
          <p className="text-[11px] text-black/50 mt-0.5 leading-snug line-clamp-2">{item.notification.body}</p>
        )}
      </div>
      <button onClick={() => onDismiss(item.id)} className="text-black/25 hover:text-black/60 transition-colors flex-shrink-0">
        <X size={12} />
      </button>
    </div>
  );
}

// ─── Notification item ────────────────────────────────────────────────────────

function NotifItem({ n, onRead }: { n: AppNotification; onRead: (id: string) => void }) {
  const router = useRouter();
  const meta   = TYPE_META[n.type];

  const timeAgo = (iso: string) => {
    const diff = Date.now() - new Date(iso).getTime();
    const m = Math.floor(diff / 60000);
    if (m < 1)  return "just now";
    if (m < 60) return `${m}m ago`;
    const h = Math.floor(m / 60);
    if (h < 24) return `${h}h ago`;
    const d = Math.floor(h / 24);
    if (d < 7)  return `${d}d ago`;
    return new Date(iso).toLocaleDateString(undefined, { month: "short", day: "numeric" });
  };

  const handleClick = () => {
    if (!n.read) onRead(n.id);
    if (n.href)  router.push(n.href);
  };

  return (
    <div
      onClick={handleClick}
      className={cn(
        "flex gap-2.5 px-3.5 py-2.5 cursor-pointer border-b border-black/5 last:border-0",
        "hover:bg-black/[0.02] transition-colors group",
        !n.read && "bg-black/[0.015]"
      )}
    >
      {/* Icon */}
      <div className={cn(
        "w-5 h-5 rounded-full flex items-center justify-center text-white flex-shrink-0 mt-0.5",
        meta.iconBg
      )}>
        {meta.icon}
      </div>

      {/* Text */}
      <div className="flex-1 min-w-0">
        <p className={cn("text-[12px] leading-snug", !n.read ? "text-black font-medium" : "text-black/60")}>
          {n.title}
        </p>
        {n.body && (
          <p className="text-[11px] text-black/40 mt-0.5 line-clamp-1">{n.body}</p>
        )}
        <p className="text-[10px] text-black/30 mt-0.5">{timeAgo(n.created_at)}</p>
      </div>

      {/* Unread dot + link */}
      <div className="flex flex-col items-end gap-1 flex-shrink-0 pt-0.5">
        {!n.read && <span className={cn("w-1.5 h-1.5 rounded-full", meta.dot)} />}
        {n.href && (
          <ExternalLink size={10} className="text-black/20 opacity-0 group-hover:opacity-100 transition-opacity" />
        )}
      </div>
    </div>
  );
}

// ─── Burger ───────────────────────────────────────────────────────────────────

function BurgerIcon({ open }: { open: boolean }) {
  return (
    <div className="flex flex-col items-center justify-center w-5 h-5 gap-0">
      <span className={cn("block h-px w-[18px] bg-black origin-center transition-all duration-250 ease-in-out mb-[5px]", open && "translate-y-[6.5px] rotate-45")} />
      <span className={cn("block h-px bg-black origin-center transition-all duration-200 ease-in-out mb-[5px]", open ? "w-0 opacity-0" : "w-[18px] opacity-100")} />
      <span className={cn("block h-px w-[18px] bg-black origin-center transition-all duration-250 ease-in-out", open && "-translate-y-[6.5px] -rotate-45")} />
    </div>
  );
}

// ─── Navbar ───────────────────────────────────────────────────────────────────

export function Navbar() {
  const router   = useRouter();
  const pathname = usePathname();

  const [open,          setOpen]          = useState(false);
  const [query,         setQuery]         = useState("");
  const [searchFocused, setSearchFocused] = useState(false);
  const [notifOpen,     setNotifOpen]     = useState(false);
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [loading,       setLoading]       = useState(false);
  const [filter,        setFilter]        = useState<"all" | "unread">("all");
  const [toasts,        setToasts]        = useState<ToastItem[]>([]);
  const [profileId,     setProfileId]     = useState<string | null>(null);

  const searchRef   = useRef<HTMLDivElement>(null);
  const notifRef    = useRef<HTMLDivElement>(null);
  const inputRef    = useRef<HTMLInputElement>(null);
  const channelRef  = useRef<ReturnType<ReturnType<typeof createClient>["channel"]> | null>(null);

  const { toggleSidebar } = useSidebar();

  const unread   = notifications.filter((n) => !n.read).length;
  const displayed = filter === "unread"
    ? notifications.filter((n) => !n.read)
    : notifications;

  const filteredRoutes = query
    ? ROUTES.filter((r) =>
        r.label.toLowerCase().includes(query.toLowerCase()) ||
        r.group.toLowerCase().includes(query.toLowerCase())
      )
    : ROUTES;

  // ── Get current profile ID once ───────────────────────────────────────────

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) setProfileId(user.id);
    });
  }, []);

  // ── Load notifications ────────────────────────────────────────────────────

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getNotifications();
      setNotifications(data);
    } catch (err) {
      console.error("Failed to load notifications:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Initial load
  useEffect(() => {
    const timer = window.setTimeout(() => {
      void load();
    }, 0);
    return () => window.clearTimeout(timer);
  }, [load]);

  // ── Supabase Realtime subscription ────────────────────────────────────────

  useEffect(() => {
    if (!profileId) return;

    const supabase = createClient();

    // Clean up any existing channel first
    if (channelRef.current) {
      supabase.removeChannel(channelRef.current);
    }

    const channel = supabase
      .channel(`notifications:${profileId}`)
      .on(
        'postgres_changes',
        {
          event:  'INSERT',
          schema: 'public',
          table:  'notifications',
          filter: `profile_id=eq.${profileId}`,
        },
        (payload) => {
          const incoming = payload.new as AppNotification;

          // Prepend to list
          setNotifications((prev) => [incoming, ...prev]);

          // Show toast
          const toastId = `toast-${incoming.id}`;
          setToasts((prev) => [...prev, { id: toastId, notification: incoming }]);
        }
      )
      .on(
        'postgres_changes',
        {
          event:  'UPDATE',
          schema: 'public',
          table:  'notifications',
          filter: `profile_id=eq.${profileId}`,
        },
        (payload) => {
          const updated = payload.new as AppNotification;
          setNotifications((prev) =>
            prev.map((n) => n.id === updated.id ? updated : n)
          );
        }
      )
      .subscribe((status) => {
        if (status === 'SUBSCRIBED') {
          console.debug('[Realtime] notifications channel subscribed');
        }
      });

    channelRef.current = channel;

    return () => {
      supabase.removeChannel(channel);
      channelRef.current = null;
    };
  }, [profileId]);

  // ── Keyboard shortcuts ────────────────────────────────────────────────────

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        inputRef.current?.focus();
        setSearchFocused(true);
      }
      if (e.key === "Escape") {
        setSearchFocused(false);
        setNotifOpen(false);
        inputRef.current?.blur();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  // ── Outside click ─────────────────────────────────────────────────────────

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (!searchRef.current?.contains(e.target as Node)) setSearchFocused(false);
      if (!notifRef.current?.contains(e.target as Node))  setNotifOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const navigate = useCallback((path: string) => {
    setSearchFocused(false);
    setQuery("");
    router.push(path);
  }, [router]);

  const handleMarkRead = useCallback(async (id: string) => {
    // Optimistic
    setNotifications((prev) => prev.map((n) => n.id === id ? { ...n, read: true } : n));
    try {
      await markNotificationRead(id);
    } catch {
      // Revert on failure
      setNotifications((prev) => prev.map((n) => n.id === id ? { ...n, read: false } : n));
    }
  }, []);

  const handleMarkAllRead = useCallback(async () => {
    // Optimistic
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    try {
      await markAllNotificationsRead();
    } catch {
      void load(); // revert by reloading
    }
  }, [load]);

  const dismissToast = useCallback((toastId: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== toastId));
  }, []);

  // ─────────────────────────────────────────────────────────────────────────

  return (
    <>
      {/* ── Toast stack (top-right) ── */}
      <div className="fixed top-4 right-4 z-[100] flex flex-col gap-2 pointer-events-none">
        {toasts.map((t) => (
          <div key={t.id} className="pointer-events-auto">
            <Toast item={t} onDismiss={dismissToast} />
          </div>
        ))}
      </div>

      <header className="h-[52px] w-full border-b border-black/10 bg-white flex items-center gap-3 px-4 shrink-0">

        {/* ── Burger ── */}
        <button
          onClick={() => { toggleSidebar(); setOpen((o) => !o); }}
          className="w-9 h-9 flex items-center justify-center rounded-md hover:bg-black/5 transition-colors"
          aria-label="Toggle sidebar"
        >
          <BurgerIcon open={open} />
        </button>

        {/* ── Search ── */}
        <div ref={searchRef} className="relative flex-1 max-w-sm">
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 text-black/30 pointer-events-none" size={13} />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onFocus={() => setSearchFocused(true)}
              placeholder="Search routes…"
              className={cn(
                "w-full h-[34px] pl-8 pr-10 text-[13px] rounded-md",
                "border border-black/10 bg-black/[0.03] text-black placeholder:text-black/30",
                "outline-none transition-all focus:border-black/30 focus:bg-white"
              )}
            />
            <kbd className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] text-black/30 border border-black/15 rounded px-1 py-px font-mono">
              ⌘K
            </kbd>
          </div>

          {searchFocused && (
            <div className="absolute top-[calc(100%+6px)] left-0 right-0 bg-white border border-black/10 rounded-lg overflow-hidden z-50 shadow-lg">
              {filteredRoutes.length === 0 ? (
                <p className="text-[12px] text-black/40 text-center py-4">No routes found</p>
              ) : (
                filteredRoutes.map((r) => (
                  <button
                    key={r.path}
                    onClick={() => navigate(r.path)}
                    className={cn(
                      "flex items-center gap-2.5 w-full px-3 py-2.5 text-left",
                      "hover:bg-black/[0.03] transition-colors border-b border-black/5 last:border-0",
                      pathname === r.path && "bg-black/[0.04]"
                    )}
                  >
                    <div className="flex flex-col min-w-0">
                      <span className="text-[13px] text-black leading-tight">{r.label}</span>
                      <span className="text-[11px] text-black/35">{r.path}</span>
                    </div>
                    {pathname === r.path && (
                      <span className="ml-auto text-[10px] border border-black/15 rounded px-1.5 py-px text-black/40 shrink-0">
                        current
                      </span>
                    )}
                  </button>
                ))
              )}
            </div>
          )}
        </div>

        <div className="flex-1" />

        {/* ── Bell ── */}
        <div ref={notifRef} className="relative">
          <button
            onClick={() => setNotifOpen((o) => !o)}
            className="w-9 h-9 flex items-center justify-center rounded-md hover:bg-black/5 transition-colors relative"
            aria-label="Notifications"
          >
            <Bell size={16} className="text-black" />
            {unread > 0 && (
              <span className="absolute top-1.5 right-1.5 w-[7px] h-[7px] bg-black rounded-full border-[1.5px] border-white" />
            )}
          </button>

          {notifOpen && (
            <div className="absolute top-[calc(100%+6px)] right-0 w-80 bg-white border border-black/10 rounded-xl overflow-hidden z-50 shadow-xl shadow-black/8">

              {/* Header */}
              <div className="flex items-center justify-between px-3.5 py-2.5 border-b border-black/8">
                <div className="flex items-center gap-2">
                  <span className="text-[12px] font-semibold text-black">Notifications</span>
                  {unread > 0 && (
                    <span className="px-1.5 py-px rounded-full bg-black text-white text-[10px] font-bold">
                      {unread}
                    </span>
                  )}
                  {/* Live indicator */}
                  <span className="flex items-center gap-1 text-[10px] text-emerald-600">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    Live
                  </span>
                </div>
                {unread > 0 && (
                  <button
                    onClick={handleMarkAllRead}
                    className="text-[11px] text-black/40 hover:text-black transition-colors"
                  >
                    Mark all read
                  </button>
                )}
              </div>

              {/* Filter tabs */}
              <div className="flex gap-1 px-3 py-2 border-b border-black/6">
                {(["all", "unread"] as const).map((f) => (
                  <button
                    key={f}
                    onClick={() => setFilter(f)}
                    className={cn(
                      "px-2.5 py-1 rounded-md text-[11px] font-medium transition-all capitalize",
                      filter === f
                        ? "bg-black text-white"
                        : "text-black/40 hover:text-black hover:bg-zinc-100"
                    )}
                  >
                    {f}
                    {f === "unread" && unread > 0 && (
                      <span className={cn("ml-1 text-[9px]", filter === "unread" ? "text-white/60" : "text-black/30")}>
                        {unread}
                      </span>
                    )}
                  </button>
                ))}
              </div>

              {/* List */}
              <div className="max-h-[380px] overflow-y-auto">
                {loading ? (
                  <div className="flex items-center justify-center py-10 gap-2">
                    <div className="w-3 h-3 rounded-full bg-black/20 animate-pulse" />
                    <p className="text-[12px] text-black/30">Loading…</p>
                  </div>
                ) : displayed.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-10 gap-2">
                    <Bell size={20} className="text-black/15" />
                    <p className="text-[12px] text-black/30">
                      {filter === "unread" ? "No unread notifications" : "All caught up"}
                    </p>
                  </div>
                ) : (
                  displayed.map((n) => (
                    <NotifItem key={n.id} n={n} onRead={handleMarkRead} />
                  ))
                )}
              </div>

              {/* Footer */}
              <div className="px-3.5 py-2 border-t border-black/6 bg-zinc-50/80 flex items-center justify-between">
                <p className="text-[10px] text-black/30">
                  {notifications.length} notification{notifications.length !== 1 ? "s" : ""}
                </p>
                <button
                  onClick={load}
                  className="text-[11px] text-black/35 hover:text-black transition-colors"
                >
                  Refresh
                </button>
              </div>
            </div>
          )}
        </div>

      </header>
    </>
  );
}