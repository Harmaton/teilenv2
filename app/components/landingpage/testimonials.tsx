"use client";

// Requires: npm install gsap

import React, { useEffect, useRef } from "react";
import gsap from "gsap";

const ORANGE = "#FF5A1F";
const INK = "#1c1c22";

const testimonials = [
  // {
  //   name: "Micaela",
  //   age: "17 años",
  //   text: "Por primera vez sentí que alguien me explicó cómo soy, sin juzgarme.",
  //   image: "https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?auto=format&fit=crop&w=150&q=80",
  // },
  {
    name: "Sofía",
    age: "20 años",
    text: "Teilen me dio la valentía de dejar una carrera que no era para mí; ahora estudio lo que amo y cada día es un descubrimiento",
    image:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=150&q=80",
  },
  {
    name: "Javier",
    age: "20 años",
    text: "Sabía que quería emprender, pero no dónde. Teilen fue la brújula que me mostró mi área de genialidad y me dio la confianza para lanzarme",
    image:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80",
  },
  {
    name: "Andrea",
    age: "28 años",
    text: "Estaba completamente perdida, sin saber qué hacer con mi vida. Teilen me reveló quién soy realmente y me dio el propósito que tanto buscaba",
    image:
      "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=150&q=80",
  },
  {
    name: "Miguel",
    age: "25 años",
    text: "Creía que mi carrera era una sola ruta, pero Teilen me ayudó a reorientar mi perfil y hoy soy mucho más valorado y feliz en mi trabajo",
    image:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80",
  },
  {
    name: "Valeria",
    age: "15 años",
    text: "Antes estaba estresada por la universidad, pero con Teilen entendí mis fortalezas y ahora sé exactamente qué estudiar. ¡Es un alivio enorme!",
    image:
      "https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?auto=format&fit=crop&w=150&q=80",
  },
] as const;

// duplicate the set so the loop reads seamlessly
const LOOP = [...testimonials, ...testimonials, ...testimonials];

const CARD_WIDTH = 340; // px, must match the card's fixed width below
const GAP = 24; // px, must match gap-6 (24px)
const STEP = CARD_WIDTH + GAP;

export default function TestimonialsMarquee() {
  const trackRef = useRef<HTMLDivElement | null>(null);
  const viewportRef = useRef<HTMLDivElement | null>(null);
  const cardRefs = useRef<Array<HTMLDivElement | null>>([]);
  const xRef = useRef(0);
  const pausedRef = useRef(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const track = trackRef.current;
    const viewport = viewportRef.current;
    if (!track || !viewport) return;

    // start roughly at the beginning of the middle copy, so we can drift
    // both "backwards" (via modulo wrap) without visible seams
    const singleSetWidth = testimonials.length * STEP;
    xRef.current = -singleSetWidth;
    gsap.set(track, { x: xRef.current });

    const SPEED = 100; // px per second — slow, readable pace

    const ticker = (time: number, deltaMs: number) => {
      if (!pausedRef.current) {
        xRef.current -= (SPEED * deltaMs) / 1000;

        // wrap seamlessly once we've drifted a full set-width
        if (xRef.current <= -singleSetWidth * 2) {
          xRef.current += singleSetWidth;
        }
        gsap.set(track, { x: xRef.current });
      }

      // compute each card's distance from viewport center → scale/blur/opacity
      const viewportRect = viewport.getBoundingClientRect();
      const centerX = viewportRect.left + viewportRect.width / 2;

      cardRefs.current.forEach((card) => {
        if (!card) return;
        const rect = card.getBoundingClientRect();
        const cardCenter = rect.left + rect.width / 2;
        const dist = Math.abs(cardCenter - centerX);
        const norm = Math.min(dist / (STEP * 1.4), 1); // 0 at center, 1 far away

        const scale = gsap.utils.interpolate(1.08, 0.86, norm);
        // const blur = gsap.utils.interpolate(0, 16, norm);
        const opacity = gsap.utils.interpolate(1, 0.4, norm);

        gsap.set(card, {
          scale,
          filter: `blur(${blur}px)`,
          opacity,
        });
      });
    };

    gsap.ticker.add(ticker);
    return () => gsap.ticker.remove(ticker);
  }, []);

  return (
    <section className="relative w-full overflow-hidden border-x border-b border-black/5 px-6 py-20 md:px-10 md:py-28">
      {/* soft rose-white background matching the reference */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(circle at 10% 10%, #fdf2f5 0%, #ffffff 40%), radial-gradient(circle at 90% 90%, #fbeaf0 0%, transparent 55%)",
        }}
      />

      <div className="relative z-10 mx-auto max-w-2xl text-center">
        <h2
          className="text-3xl font-semibold leading-[1.15] tracking-tight md:text-5xl"
          style={{ color: INK }}
        >
          Let's break{" "}
          <span style={{ color: ORANGE }}>negative statistics</span>
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-sm text-black/50 md:text-base">
          Schools, universities, entrepreneurs, and many other individuals
          have received their genius diagnosis. Choose a life with meaning.
        </p>
      </div>

      {/* marquee viewport */}
      <div
        ref={viewportRef}
        className="relative z-10 mt-14 overflow-hidden md:mt-20"
        onMouseEnter={() => (pausedRef.current = true)}
        onMouseLeave={() => (pausedRef.current = false)}
        style={{
          maskImage:
            "linear-gradient(to right, transparent 0%, black 12%, black 88%, transparent 100%)",
          WebkitMaskImage:
            "linear-gradient(to right, transparent 0%, black 12%, black 88%, transparent 100%)",
        }}
      >
        <div ref={trackRef} className="flex gap-6 py-6" style={{ willChange: "transform" }}>
          {LOOP.map((t, i) => (
            <div
              key={i}
              ref={(el) => (cardRefs.current[i] = el)}
              className="flex shrink-0 flex-col gap-4 rounded-2xl border border-black/5 bg-white p-6 shadow-[0_10px_30px_-14px_rgba(0,0,0,0.2)]"
              style={{ width: CARD_WIDTH, willChange: "transform, filter, opacity" }}
            >
              <div className="flex items-center gap-3">
                <img
                  src={t.image}
                  alt={t.name}
                  className="h-11 w-11 shrink-0 rounded-full object-cover"
                />
                <div>
                  <p className="text-[15px] font-semibold" style={{ color: INK }}>
                    {t.name}
                  </p>
                  <p className="text-xs text-black/40">{t.age}</p>
                </div>
              </div>

              <p className="text-sm italic leading-relaxed text-black/60">
                "{t.text}"
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}