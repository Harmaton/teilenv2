"use client";

// Footer — Requires: npm install lucide-react

import React from "react";
import { MessageCircle } from "lucide-react";

function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className={className}>
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </svg>
  );
}

function FacebookIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    </svg>
  );
}

function LinkedinIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
      <rect x="2" y="9" width="4" height="12" />
      <circle cx="4" cy="4" r="2" />
    </svg>
  );
}

function FooterNightSky() {
  return (
    <svg
      className="absolute inset-0 h-full w-full"
      viewBox="0 0 1440 420"
      preserveAspectRatio="xMidYMax slice"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="footerSky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#0a0e1a" />
          <stop offset="55%" stopColor="#0d1424" />
          <stop offset="100%" stopColor="#1a1610" />
        </linearGradient>
        <radialGradient id="footerFlare" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#FF7A33" stopOpacity="0.35" />
          <stop offset="100%" stopColor="#FF7A33" stopOpacity="0" />
        </radialGradient>
      </defs>

      <rect width="1440" height="420" fill="url(#footerSky)" />

      {/* stars, sparser than hero */}
      <g fill="#ffffff">
        {Array.from({ length: 55 }).map((_, i) => {
          const x = (i * 113) % 1440;
          const y = (i * 41) % 260;
          const r = i % 4 === 0 ? 1.4 : 0.8;
          const o = 0.2 + ((i * 29) % 55) / 100;
          return <circle key={i} cx={x} cy={y} r={r} opacity={o} />;
        })}
      </g>

      {/* faint galaxy */}
      <ellipse cx="1150" cy="120" rx="80" ry="30" fill="#c9b98f" opacity="0.12" transform="rotate(-18 1150 120)" />

      {/* single distant flare, echoes hero's bright star */}
      <circle cx="230" cy="90" r="70" fill="url(#footerFlare)" />
      <circle cx="230" cy="90" r="2.5" fill="#ffe9c7" />

      {/* rolling hill silhouette along the bottom */}
      <path
        d="M0 300 C 220 260, 420 320, 680 290 C 900 265, 1080 310, 1440 280 L1440 420 L0 420 Z"
        fill="#120e09"
        opacity="0.9"
      />
      <path
        d="M0 340 C 260 320, 520 360, 800 340 C 1040 322, 1240 355, 1440 335 L1440 420 L0 420 Z"
        fill="#0a0805"
      />

      {/* tiny tree silhouette, right side, mirrors hero's left tree */}
      <path
        d="M1380 420 L1380 360 C 1368 355, 1352 345, 1362 330 C 1348 328, 1340 312, 1362 305 C 1354 290, 1376 275, 1392 288 C 1406 273, 1428 287, 1417 305 C 1436 310, 1430 328, 1412 333 C 1425 346, 1412 362, 1396 365 L1396 420 Z"
        fill="#0a0805"
        opacity="0.85"
      />
    </svg>
  );
}

const Footer = () => {
  return (
    <footer className="relative w-full overflow-hidden border-x border-white/10 bg-[#0a0e1a] px-6 pb-10 pt-16 text-white sm:px-10 md:pt-24">
      <FooterNightSky />

      {/* scrim so text stays legible over the illustration */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-[#0a0e1a] via-[#0a0e1a]/70 to-[#0a0e1a]" />

      <div className="relative z-10 mx-auto max-w-6xl">
        <div className="mb-10 grid gap-10 md:grid-cols-2 md:gap-8">
          <div>
            <h3 className="text-2xl font-bold tracking-tight">
              Teilen <span className="text-[#FF7A33]">Teens</span>
            </h3>
            <p className="mt-4 max-w-sm leading-relaxed text-white/50">
              El diagnóstico que revela tu talento natural, tu superpoder
              oculto y el camino donde realmente puedes brillar.
            </p>
          </div>

          <div className="flex flex-col gap-5 md:items-end">
            
           <a   href="https://wa.me/5435175680433"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-white/60 transition-colors duration-300 hover:text-[#FF9A5C]"
            >
              <MessageCircle className="h-5 w-5" />
              <span>+54 3517 56-8043</span>
            </a>

            <div className="flex gap-3">
              
              <a  href="https://www.instagram.com/simplelife.mindset/"
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full border border-white/10 bg-white/5 p-2.5 backdrop-blur-sm transition-all duration-300 hover:scale-110 hover:border-[#FF5A1F]/40 hover:bg-[#FF5A1F]/15"
              >
                <InstagramIcon className="h-4.5 w-4.5" />
              </a>
              
             <a   href="https://www.facebook.com/simplelifemindset"
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full border border-white/10 bg-white/5 p-2.5 backdrop-blur-sm transition-all duration-300 hover:scale-110 hover:border-[#FF5A1F]/40 hover:bg-[#FF5A1F]/15"
              >
                <FacebookIcon className="h-4.5 w-4.5" />
              </a>
              
              <a  href="https://www.linkedin.com/company/simplelifeoficial/"
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full border border-white/10 bg-white/5 p-2.5 backdrop-blur-sm transition-all duration-300 hover:scale-110 hover:border-[#FF5A1F]/40 hover:bg-[#FF5A1F]/15"
              >
                <LinkedinIcon className="h-4.5 w-4.5" />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 pt-7 text-center">
          <p className="text-sm text-white/35">
            Copyright 2025 Teilen Teens. Todos los derechos reservados.
          </p>
        </div>

      </div>
    </footer>
  );
};

export default Footer;