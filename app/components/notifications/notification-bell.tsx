"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Bell,
  BellOff,
  Check,
  Info,
  AlertTriangle,
  CheckCircle2,
  X,
  XCircle,
  RefreshCw,
  ExternalLink,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";
import {
  getNotifications,
  markNotificationRead,
  markAllNotificationsRead,
} from "@/_actions/notifications";
import type { AppNotification, NotificationType } from "@/_actions/notifications";

const ACCENT = "#FF5A1F";

// ─── Type metadata ──────────────────────────────────────────────

const TYPE_META: Record<
  NotificationType,
  { Icon: React.ElementType; ring: string; chip: string; unread: string }
> = {
  info: {
    Icon: Info,
    ring: "bg-blue-50 text-blue-600",
    chip: "bg-blue-500",
    unread: "bg-blue-500",
  },
  success: {
    Icon: CheckCircle2,
    ring: "bg-emerald-50 text-emerald-600",
    chip: "bg-emerald-500",
    unread: "bg-emerald-500",
  },
  warning: {
    Icon: AlertTriangle,
    ring: "bg-amber-50 text-amber-600",
    chip: "bg-amber-500",
    unread: "bg-amber-500",
  },
  error: {
    Icon: XCircle,
    ring: "bg-red-50 text-red-600",
    chip: "bg-red-500",
    unread: "bg-red-500",
  },
};

const FILTERS = [
  { key: "all", label: "Todas" },
  { key: "unread", label: "Sin leer" },
] as const;

type Filter = (typeof FILTERS)[number]["key"];

// ─── Helpers ────────────────────────────────────────────────────

/** Spanish, humanised relative time. */
function timeAgo(iso: string) {
  const seconds = Math.max(0, Math.floor((Date.now() - new Date(iso).getTime()) / 1000));

  if (seconds < 45) return "recién";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `hace ${minutes} min`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `hace ${hours} h`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `hace ${days} d`;
  return new Date(iso).toLocaleDateString("es", { day: "numeric", month: "short" });
}

function dayLabel(iso: string) {
  const date = new Date(iso);
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);

  const sameDay = (a: Date, b: Date) => a.toDateString() === b.toDateString();
  if (sameDay(date, today)) return "Hoy";
  if (sameDay(date, yesterday)) return "Ayer";
  return date.toLocaleDateString("es", { day: "numeric", month: "long" });
}

// ─── Toast ──────────────────────────────────────────────────────

interface ToastItem {
  id: string;
  notification: AppNotification;
}

function Toast({ item, onDismiss }: { item: ToastItem; onDismiss: (id: string) => void }) {
  const { Icon, chip } = TYPE_META[item.notification.type];

  useEffect(() => {
    const timer = setTimeout(() => onDismiss(item.id), 5500);
    return () => clearTimeout(timer);
  }, [item.id, onDismiss]);

  return (
    <div
      role="status"
      className="pointer-events-auto flex w-[min(22rem,calc(100vw-2rem))] items-start gap-3 rounded-2xl border-black/[0.07] bg-white/95 p-3.5 shadow-[0_18px_40px_-16px_rgba(0,0,0,0.35)] backdrop-blur animate-in slide-in-from-right-4 duration-300"
    >
      <span className={cn("flex h-8 w-8 shrink-0 items-center justify-center rounded-xl text-white", chip)}>
        <Icon size={15} />
      </span>

      <div className="min-w-0 flex-1">
        <p className="text-[12.5px] font-semibold leading-snug text-black">{item.notification.title}</p>
        {item.notification.body && (
          <p className="mt-0.5 line-clamp-2 text-[11.5px] leading-snug text-black/50">
            {item.notification.body}
          </p>
        )}
      </div>

      <div className="flex shrink-0 items-center gap-0.5">
        {item.notification.href && (
          <a
            href={item.notification.href}
            className="rounded-full p-1 text-black/25 transition-colors hover:bg-black/5 hover:text-black/70"
            aria-label="Abrir"
          >
            <ExternalLink size={12} />
          </a>
        )}
        <button
          onClick={() => onDismiss(item.id)}
          className="rounded-full p-1 text-black/25 transition-colors hover:bg-black/5 hover:text-black/70"
          aria-label="Cerrar"
        >
          <X size={12} />
        </button>
      </div>
    </div>
  );
}

// ─── Row ────────────────────────────────────────────────────────

function NotifRow({
  n,
  onRead,
}: {
  n: AppNotification;
  onRead: (id: string) => void;
}) {
  const router = useRouter();
  const { Icon, ring, unread } = TYPE_META[n.type];

  return (
    <button
      type="button"
      onClick={() => {
        if (!n.read) onRead(n.id);
        if (n.href) router.push(n.href);
      }}
      className={cn(
        "group relative flex w-full items-start gap-3 px-4 py-3 text-left transition-colors hover:bg-black/[0.025]",
        !n.read && "bg-orange-50/40"
      )}
    >
      {!n.read && <span className={cn("absolute left-0 top-0 h-full w-[2px]", unread)} />}

      <span className={cn("flex h-7 w-7 shrink-0 items-center justify-center rounded-full", ring)}>
        <Icon size={13} />
      </span>

      <span className="min-w-0 flex-1">
        <span className={cn("block text-[12.5px] leading-snug", n.read ? "text-black/60" : "font-semibold text-black")}>
          {n.title}
        </span>
        {n.body && <span className="mt-0.5 block line-clamp-2 text-[11.5px] leading-snug text-black/45">{n.body}</span>}
        <span className="mt-1 block text-[10.5px] text-black/30">{timeAgo(n.created_at)}</span>
      </span>

      {n.href && (
        <ExternalLink
          size={11}
          className="mt-1 shrink-0 text-black/15 transition-opacity group-hover:opacity-100"
        />
      )}
    </button>
  );
}

// ─── Bell ───────────────────────────────────────────────────────

export function NotificationBell() {
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<Filter>("all");
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const [live, setLive] = useState(false);

  const wrapRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const seenIdsRef = useRef<Set<string> | null>(null);
  const profileIdRef = useRef<string | null>(null);

  const unread = notifications.filter((n) => !n.read).length;

  const displayed = notifications.filter((n) =>
    filter === "unread" ? !n.read : true
  );

  // ── Data loading ─────────────────────────────────────────────

  const load = useCallback(async (mode: "initial" | "refresh" | "poll" = "poll") => {
    if (mode === "initial") setLoading(true);
    if (mode === "refresh") setRefreshing(true);
    try {
      const data = await getNotifications();
      setNotifications(data);
      setError(null);
      seenIdsRef.current = new Set(data.map((n) => n.id));
    } catch {
      setError("No pudimos cargar tus notificaciones.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    // Deferred so the first paint is not blocked by the fetch.
    const timer = window.setTimeout(() => void load("initial"), 0);
    return () => window.clearTimeout(timer);
  }, [load]);

  // Poll as a safety net. Realtime is the fast path; this covers dropped
  // sockets and reports generated in another tab.
  useEffect(() => {
    const interval = window.setInterval(() => {
      if (document.visibilityState === "visible") void load("poll");
    }, 30000);
    return () => window.clearInterval(interval);
  }, [load]);

  // Refresh when the tab becomes visible again.
  useEffect(() => {
    const onVisible = () => {
      if (document.visibilityState === "visible") void load("poll");
    };
    document.addEventListener("visibilitychange", onVisible);
    return () => document.removeEventListener("visibilitychange", onVisible);
  }, [load]);

  // ── Realtime ─────────────────────────────────────────────────

  useEffect(() => {
    const supabase = createClient();

    // Resolve the signed-in profile so realtime events can be scoped to it.
    let active = true;
    void supabase.auth.getUser().then(({ data: { user } }) => {
      if (active) profileIdRef.current = user?.id ?? null;
    });

    const channel = supabase
      .channel(`notifications:${profileIdRef.current ?? "pending"}`)
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "notifications" },
        (payload) => {
          const incoming = payload.new as AppNotification;

          // Realtime broadcasts are not scoped per-user on every setup, and the
          // list is the source of truth for who "we" are — drop anything that
          // does not belong to the signed-in profile.
          if (profileIdRef.current && incoming.profile_id !== profileIdRef.current) return;

          setNotifications((prev) => {
            if (prev.some((n) => n.id === incoming.id)) return prev;
            if (seenIdsRef.current) seenIdsRef.current.add(incoming.id);
            return [incoming, ...prev].slice(0, 50);
          });

          // Only toast genuinely new rows, never rows we just fetched.
          if (seenIdsRef.current && !seenIdsRef.current.has(incoming.id)) {
            setToasts((t) => [...t, { id: `toast-${incoming.id}`, notification: incoming }]);
          }
        }
      )
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "notifications" },
        (payload) => {
          const updated = payload.new as AppNotification;
          setNotifications((prev) =>
            prev.map((n) => (n.id === updated.id ? { ...n, ...updated } : n))
          );
        }
      )
      .subscribe((status) => {
        const isLive = status === "SUBSCRIBED";
        setLive(isLive);
        // Reconcile if the socket never came up (or dropped).
        if (status === "CHANNEL_ERROR" || status === "TIMED_OUT" || status === "CLOSED") {
          void load("poll");
        }
      });

    return () => {
      active = false;
      void supabase.removeChannel(channel);
    };
  }, [load]);

  // ── Dismiss / close ──────────────────────────────────────────

  useEffect(() => {
    if (!open) return;

    const onPointerDown = (e: MouseEvent) => {
      if (!wrapRef.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        buttonRef.current?.focus();
      }
    };

    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  // ── Mutations (optimistic, reverted on failure) ───────────────

  const handleMarkRead = useCallback(async (id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
    try {
      await markNotificationRead(id);
    } catch {
      setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: false } : n)));
    }
  }, []);

  const handleMarkAllRead = useCallback(async () => {
    const snapshot = notifications;
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    try {
      await markAllNotificationsRead();
    } catch {
      setNotifications(snapshot);
    }
  }, [notifications]);

  const dismissToast = useCallback((toastId: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== toastId));
  }, []);

  // ── Group rows by day ────────────────────────────────────────

  const grouped = useMemo(() => {
    const buckets: { label: string; items: AppNotification[] }[] = [];
    for (const n of displayed) {
      const label = dayLabel(n.created_at);
      const last = buckets[buckets.length - 1];
      if (last && last.label === label) last.items.push(n);
      else buckets.push({ label, items: [n] });
    }
    return buckets;
  }, [displayed]);

  return (
    <>
      <div className="pointer-events-none fixed right-4 top-4 z-[100] flex flex-col gap-2">
        {toasts.map((t) => (
          <Toast key={t.id} item={t} onDismiss={dismissToast} />
        ))}
      </div>

      <div ref={wrapRef} className="relative">
        <button
          ref={buttonRef}
          type="button"
          onClick={() => setOpen((o) => !o)}
          aria-label={`Notificaciones${unread > 0 ? ` (${unread} sin leer)` : ""}`}
          aria-expanded={open}
          className={cn(
            "relative flex h-9 w-9 items-center justify-center rounded-full transition-colors hover:bg-black/[0.05]",
            open && "bg-black/[0.06]"
          )}
        >
          <Bell size={16} className={cn("text-black transition-colors", open && "text-black/70")} />

          {unread > 0 && (
            <span
              className="absolute -right-0.5 -top-0.5 flex h-4 min-w-[16px] items-center justify-center rounded-full px-1 text-[9.5px] font-bold text-white ring-2 ring-white"
              style={{ backgroundColor: ACCENT }}
            >
              {unread > 9 ? "9+" : unread}
            </span>
          )}
        </button>

        {open && (
          <div className="absolute right-0 top-[calc(100%+8px)] z-50 w-[min(23rem,calc(100vw-2rem))] overflow-hidden rounded-2xl border-black/[0.07] bg-white shadow-[0_24px_60px_-20px_rgba(0,0,0,0.35)]">
            {/* Header */}
            <div className="flex items-center justify-between gap-2 border-b border-black/[0.06] px-4 py-3">
              <div className="flex items-center gap-2">
                <span className="text-[13px] font-semibold text-black">Notificaciones</span>
                {unread > 0 && (
                  <span
                    className="rounded-full px-1.5 py-px text-[10px] font-bold text-white"
                    style={{ backgroundColor: ACCENT }}
                  >
                    {unread}
                  </span>
                )}
                <span
                  className={cn(
                    "flex items-center gap-1 text-[10px]",
                    live ? "text-emerald-600" : "text-black/25"
                  )}
                  title={live ? "Conectado en tiempo real" : "Actualización periódica"}
                >
                  <span
                    className={cn(
                      "h-1.5 w-1.5 rounded-full",
                      live ? "animate-pulse bg-emerald-500" : "bg-black/20"
                    )}
                  />
                  {live ? "En vivo" : "Auto"}
                </span>
              </div>

              <div className="flex items-center gap-1">
                {unread > 0 && (
                  <button
                    type="button"
                    onClick={handleMarkAllRead}
                    className="rounded-full p-1.5 text-black/35 transition-colors hover:bg-black/5 hover:text-black"
                    aria-label="Marcar todas como leídas"
                    title="Marcar todas como leídas"
                  >
                    <Check size={13} />
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => void load("refresh")}
                  className={cn(
                    "rounded-full p-1.5 text-black/35 transition-colors hover:bg-black/5 hover:text-black",
                    refreshing && "animate-spin"
                  )}
                  aria-label="Actualizar"
                  title="Actualizar"
                >
                  <RefreshCw size={13} />
                </button>
              </div>
            </div>

            {/* Filters */}
            <div className="flex gap-1 border-b border-black/[0.05] px-3 py-2">
              {FILTERS.map((f) => {
                const count =
                  f.key === "unread" ? unread : notifications.length;
                return (
                  <button
                    key={f.key}
                    type="button"
                    onClick={() => setFilter(f.key)}
                    className={cn(
                      "rounded-full px-2.5 py-1 text-[11.5px] font-medium transition-colors",
                      filter === f.key
                        ? "text-white"
                        : "text-black/45 hover:bg-black/[0.05] hover:text-black"
                    )}
                    style={filter === f.key ? { backgroundColor: "#111" } : undefined}
                  >
                    {f.label}
                    <span className={cn("ml-1 text-[10px]", filter === f.key ? "text-white/60" : "text-black/30")}>
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* List */}
            <div className="max-h-[min(26rem,60vh)] overflow-y-auto overscroll-contain">
              {loading ? (
                <div className="flex flex-col items-center gap-2 py-12">
                  <RefreshCw size={16} className="animate-spin text-black/20" />
                  <p className="text-[11.5px] text-black/30">Cargando…</p>
                </div>
              ) : error ? (
                <div className="flex flex-col items-center gap-2 py-12 px-6 text-center">
                  <AlertTriangle size={18} className="text-amber-500" />
                  <p className="text-[11.5px] text-black/45">{error}</p>
                  <button
                    type="button"
                    onClick={() => void load("initial")}
                    className="rounded-full border-black/10 px-3 py-1 text-[11.5px] font-medium text-black/60 transition-colors hover:bg-black/[0.04]"
                  >
                    Reintentar
                  </button>
                </div>
              ) : displayed.length === 0 ? (
                <div className="flex flex-col items-center gap-2 py-12 px-6 text-center">
                  {filter === "unread" ? (
                    <CheckCircle2 size={20} className="text-black/15" />
                  ) : (
                    <BellOff size={20} className="text-black/15" />
                  )}
                  <p className="text-[12px] font-medium text-black/50">
                    {filter === "unread" ? "Todo leído" : "Sin notificaciones"}
                  </p>
                  <p className="text-[11.5px] text-black/30">
                    {filter === "unread"
                      ? "No tenés nada pendiente."
                      : "Te avisamos cuando tu informe esté listo."}
                  </p>
                </div>
              ) : (
                grouped.map((bucket) => (
                  <div key={bucket.label}>
                    <p className="sticky top-0 z-10 bg-white/90 px-4 py-1.5 text-[10px] font-semibold uppercase tracking-[0.1em] text-black/30 backdrop-blur">
                      {bucket.label}
                    </p>
                    {bucket.items.map((n) => (
                      <div key={n.id} className="border-b border-black/[0.04] last:border-0">
                        <NotifRow n={n} onRead={handleMarkRead} />
                      </div>
                    ))}
                  </div>
                ))
              )}
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between border-t border-black/[0.06] bg-black/[0.015] px-4 py-2">
              <p className="text-[10.5px] text-black/30">
                {notifications.length === 0
                  ? "Sin actividad"
                  : `${notifications.length} notificación${notifications.length === 1 ? "" : "es"}`}
              </p>
              {displayed.length > 0 && filter === "all" && unread > 0 && (
                <button
                  type="button"
                  onClick={handleMarkAllRead}
                  className="text-[11px] font-medium text-black/40 transition-colors hover:text-black"
                >
                  Marcar leídas
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </>
  );
}
