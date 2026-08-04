import React from "react";

const NAV_LINKS = ["Features", "Pricing", "Blog", "Docs"];

function LogoMark() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M12 2 L21 20 H15.5 L12 12 L8.5 20 H3 Z"
        fill="white"
      />
    </svg>
  );
}

export default function Navbar() {
  return (
    <header className="w-full">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5 md:px-10">
        {/* Logo */}
        <a href="#" className="flex items-center gap-2.5">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/15 bg-white/5">
            <LogoMark />
          </span>
          <span className="text-lg font-semibold tracking-tight text-white">
            Teilenteen
          </span>
        </a>

        {/* Center links */}
        <div className="hidden items-center gap-8 md:flex">
          {NAV_LINKS.map((link) => (
            <a
              key={link}
              href="#"
              className="text-[15px] text-white/70 transition-colors hover:text-white"
            >
              {link}
            </a>
          ))}
        </div>

        {/* CTA */}
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
      </nav>
    </header>
  );
}