"use client";

// Requires: npm install gsap

import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const ORANGE = "#FF5A1F";
const ORANGE_SOFT = "#FF8A4C";
const ORANGE_PALE = "#FFD8C2";
const TINT = "#FFF3EC";
const INK = "#241a14";

const KICKER = "¿CÓMO SABES A DÓNDE PERTENECES?";

const STOPS = [
  { number: "01", label: "Desorientación", quote: "No sé qué estudiar, me gustan muchas cosas." },
  { number: "02", label: "Frustración", quote: "Tengo miedo de cometer un error y perder años." },
  { number: "03", label: "Baja autoestima", quote: "¿Y si no tengo ningún talento especial?" },
  { number: "04", label: "La realidad", quote: "Teilen Teens existe para prevenir que eso te suceda a ti." },
] as const;

/* ---------------------------------- Illustrations ---------------------------------- */
/* Each illustration exposes className hooks on the parts GSAP will animate on scroll. */

function CrossroadsIllustration() {
  return (
    <svg viewBox="0 0 600 600" className="h-full w-full" fill="none">
      <circle cx="300" cy="300" r="280" fill={TINT} />
      <path
        className="ill-path"
        d="M120 470 C 170 400, 150 330, 220 290 C 290 250, 260 190, 330 150"
        stroke={ORANGE_PALE}
        strokeWidth="5"
        strokeDasharray="2 16"
        strokeLinecap="round"
      />
      <line x1="330" y1="170" x2="330" y2="480" stroke={INK} strokeWidth="9" strokeLinecap="round" />
      <g className="ill-board-1" style={{ transformOrigin: "330px 220px" }}>
        <rect x="330" y="198" width="150" height="44" rx="7" fill={ORANGE} />
        <path d="M480 198 L505 220 L480 242 Z" fill={ORANGE} />
      </g>
      <g className="ill-board-2" style={{ transformOrigin: "326px 274px" }}>
        <rect x="176" y="252" width="150" height="44" rx="7" fill={ORANGE_SOFT} />
        <path d="M176 252 L151 274 L176 296 Z" fill={ORANGE_SOFT} />
      </g>
      <g className="ill-board-3" style={{ transformOrigin: "330px 326px" }}>
        <rect x="330" y="306" width="126" height="40" rx="7" fill={ORANGE_PALE} />
        <path d="M456 306 L478 326 L456 346 Z" fill={ORANGE_PALE} />
      </g>
      <ellipse cx="330" cy="486" rx="38" ry="10" fill={INK} opacity="0.12" />
    </svg>
  );
}

function FractureIllustration() {
  const ticks = Array.from({ length: 12 }).map((_, i) => {
    const a = (i / 12) * Math.PI * 2;
    return {
      x1: 300 + Math.cos(a) * 152,
      y1: 300 + Math.sin(a) * 152,
      x2: 300 + Math.cos(a) * 172,
      y2: 300 + Math.sin(a) * 172,
    };
  });
  return (
    <svg viewBox="0 0 600 600" className="h-full w-full" fill="none">
      <circle cx="300" cy="300" r="280" fill={TINT} />
      <circle cx="300" cy="300" r="162" stroke={ORANGE} strokeWidth="7" />
      {ticks.map((t, i) => (
        <line key={i} x1={t.x1} y1={t.y1} x2={t.x2} y2={t.y2} stroke={ORANGE_SOFT} strokeWidth="4" strokeLinecap="round" />
      ))}
      <path
        className="ill-crack"
        d="M300 148 L270 232 L312 262 L256 344 L300 384 L246 458"
        stroke={INK}
        strokeWidth="7"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
        pathLength={1}
      />
      <g className="ill-sparks" stroke={ORANGE} strokeWidth="5" strokeLinecap="round">
        <path d="M472 190 L504 168" />
        <path d="M486 224 L520 218" />
        <path d="M464 256 L496 264" />
      </g>
    </svg>
  );
}

function FadeIllustration() {
  return (
    <svg viewBox="0 0 600 600" className="h-full w-full" fill="none">
      <circle cx="300" cy="300" r="280" fill={TINT} />
      <circle cx="300" cy="196" r="58" fill={ORANGE} />
      <path
        className="ill-figure"
        d="M182 460 C182 356 236 316 300 316 C364 316 418 356 418 460"
        fill={ORANGE_SOFT}
        style={{ transformOrigin: "300px 460px" }}
      />
      <path d="M182 460 C182 356 236 316 300 316 C364 316 418 356 418 460" fill="url(#fadeGradient)" />
      <defs>
        <linearGradient id="fadeGradient" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={TINT} stopOpacity="0" />
          <stop offset="100%" stopColor={TINT} stopOpacity="0.95" />
        </linearGradient>
      </defs>
      <g className="ill-question" style={{ transformOrigin: "474px 363px" }} stroke={INK} strokeWidth="6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M474 330 L474 396" />
        <path d="M474 396 L452 374" />
        <path d="M474 396 L496 374" />
      </g>
    </svg>
  );
}

function CompassIllustration() {
  const rays = Array.from({ length: 16 }).map((_, i) => {
    const a = (i / 16) * Math.PI * 2;
    return {
      x1: 300 + Math.cos(a) * 196,
      y1: 300 + Math.sin(a) * 196,
      x2: 300 + Math.cos(a) * 218,
      y2: 300 + Math.sin(a) * 218,
    };
  });
  return (
    <svg viewBox="0 0 600 600" className="h-full w-full" fill="none">
      <circle cx="300" cy="300" r="280" fill={TINT} />
      <g className="ill-rays" style={{ transformOrigin: "300px 300px" }}>
        {rays.map((r, i) => (
          <line key={i} x1={r.x1} y1={r.y1} x2={r.x2} y2={r.y2} stroke={ORANGE_SOFT} strokeWidth="3" strokeLinecap="round" opacity="0.55" />
        ))}
      </g>
      <circle cx="300" cy="300" r="172" stroke={ORANGE} strokeWidth="7" />
      <g className="ill-needle" style={{ transformOrigin: "300px 300px" }}>
        <path d="M300 300 L338 202 L300 224 L262 202 Z" fill={ORANGE} />
        <path d="M300 300 L282 378 L300 358 L318 378 Z" fill={ORANGE_PALE} />
      </g>
      <circle cx="300" cy="300" r="8" fill={INK} />
    </svg>
  );
}

const ILLUSTRATIONS = [CrossroadsIllustration, FractureIllustration, FadeIllustration, CompassIllustration];

/* ------------------------------------ Component ------------------------------------ */

export default function ScrollStory() {
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const headerColRef = useRef<HTMLDivElement | null>(null);
  const stopsColRef = useRef<HTMLDivElement | null>(null);
  const stopRefs = useRef<Array<HTMLDivElement | null>>([]);
  const railProgressRef = useRef<HTMLDivElement | null>(null);
  const [active, setActive] = useState(0);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const ctx = gsap.context(() => {
      const stops = stopRefs.current.filter(Boolean) as HTMLDivElement[];
      const mm = gsap.matchMedia();

      mm.add("(min-width: 768px)", () => {
        // pin the left header column
        const pinTrigger = ScrollTrigger.create({
          trigger: wrapperRef.current,
          start: "top top",
          end: () => `+=${(wrapperRef.current?.offsetHeight ?? 0) - window.innerHeight}`,
          pin: headerColRef.current,
          pinSpacing: false,
          anticipatePin: 1,
        });

        return () => pinTrigger.kill();
      });

      // overall rail progress line, tracks scroll through the whole stops column
      if (railProgressRef.current && stopsColRef.current) {
        gsap.set(railProgressRef.current, { height: "0%" });
        const railTrigger = ScrollTrigger.create({
          trigger: stopsColRef.current,
          start: "top center",
          end: "bottom center",
          scrub: 0.6,
          onUpdate: (self) => {
            gsap.set(railProgressRef.current, { height: `${self.progress * 100}%` });
          },
        });
        return () => railTrigger.kill();
      }
    }, wrapperRef);

    // per-stop active state + illustration scrub animations
    const ctx2 = gsap.context(() => {
      const stops = stopRefs.current.filter(Boolean) as HTMLDivElement[];

      gsap.set(stops, { autoAlpha: 0.35, y: 16 });
      gsap.set(stops[0], { autoAlpha: 1, y: 0 });

      stops.forEach((el, i) => {
        ScrollTrigger.create({
          trigger: el,
          start: "top center",
          end: "bottom center",
          onEnter: () => activate(i),
          onEnterBack: () => activate(i),
        });

        buildIllustrationTimeline(el, i);
      });

      function activate(i: number) {
        setActive(i);
        stops.forEach((s, j) => {
          gsap.to(s, {
            autoAlpha: j === i ? 1 : 0.35,
            y: j === i ? 0 : 16,
            duration: 0.45,
            ease: "power2.out",
            overwrite: true,
          });
        });
      }

      function buildIllustrationTimeline(container: HTMLDivElement, index: number) {
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: container,
            start: "top 80%",
            end: "top 20%",
            scrub: 0.8,
          },
        });

        if (index === 0) {
          const b1 = container.querySelector(".ill-board-1");
          const b2 = container.querySelector(".ill-board-2");
          const b3 = container.querySelector(".ill-board-3");
          const path = container.querySelector(".ill-path") as SVGPathElement | null;
          gsap.set([b1, b2, b3], { rotation: 0 });
          if (path) gsap.set(path, { strokeDasharray: 900, strokeDashoffset: 900 });
          tl.to(b1, { rotation: -10, duration: 1 }, 0)
            .to(b2, { rotation: 8, duration: 1 }, 0)
            .to(b3, { rotation: -6, duration: 1 }, 0)
            .to(path, { strokeDashoffset: 0, duration: 1, ease: "none" }, 0);
        }

        if (index === 1) {
          const crack = container.querySelector(".ill-crack") as SVGPathElement | null;
          const sparks = container.querySelectorAll(".ill-sparks path");
          if (crack) gsap.set(crack, { strokeDasharray: 1, strokeDashoffset: 1 });
          gsap.set(sparks, { scale: 0, transformOrigin: "center" });
          tl.to(crack, { strokeDashoffset: 0, duration: 1, ease: "none" }, 0)
            .to(sparks, { scale: 1, duration: 0.5, stagger: 0.15, ease: "back.out(3)" }, 0.5);
        }

        if (index === 2) {
          const figure = container.querySelector(".ill-figure");
          const q = container.querySelector(".ill-question");
          gsap.set(figure, { scaleY: 1, opacity: 1 });
          gsap.set(q, { opacity: 0, y: -12 });
          tl.to(figure, { scaleY: 0.85, opacity: 0.5, duration: 1, ease: "none" }, 0)
            .to(q, { opacity: 1, y: 0, duration: 0.6 }, 0.3);
        }

        if (index === 3) {
          const needle = container.querySelector(".ill-needle");
          const rays = container.querySelector(".ill-rays");
          gsap.set(needle, { rotation: -35 });
          gsap.set(rays, { rotation: 0 });
          tl.to(needle, { rotation: 0, duration: 1, ease: "none" }, 0)
            .to(rays, { rotation: 25, duration: 1, ease: "none" }, 0);
        }
      }
    }, wrapperRef);

    return () => {
      ctx.revert();
      ctx2.revert();
    };
  }, []);

  return (
    <section className="relative w-full border-x border-b border-black/5 bg-white">
      <div ref={wrapperRef} className="relative flex flex-col md:flex-row">
        {/* pinned left header */}
        <div
          ref={headerColRef}
          className="relative z-10 flex h-auto w-full shrink-0 flex-col justify-center gap-8 bg-white px-6 py-12 md:h-screen md:w-2/5 md:px-12"
        >
          <div>
            <span className="text-xs font-semibold uppercase tracking-[0.2em]" style={{ color: ORANGE }}>
            Una pregunta que vale la pena hacer
            </span>
            <h2 className="mt-4 text-3xl font-semibold leading-[1.08] md:text-5xl" style={{ color: INK }}>
              {KICKER}
            </h2>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-medium text-black/40">
              {STOPS[active].number} / {STOPS.length.toString().padStart(2, "0")}
            </span>
            <div className="flex gap-1.5">
              {STOPS.map((s, i) => (
                <span
                  key={s.number}
                  className="h-1.5 w-6 rounded-full transition-colors duration-300"
                  style={{ backgroundColor: i === active ? ORANGE : "rgba(0,0,0,0.1)" }}
                />
              ))}
            </div>
          </div>
        </div>

        {/* scrolling stops */}
        <div ref={stopsColRef} className="relative flex w-full md:w-3/5">
          {/* progress rail */}
          <div className="relative hidden w-10 shrink-0 md:block">
            <div
              className="absolute left-1/2 top-2 bottom-2 w-[2px] -translate-x-1/2"
              style={{
                backgroundImage: `linear-gradient(${ORANGE_PALE} 60%, transparent 0%)`,
                backgroundSize: "2px 10px",
                backgroundRepeat: "repeat-y",
              }}
            />
            <div
              ref={railProgressRef}
              className="absolute left-1/2 top-2 w-[2px] -translate-x-1/2"
              style={{ backgroundColor: ORANGE }}
            >
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
            {STOPS.map((s, i) => (
              <span
                key={s.number}
                className="absolute left-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 bg-white transition-colors duration-300"
                style={{
                  top: `${(i / (STOPS.length - 1)) * 100}%`,
                  borderColor: i <= active ? ORANGE : ORANGE_PALE,
                }}
              />
            ))}
          </div>

          {/* cards */}
          <div className="flex flex-1 flex-col gap-5 px-6 py-8 md:gap-6 md:px-8 md:py-10">
            {STOPS.map((stop, i) => {
              const Illustration = ILLUSTRATIONS[i];
              const isLast = i === STOPS.length - 1;

              return (
                <div
                  key={stop.number}
                  ref={(el) => { stopRefs.current[i] = el }}
                  className="rounded-2xl border border-dashed px-5 py-6 md:px-7 md:py-7"
                  style={{ borderColor: ORANGE_PALE }}
                >
                  <div className={isLast ? "flex flex-col items-start gap-4 sm:flex-row sm:items-center" : "flex flex-col gap-4"}>
                    <div className={isLast ? "w-24 shrink-0 sm:w-28" : "w-full max-w-[160px] self-center"}>
                      <Illustration />
                    </div>

                    <div className="flex-1">
                      <span className="text-xs font-semibold uppercase tracking-[0.2em]" style={{ color: ORANGE }}>
                        {stop.number} / 04
                      </span>

                      <h3
                        className={isLast ? "mt-2 text-xl font-semibold md:text-2xl" : "mt-2 text-2xl font-semibold md:text-3xl"}
                        style={{ color: INK }}
                      >
                        {stop.label}
                      </h3>

                      {!isLast ? (
                        <p className="mt-3 text-base text-black/50 md:text-lg">"{stop.quote}"</p>
                      ) : (
                        <p className="mt-2 text-sm text-black/55 md:text-base">
                          No te sientas atrapado en un camino que no te representa.{" "}
                          <span className="font-medium" style={{ color: ORANGE }}>
                            Teilen Teens existe para prevenir que eso te suceda a ti.
                          </span>
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}