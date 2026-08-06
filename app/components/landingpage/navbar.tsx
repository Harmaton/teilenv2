"use client";

import React, { useState } from "react";
import { Menu, X } from "lucide-react";

const ORANGE = "#FF5A1F";

const LINKS = [
  { label: "How it works", href: "#how-it-works" },
  { label: "What is it", href: "#what-is" },
  { label: "Comparison", href: "#comparison" },
  { label: "Stories", href: "#testimonials" },
] as const;

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="relative z-20 w-full border-b border-white/10 bg-[#0a0e1a]">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 md:px-10">
        <a href="#" className="text-lg font-bold tracking-tight text-white">
          Teilen <span style={{ color: ORANGE }}>Teens</span>
        </a>

        {/* desktop links */}
        <div className="hidden items-center gap-8 md:flex">
          {LINKS.map((link) => (
            
            <a  key={link.href}
              href={link.href}
              className="text-sm text-white/60 transition-colors duration-200 hover:text-white"
            >
              {link.label}
            </a>
          ))}
        </div>

        {/* desktop CTA */}
        
         <a
          href="#"
           className="hidden md:flex items-center gap-2 rounded-lg bg-white px-4 py-2.5 text-[15px] font-medium text-black transition-opacity hover:opacity-90"
        >
          <span className="flex h-5 w-5 items-center justify-center rounded bg-amber-400">
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none">
              <rect x="3" y="3" width="7" height="7" rx="1.5" fill="#111" />
              <rect x="14" y="3" width="7" height="7" rx="1.5" fill="#111" />
              <rect x="3" y="14" width="7" height="7" rx="1.5" fill="#111" />
              <rect x="14" y="14" width="7" height="7" rx="1.5" fill="#111" />
            </svg>
          </span>
          Try for free
        </a>

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
        <div className="border-t border-white/10 bg-[#0a0e1a] px-6 pb-6 pt-4 md:hidden">
          <div className="flex flex-col gap-4">
            {LINKS.map((link) => (
              
              <a  key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="text-sm text-white/70 transition-colors duration-200 hover:text-white"
              >
                {link.label}
              </a>
            ))}
             <a
          href="#"
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
          Try for free
        </a>
          </div>
        </div>
      )}
    </header>
  );
}