"use client";

// Requires: npm install gsap

import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { X, Check } from "lucide-react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const ORANGE = "#FF5A1F";
const ORANGE_PALE = "#FFD8C2";
const INK = "#1c1c22";
const PURPLE = "#7C5CFF";

const ROWS = [
  {
    aspect: "Depth",
    free: "They offer generic results",
    teilen: "A personalized, functional and complete diagnosis",
  },
  {
    aspect: "Career guidance",
    free: "Usually games or magazine quizzes",
    teilen: "Real, creative career paths mapped to you",
  },
  {
    aspect: "Emotional connection",
    free: "Cold and lacking narrative impact",
    teilen: "Personalized storytelling that resonates",
  },
  {
    aspect: "Emotional integration",
    free: "They focus on traits alone",
    teilen: "Integrates values, strengths, and emotions",
  },
  {
    aspect: "Plan of action",
    free: "You don't know what to do with the result",
    teilen: "Tells you exactly how to apply your talent today",
  },
] as const;

export default function InnerMirrorSection() {
  const sectionRef = useRef<HTMLDivElement | null>(null);
  const rowRefs = useRef<Array<HTMLDivElement | null>>([]);
  const railRef = useRef<HTMLDivElement | null>(null);
  const railProgressRef = useRef<HTMLDivElement | null>(null);
  const ctaRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const ctx = gsap.context(() => {
      const rows = rowRefs.current.filter(Boolean) as HTMLDivElement[];

      rows.forEach((row) => {
        const badge = row.querySelector(".row-badge");
        const freeCol = row.querySelector(".row-free");
        const teilenCol = row.querySelector(".row-teilen");
        const dot = row.querySelector(".row-dot");

        gsap.set(row, { autoAlpha: 0 });
        gsap.set(badge, { autoAlpha: 0, scale: 0.6 });
        gsap.set(freeCol, { autoAlpha: 0, x: -24 });
        gsap.set(teilenCol, { autoAlpha: 0, x: 24 });
        gsap.set(dot, { scale: 0 });

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: row,
            start: "top 82%",
            toggleActions: "play none none reverse",
          },
        });

        tl.to(row, { autoAlpha: 1, duration: 0.3 })
          .to(badge, { autoAlpha: 1, scale: 1, duration: 0.4, ease: "back.out(2)" }, 0.05)
          .to(dot, { scale: 1, duration: 0.3, ease: "back.out(3)" }, 0.15)
          .to(freeCol, { autoAlpha: 1, x: 0, duration: 0.5, ease: "power2.out" }, 0.2)
          .to(teilenCol, { autoAlpha: 1, x: 0, duration: 0.5, ease: "power2.out" }, 0.3);
      });

      // rail progress line tracking scroll through the rows block
      if (railRef.current && railProgressRef.current) {
        gsap.set(railProgressRef.current, { height: "0%" });
        ScrollTrigger.create({
          trigger: railRef.current,
          start: "top center",
          end: "bottom center",
          scrub: 0.6,
          onUpdate: (self) => {
            gsap.set(railProgressRef.current, { height: `${self.progress * 100}%` });
          },
        });
      }

      // CTA reveal
      if (ctaRef.current) {
        gsap.set(ctaRef.current, { autoAlpha: 0, y: 20 });
        gsap.to(ctaRef.current, {
          autoAlpha: 1,
          y: 0,
          duration: 0.6,
          ease: "power2.out",
          scrollTrigger: {
            trigger: ctaRef.current,
            start: "top 90%",
            toggleActions: "play none none reverse",
          },
        });
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative w-full overflow-hidden border-x border-b border-black/5 px-6 py-20 md:px-10 md:py-28"
      style={{
        background:
          "radial-gradient(circle at 20% 0%, #fff8f2 0%, #ffffff 45%), radial-gradient(circle at 90% 100%, #f3efff 0%, transparent 50%)",
      }}
    >
      {/* heading */}
      <div className="mx-auto max-w-2xl text-center">
        <span className="text-xs font-medium uppercase tracking-[0.2em]" style={{ color: ORANGE }}>
          The comparison
        </span>
        <h2
          className="mt-4 text-3xl font-semibold leading-[1.15] tracking-tight md:text-5xl"
          style={{ color: INK }}
        >
          We are your{" "}
          <span style={{ color: ORANGE }}>inner mirror</span>
        </h2>
        <p className="mx-auto mt-4 max-w-md text-sm text-black/45 md:text-base">
          Not another quiz. See what actually changes when the diagnosis goes
          deeper.
        </p>
      </div>

      {/* rows */}
      <div ref={railRef} className="relative mx-auto mt-16 max-w-4xl md:mt-20">
        {/* dashed rail with solid progress + arrow, desktop only */}
        <div className="absolute left-6 top-2 bottom-2 hidden w-[2px] md:block">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `linear-gradient(${ORANGE_PALE} 60%, transparent 0%)`,
              backgroundSize: "2px 10px",
              backgroundRepeat: "repeat-y",
            }}
          />
          <div ref={railProgressRef} className="absolute left-0 top-0 w-[2px]" style={{ backgroundColor: ORANGE }}>
            <span
              className="absolute -bottom-[7px] left-1/2 -translate-x-1/2"
              style={{
                width: 0,
                height: 0,
                borderLeft: "5px solid transparent",
                borderRight: "5px solid transparent",
                borderTop: `7px solid ${ORANGE}`,
              }}
            />
          </div>
        </div>

        <div className="flex flex-col gap-8 md:gap-10">
          {ROWS.map((row, i) => (
            <div
              key={row.aspect}
              ref={(el) => { rowRefs.current[i] = el }}
              className="relative md:pl-20"
            >
              {/* rail dot marker */}
              <span
                className="row-dot absolute left-[19px] top-2 hidden h-3.5 w-3.5 rounded-full border-2 bg-white md:block"
                style={{ borderColor: ORANGE }}
              />

              {/* card */}
              <div
                className="relative rounded-2xl border border-black/5 p-6 shadow-[0_8px_30px_-14px_rgba(0,0,0,0.25)] backdrop-blur-xl md:p-8"
                style={{ background: "rgba(255,255,255,0.6)" }}
              >
                {/* Japanese-editorial numeral */}
                <div className="row-badge absolute -top-5 -left-2 flex items-baseline gap-1 md:-top-6 md:-left-3">
                  <span
                    className="text-4xl font-light leading-none md:text-6xl"
                    style={{
                      color: "transparent",
                      WebkitTextStroke: `1.5px ${ORANGE}`,
                    }}
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                </div>

                <h3 className="mb-5 text-lg font-semibold md:text-xl" style={{ color: INK }}>
                  {row.aspect}
                </h3>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6">
                  <div className="row-free flex items-start gap-3 rounded-xl bg-black/[0.02] p-4">
                    <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-red-50">
                      <X className="h-3 w-3 text-red-500" strokeWidth={3} />
                    </div>
                    <div>
                      <span className="text-[11px] font-semibold uppercase tracking-wider text-black/35">
                        Free tests
                      </span>
                      <p className="mt-1 text-sm leading-snug text-black/55 md:text-[15px]">
                        {row.free}
                      </p>
                    </div>
                  </div>

                  <div
                    className="row-teilen flex items-start gap-3 rounded-xl p-4"
                    style={{ background: "rgba(255,90,31,0.05)" }}
                  >
                    <div
                      className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full"
                      style={{ backgroundColor: "rgba(124,92,255,0.12)" }}
                    >
                      <Check className="h-3 w-3" style={{ color: PURPLE }} strokeWidth={3} />
                    </div>
                    <div>
                      <span className="text-[11px] font-semibold uppercase tracking-wider" style={{ color: PURPLE }}>
                        Teilen Teens
                      </span>
                      <p className="mt-1 text-sm font-medium leading-snug md:text-[15px]" style={{ color: INK }}>
                        {row.teilen}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
     
    </section>
  );
}