import { PlayCircle } from "lucide-react";
import React from "react";

function NightSkyIllustration() {
  return (
    <svg
      className="absolute inset-0 h-full w-full"
      viewBox="0 0 1440 820"
      preserveAspectRatio="xMidYMid slice"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#0a0e1a" />
          <stop offset="45%" stopColor="#131c33" />
          <stop offset="75%" stopColor="#2b2a3d" />
          <stop offset="100%" stopColor="#3d3226" />
        </linearGradient>
        <linearGradient id="ground" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#4a3a24" />
          <stop offset="100%" stopColor="#1c1610" />
        </linearGradient>
        <radialGradient id="flare" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#FF7A33" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#FF7A33" stopOpacity="0" />
        </radialGradient>
      </defs>

      <rect width="1440" height="820" fill="url(#sky)" />

      {/* stars */}
      <g fill="#ffffff">
        {Array.from({ length: 90 }).map((_, i) => {
          const x = (i * 97) % 1440;
          const y = (i * 53) % 480;
          const r = (i % 3 === 0 ? 1.6 : 0.9);
          const o = 0.3 + ((i * 37) % 60) / 100;
          return <circle key={i} cx={x} cy={y} r={r} opacity={o} />;
        })}
      </g>

      {/* two soft galaxies */}
      <ellipse cx="620" cy="270" rx="90" ry="34" fill="#c9b98f" opacity="0.18" transform="rotate(-20 620 270)" />
      <ellipse cx="960" cy="360" rx="70" ry="26" fill="#c9b98f" opacity="0.16" transform="rotate(-15 960 360)" />

      {/* bright star flares */}
      <circle cx="1110" cy="230" r="80" fill="url(#flare)" opacity="0.5" />
      <circle cx="1110" cy="230" r="3" fill="#ffe9c7" />

      {/* rocket trail */}
      <path
        d="M 1120 780 C 1180 620, 1230 480, 1300 380"
        stroke="url(#flare)"
        strokeWidth="26"
        fill="none"
        strokeLinecap="round"
        opacity="0.85"
      />

      {/* rocket */}
      <g transform="translate(1300 380) rotate(-35)">
        <ellipse cx="0" cy="18" rx="10" ry="22" fill="#FF5A1F" opacity="0.9" />
        <path
          d="M0 -32 C 9 -18 9 6 0 20 C -9 6 -9 -18 0 -32 Z"
          fill="#e7e6ea"
        />
        <path d="M-8 6 L-20 22 L-6 16 Z" fill="#cfced6" />
        <path d="M8 6 L20 22 L6 16 Z" fill="#cfced6" />
        <circle cx="0" cy="-8" r="4.5" fill="#5f7aa8" />
      </g>

      {/* rolling hills */}
      <path
        d="M0 620 C 220 560, 420 660, 680 610 C 900 570, 1080 640, 1440 590 L1440 820 L0 820 Z"
        fill="url(#ground)"
        opacity="0.95"
      />
      <path
        d="M0 690 C 260 650, 520 720, 800 680 C 1040 645, 1240 710, 1440 670 L1440 820 L0 820 Z"
        fill="#120e09"
      />

      {/* tree silhouette, left */}
      <path
        d="M60 820 L60 640 C 40 630, 10 610, 30 580 C 5 575, -10 545, 30 530 C 15 500, 55 470, 85 495 C 110 465, 150 490, 130 525 C 165 535, 155 570, 120 580 C 145 605, 120 635, 90 640 L90 820 Z"
        fill="#0a0805"
        opacity="0.9"
      />
    </svg>
  );
}

export default function Hero() {
  return (
    <section className="relative min-h-[820px] pt-12 mt-16 w-full overflow-hidden border-x border-b border-white/10 bg-[#0a0e1a]">
      <NightSkyIllustration />

      {/* subtle top-to-bottom scrim for text legibility */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-black/30" />

      <div className="relative z-10 mx-auto flex max-w-7xl flex-col justify-end px-6 pb-12 pt-[100px] md:px-10 md:pt-[100px]">
        {/* eyebrow */}
        <div className="mb-6 inline-flex w-fit items-center gap-2 rounded-full border border-[#FF5A1F]/40 bg-[#FF5A1F]/10 px-4 py-1.5">
          <span className="text-xs font-medium uppercase tracking-wider text-[#FF9A5C]">
            #1 DNA of the inner genius
          </span>
        </div>

        <h1 className="max-w-3xl text-4xl font-semibold leading-[1.1] tracking-tight text-white md:text-6xl">
          The diagnosis that reveals your natural talent, your hidden{" "}
          <span className="text-[#FF7A33]">Potential</span> and the path
          where you can truly shine.
        </h1>

        <p className="mt-2 max-w-2xl text-lg leading-relaxed text-white/60">
          Teilenteens is the first diagnostic study that uncovers your
          natural power and shows you how to apply it in real life. 70% of
          people don't know what to study or where to go. What if your
          greatest talent remains hidden because no one ever taught you how
          to find it?
        </p>

        <div className="mt-9 flex  items-center justify-start gap-4 sm:flex-row">
                 
                 <a
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
                 Try Diagnosis
               </a>
       
                 
                  <a href="#"
                   className="inline-flex items-center gap-2 rounded-lg border border-white/15 bg-white/5 px-7 py-3.5 text-[15px] font-medium text-white/80 backdrop-blur-sm transition-colors duration-200 hover:border-white/25 hover:text-white"
                 >
                   <PlayCircle className="h-4 w-4" />
                   See how it works
                 </a>
               </div>
      </div>
    </section>
  );
}