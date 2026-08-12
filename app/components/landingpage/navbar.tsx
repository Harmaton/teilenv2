"use client";

import React, { useEffect, useState } from "react";
import { Menu, X, LogOut, User as UserIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { User } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/client";
import { logout } from "@/_actions/auth";

const LINKS = [
  { label: "¿Qué es?", href: "#what-is" },
  { label: "Comparativa", href: "#comparison" },
  { label: "Historias", href: "#testimonials" },
] as const;

export default function Navbar({ initialUser }: { initialUser: User | null }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [user, setUser] = useState<User | null>(initialUser);
  const [loggingOut, setLoggingOut] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Keep the navbar in sync with auth state changed elsewhere
  // (login in another tab, OAuth redirect completing, token refresh, etc.)
  useEffect(() => {
    const supabase = createClient();
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null);
      }
    );
    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    if (loggingOut) return;
    setLoggingOut(true);
    const result = await logout();
    if (result.success) {
      setUser(null);
      setOpen(false);
      router.replace("/");
      router.refresh();
    }
    setLoggingOut(false);
  };

  const displayName =
    (user?.user_metadata?.full_name as string | undefined)?.split(" ")[0] ??
    user?.email?.split("@")[0] ??
    "Cuenta";

  return (
    <header
      className={[
        "fixed inset-x-0 top-0 z-50 w-full transition-all duration-300",
        scrolled
          ? "border-b border-white/10 bg-[#0a0e1a]/60 shadow-[0_8px_30px_-12px_rgba(0,0,0,0.6)] backdrop-blur-xl backdrop-saturate-150"
          : "border-b border-transparent bg-[#0a0e1a]",
      ].join(" ")}
    >
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 md:px-10">
        <Link href="/">
          <Image src="/logo.png" alt="Logo" width={40} height={40} />
        </Link>

        {/* desktop links */}
        <div className="hidden items-center gap-8 md:flex">
          {LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm text-white/60 transition-colors duration-200 hover:text-white"
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* desktop CTA */}
        <div className="hidden items-center gap-3 md:flex">
          {user ? (
            <>
              <Link
                href="/dashboard"
                className="flex items-center gap-2 rounded-lg border border-white/10 px-4 py-2.5 text-[15px] font-medium text-white/80 transition-colors hover:text-white"
              >
                <UserIcon className="h-4 w-4" />
                {displayName}
              </Link>
              <button
                onClick={handleLogout}
                disabled={loggingOut}
                className="flex items-center gap-2 rounded-lg bg-white px-4 py-2.5 text-[15px] font-medium text-black transition-opacity hover:opacity-90 disabled:opacity-60"
              >
                <LogOut className="h-4 w-4" />
                {loggingOut ? "Saliendo..." : "Salir"}
              </button>
            </>
          ) : (
            <Link
              href="/login"
              className="flex items-center gap-2 rounded-lg bg-white px-4 py-2.5 text-[15px] font-medium text-black transition-opacity hover:opacity-90"
            >
              <span className="flex h-5 w-5 items-center justify-center rounded bg-amber-400">
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none">
                  <rect x="3" y="3" width="7" height="7" rx="1.5" fill="#111" />
                  <rect x="14" y="3" width="7" height="7" rx="1.5" fill="#111" />
                  <rect x="3" y="14" width="7" height="7" rx="1.5" fill="#111" />
                  <rect x="14" y="14" width="7" height="7" rx="1.5" fill="#111" />
                </svg>
              </span>
              Probar diagnóstico
            </Link>
          )}
        </div>

        {/* mobile toggle */}
        <button
          onClick={() => setOpen((v) => !v)}
          className="inline-flex items-center justify-center rounded-lg border border-white/10 p-2 text-white md:hidden"
          aria-label="Toggle menu"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </nav>

      {/* mobile menu */}
      {open && (
        <div
          className={[
            "border-t border-white/10 px-6 pb-6 pt-4 transition-colors duration-300 md:hidden",
            scrolled ? "bg-[#0a0e1a]/70 backdrop-blur-xl" : "bg-[#0a0e1a]",
          ].join(" ")}
        >
          <div className="flex flex-col gap-4">
            {LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="text-sm text-white/70 transition-colors duration-200 hover:text-white"
              >
                {link.label}
              </Link>
            ))}

            {user ? (
              <>
                <Link
                  href="/dashboard"
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-2 rounded-lg border border-white/10 px-4 py-2.5 text-[15px] font-medium text-white/80"
                >
                  <UserIcon className="h-4 w-4" />
                  {displayName}
                </Link>
                <button
                  onClick={handleLogout}
                  disabled={loggingOut}
                  className="flex items-center gap-2 rounded-lg bg-white px-4 py-2.5 text-[15px] font-medium text-black transition-opacity hover:opacity-90 disabled:opacity-60"
                >
                  <LogOut className="h-4 w-4" />
                  {loggingOut ? "Saliendo..." : "Salir"}
                </button>
              </>
            ) : (
              <Link
                href="/login"
                onClick={() => setOpen(false)}
                className="flex items-center gap-2 rounded-lg bg-white px-4 py-2.5 text-[15px] font-medium text-black transition-opacity hover:opacity-90"
              >
                <span className="flex h-5 w-5 items-center justify-center rounded bg-amber-400">
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none">
                    <rect x="3" y="3" width="7" height="7" rx="1.5" fill="#111" />
                    <rect x="14" y="3" width="7" height="7" rx="1.5" fill="#111" />
                    <rect x="3" y="14" width="7" height="7" rx="1.5" fill="#111" />
                    <rect x="14" y="14" width="7" height="7" rx="1.5" fill="#111" />
                  </svg>
                </span>
                Probar diagnóstico
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
}