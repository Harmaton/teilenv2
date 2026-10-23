"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter, usePathname } from "next/navigation";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { NotificationBell } from "@/app/components/notifications/notification-bell";
import { ChevronRight } from "lucide-react";

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
  const currentRoute = ROUTES.find((route) => pathname === route.path || pathname.startsWith(`${route.path}/`));

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
    <header className="sticky top-0 z-30 flex h-16 w-full shrink-0 items-center gap-3 border-b border-[#141b3c]/10 bg-[#f6f5fb]/90 px-4 backdrop-blur-xl sm:px-6">

        {/* ── Burger ── */}
        <SidebarTrigger className="rounded-xl text-[#545c7e] hover:bg-white hover:text-[#141b3c]" />

        {/* ── Search ── */}
        <div ref={searchRef} className="relative z-40 w-full max-w-sm flex-1">
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#545c7e]/60" size={14} />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onFocus={() => setSearchFocused(true)}
              placeholder="Buscar secciones…"
              className={cn(
                "h-10 w-full rounded-xl pl-9 pr-12 text-[13px]",
                "border border-[#141b3c]/10 bg-white/80 text-[#141b3c] placeholder:text-[#545c7e]/55 shadow-sm",
                "outline-none transition-all focus:border-[#f27a1a]/60 focus:bg-white focus:ring-2 focus:ring-[#f27a1a]/15"
              )}
            />
            <kbd className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded-md border border-[#141b3c]/10 bg-[#f6f5fb] px-1.5 py-0.5 font-mono text-[10px] text-[#545c7e]/65">
              ⌘K
            </kbd>
          </div>

          {searchFocused && (
            <div className="absolute left-0 right-0 top-[calc(100%+8px)] overflow-hidden rounded-2xl border border-[#141b3c]/10 bg-white shadow-[0_18px_45px_-24px_rgba(20,27,60,.4)]">
              {filteredRoutes.length === 0 ? (
                <p className="py-4 text-center text-[12px] text-[#545c7e]">Sin resultados</p>
              ) : (
                filteredRoutes.map((r) => (
                  <button
                    key={r.path}
                    onClick={() => navigate(r.path)}
                    className={cn(
                      "flex items-center gap-2.5 w-full px-3 py-2.5 text-left",
                      "border-b border-[#141b3c]/5 transition-colors last:border-0 hover:bg-[#fff8f2]",
                      pathname === r.path && "bg-[#fff3cf]"
                    )}
                  >
                    <div className="flex flex-col min-w-0">
                      <span className="text-[13px] font-semibold leading-tight text-[#141b3c]">{r.label}</span>
                      <span className="text-[11px] text-[#545c7e]/65">{r.path}</span>
                    </div>
                    {pathname === r.path && (
                      <span className="ml-auto shrink-0 rounded-full border border-[#f27a1a]/30 bg-[#fff8f2] px-2 py-0.5 text-[10px] font-semibold text-[#e46a12]">
                        actual
                      </span>
                    )}
                  </button>
                ))
              )}
            </div>
          )}
        </div>

        <div className="hidden flex-1 items-center gap-2 pl-2 text-xs text-[#545c7e] md:flex"><ChevronRight className="h-3.5 w-3.5 text-[#f27a1a]" /><span className="font-semibold text-[#141b3c]">{currentRoute?.label ?? "Tu espacio"}</span></div>
        <div className="flex-1 md:hidden" />

        <NotificationBell />
      </header>
  );
}