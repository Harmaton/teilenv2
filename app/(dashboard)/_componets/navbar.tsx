"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter, usePathname } from "next/navigation";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { NotificationBell } from "@/app/components/notifications/notification-bell";

type RouteEntry = { label: string; path: string; group: string };

const ROUTES: RouteEntry[] = [
  { label: "Panel",       path: "/dashboard", group: "Principal" },
  { label: "Pruebas",     path: "/tests",     group: "Evaluaciones" },
  { label: "Informes",    path: "/reports",   group: "Evaluaciones" },
  { label: "Perfil",      path: "/profile",   group: "Cuenta" },
  { label: "Configuración", path: "/settings", group: "Cuenta" },
];

// ─── Navbar ───────────────────────────────────────────────────────────────────

export function Navbar() {
  const router   = useRouter();
  const pathname = usePathname();

  const [query, setQuery] = useState("");
  const [searchFocused, setSearchFocused] = useState(false);

  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const filteredRoutes = query
    ? ROUTES.filter((r) =>
        r.label.toLowerCase().includes(query.toLowerCase()) ||
        r.group.toLowerCase().includes(query.toLowerCase())
      )
    : ROUTES;

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
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const navigate = useCallback((path: string) => {
    setSearchFocused(false);
    setQuery("");
    router.push(path);
  }, [router]);

  // ─────────────────────────────────────────────────────────────────────────

  return (
    <header className="h-[52px] w-full border-b border-black/10 bg-white flex items-center gap-3 px-4 shrink-0">

        {/* ── Burger ── */}
        <SidebarTrigger />

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
              placeholder="Buscar secciones…"
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
                <p className="py-4 text-center text-[12px] text-black/40">Sin resultados</p>
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
                        actual
                      </span>
                    )}
                  </button>
                ))
              )}
            </div>
          )}
        </div>

        <div className="flex-1" />

        <NotificationBell />
      </header>
  );
}