"use client";

import React, { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const ORANGE = "#FF5A1F";

const LINKS = [
  { label: "How it works", href: "#how-it-works" },
  { label: "What is it", href: "#what-is" },
  { label: "Comparison", href: "#comparison" },
  { label: "Stories", href: "#testimonials" },
] as const;

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={[
        "fixed  inset-x-0 top-0 z-50 w-full transition-all duration-300",
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
            
          <Link    key={link.href}
              href={link.href}
              className="text-sm text-white/60 transition-colors duration-200 hover:text-white"
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* desktop CTA */}
        <Link
          href="/login"
          className="hidden items-center gap-2 rounded-lg bg-white px-4 py-2.5 text-[15px] font-medium text-black transition-opacity hover:opacity-90 md:flex"
        >
          <span className="flex h-5 w-5 items-center justify-center rounded bg-amber-400">
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none">
              <rect x="3" y="3" width="7" height="7" rx="1.5" fill="#111" />
              <rect x="14" y="3" width="7" height="7" rx="1.5" fill="#111" />
              <rect x="3" y="14" width="7" height="7" rx="1.5" fill="#111" />
              <rect x="14" y="14" width="7" height="7" rx="1.5" fill="#111" />
            </svg>
          </span>
          Try Diagnosis
        </Link>

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
              Try Diagnosis
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}