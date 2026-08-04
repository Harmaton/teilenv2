"use client";

import React, { useEffect, useRef, useState } from "react";

const STOPS = [
  {
    number: "01",
    label: "Disorientation",
    quote: "I don't know what to study, I like many things.",
    icon: "compass",
  },
  {
    number: "02",
    label: "Frustration",
    quote: "I'm afraid of making a mistake and wasting years.",
    icon: "alert",
  },
  {
    number: "03",
    label: "Low self-esteem",
    quote: "What if I don't have any special talents?",
    icon: "fade",
  },
  {
    number: "04",
    label: "The reality",
    quote: "Teilen Teens exists to prevent that from happening to you.",
    icon: "spark",
  },
] as const;

type IconName = (typeof STOPS)[number]["icon"];

function Icon({ name }: { name: IconName }) {
  switch (name) {
    case "compass":
      return (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
          <circle cx="12" cy="12" r="9" />
          <path d="M15 9 L13 13 L9 15 L11 11 Z" fill="currentColor" stroke="none" />
        </svg>
      );
    case "alert":
      return (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
          <path d="M12 3 L21 19 H3 Z" strokeLinejoin="round" />
          <line x1="12" y1="9" x2="12" y2="13" />
          <circle cx="12" cy="16.2" r="0.6" fill="currentColor" stroke="none" />
        </svg>
      );
    case "fade":
      return (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
          <circle cx="12" cy="8" r="4" />
          <path d="M6 21 C6 16.5 8.7 14 12 14 C15.3 14 18 16.5 18 21" />
        </svg>
      );
    case "spark":
      return (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
          <path d="M12 3 L13.6 9.4 L20 11 L13.6 12.6 L12 19 L10.4 12.6 L4 11 L10.4 9.4 Z" strokeLinejoin="round" />
        </svg>
      );
    default:
      return null;
  }
}

export default function ScrollStory() {
  const [active, setActive] = useState(0);
  const refs = useRef<Array<HTMLDivElement | null>>([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const idx = Number(entry.target.getAttribute("data-index"));
            setActive(idx);
          }
        });
      },
      { rootMargin: "-40% 0px -40% 0px", threshold: 0 }
    );

    refs.current.forEach((el) => el && observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const current = STOPS[active];

  return (
    <section className="relative w-full border-x border-b border-white/10 bg-[#0a0e1a]">
      <div className="mx-auto max-w-7xl px-6 py-24 md:px-10">
        <h2 className="mb-16 text-center text-3xl font-semibold tracking-tight text-white md:text-5xl">
          How do you know where you belong?
        </h2>

        <div className="grid grid-cols-1 gap-12 md:grid-cols-[380px_1fr] md:gap-16">
          {/* sticky visual column */}
          <div className="hidden md:block">
            <div className="sticky top-28 flex flex-col gap-8">
              <span className="text-sm font-medium uppercase tracking-wider text-white/40">
                {current.number} / 04
              </span>

              <div className="flex h-20 w-20 items-center justify-center rounded-2xl border border-[#FF5A1F]/30 bg-[#FF5A1F]/10 text-[#FF9A5C]">
                <Icon name={current.icon} />
              </div>

              <div>
                <p className="text-2xl font-semibold text-white">{current.label}</p>
                <p className="mt-3 max-w-xs text-white/50">"{current.quote}"</p>
              </div>

              <div className="flex gap-2">
                {STOPS.map((s, i) => (
                  <span
                    key={s.number}
                    className={`h-1 w-8 rounded-full transition-colors ${
                      i === active ? "bg-[#FF5A1F]" : "bg-white/15"
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* scrolling content column */}
          <div className="flex flex-col gap-32 md:gap-56">
            {STOPS.slice(0, 3).map((stop, i) => (
              <div
                key={stop.number}
                ref={(el) => (refs.current[i] = el)}
                data-index={i}
                className="flex flex-col gap-5 md:min-h-[40vh] md:justify-center"
              >
                <div className="flex items-center gap-4 md:hidden">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-[#FF5A1F]/30 bg-[#FF5A1F]/10 text-[#FF9A5C]">
                    <Icon name={stop.icon} />
                  </div>
                  <span className="text-sm font-medium uppercase tracking-wider text-white/40">
                    {stop.number}
                  </span>
                </div>

                <h3 className="text-2xl font-semibold text-white md:text-3xl">
                  {stop.label}
                </h3>
                <p className="max-w-md text-lg text-white/60">"{stop.quote}"</p>
              </div>
            ))}

            {/* stop 04 — manifesto block */}
            <div
              ref={(el) => (refs.current[3] = el)}
              data-index={3}
              className="flex flex-col gap-6 rounded-2xl border border-white/10 bg-white/[0.03] p-8 md:min-h-[40vh] md:justify-center md:p-12"
            >
              <div className="flex items-center gap-4 md:hidden">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-[#FF5A1F]/30 bg-[#FF5A1F]/10 text-[#FF9A5C]">
                  <Icon name="spark" />
                </div>
                <span className="text-sm font-medium uppercase tracking-wider text-white/40">
                  04
                </span>
              </div>

              <h3 className="text-2xl font-semibold leading-snug text-white md:text-3xl">
                Thousands of young people make decisions due to pressure,
                fashion, or fear.
              </h3>

              <div className="flex flex-col gap-3 text-lg text-white/60">
                <p>Are you making the right decision?</p>
                <p>Do you really know your talents?</p>
                <p>Do you feel lost, overwhelmed by expectations?</p>
                <p className="font-medium text-[#FF7A33]">
                  Every day without clarity is another day of anxiety.
                </p>
                <p>Don't feel trapped on a path that doesn't represent you.</p>
                <p className="font-medium text-[#FF9A5C]">
                  Teilen Teens exists to prevent that from happening to you.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}