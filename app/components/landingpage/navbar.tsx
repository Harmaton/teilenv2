"use client";

import React, { useEffect, useState } from "react";
import type { User } from "@supabase/supabase-js";
import { theme } from "@/lib/theme";
import { createClient } from "@/lib/supabase/client";

export default function Nav({ initialUser }: { initialUser: User | null }) {
  const [user, setUser] = useState<User | null>(initialUser);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Keep in sync with auth state changed elsewhere (other tab, OAuth redirect, token refresh)
  useEffect(() => {
    const supabase = createClient();
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });
    return () => subscription.unsubscribe();
  }, []);

  const displayName =
    (user?.user_metadata?.full_name as string | undefined)?.split(" ")[0] ??
    user?.email?.split("@")[0] ??
    "";

  const avatarUrl = user?.user_metadata?.avatar_url as string | undefined;
  const initial = displayName ? displayName[0].toUpperCase() : "?";

  return (
    <nav
      style={{
        position: "fixed",
        top: scrolled ? 12 : 0,
        left: scrolled ? 16 : 0,
        right: scrolled ? 16 : 0,
        zIndex: 999,
        backgroundColor: theme.colors.white,
        border: scrolled ? "none" : `1px solid ${theme.colors.border}`,
        borderRadius: scrolled ? 999 : 0,
        boxShadow: scrolled ? "0 8px 30px -12px rgba(0,0,0,0.25)" : "none",
        height: 68,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 48px",
        fontFamily: theme.font,
        transition: "all 0.3s ease",
      }}
    >
      <div>
        <img src="/logo.png" alt="Teilen Teens" style={{ height: 38, display: "block" }} />
      </div>

      {user ? (
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          {avatarUrl ? (
            <img
              src={avatarUrl}
              alt={displayName || "Usuario"}
              style={{
                width: 36,
                height: 36,
                borderRadius: "50%",
                objectFit: "cover",
                display: "block",
              }}
            />
          ) : (
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: "50%",
                backgroundColor: theme.colors.orange,
                color: theme.colors.white,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontFamily: theme.font,
                fontWeight: 700,
                fontSize: 14,
              }}
            >
              {initial}
            </div>
          )}
          {displayName && (
            <span
              style={{
                fontFamily: theme.font,
                fontWeight: 600,
                fontSize: 14,
                color: "#111",
              }}
            >
              {displayName}
            </span>
          )}
        </div>
      ) : (
        <a
          href="/dashboard"
          rel="noopener noreferrer"
          style={{
            backgroundColor: theme.colors.orange,
            color: theme.colors.white,
            padding: "10px 22px",
            borderRadius: 50,
            fontFamily: theme.font,
            fontWeight: 700,
            fontSize: 12,
            letterSpacing: ".04em",
            textTransform: "uppercase",
            textDecoration: "none",
            display: "inline-block",
          }}
        >
          Hacer el test →
        </a>
      )}
    </nav>
  );
}