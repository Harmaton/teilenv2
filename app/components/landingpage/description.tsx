"use client";

import React from "react";
import {
  Brain,
  Zap,
  Target,
  Heart,
  Compass,
  TrendingUp,
  Shield,
  CheckCircle2,
} from "lucide-react";

const ORANGE = "#FF5A1F";
const ORANGE_SOFT = "#FF7A33";
const MIDNIGHT = "#0a0e1a";

const ITEMS = [
  {
    icon: Brain,
    title: "Your personality type, skills, and strengths",
    snippet: "Profile: analytical-intuitive hybrid, high verbal reasoning...",
  },
  {
    icon: Zap,
    title: "Your type of natural genius, thinking style, and true passions",
    snippet: "Genius type: systems thinker — pattern recognition score 91%...",
  },
  {
    icon: Target,
    title: "Your hidden superpower and how to use it in real life",
    snippet: "Core strength: rapid synthesis under ambiguity...",
  },
  {
    icon: Heart,
    title: "What drains you and what energizes you, so you can turn challenges into strengths",
    snippet: "Energy drain: repetitive tasks, low autonomy...",
  },
  {
    icon: Compass,
    title: "How to learn, work, and make decisions based on your style",
    snippet: "Decision style: convergent, evidence-first...",
  },
  {
    icon: TrendingUp,
    title: "Your professional compass: ideal environments, areas of study, and potential ventures",
    snippet: "Recommended fields: applied research, product strategy...",
  },
  {
    icon: Shield,
    title: "Hidden risks that can sabotage your talent",
    snippet: "Risk flag: perfectionism under external pressure...",
  },
  {
    icon: CheckCircle2,
    title: "Personalized recommendations for growth",
    snippet: "Next steps: 3 targeted exercises, 1 mentor archetype...",
  },
] as const;

function ReportCard({
  icon: Icon,
  title,
  snippet,
}: {
  icon: React.ElementType;
  title: string;
  snippet: string;
}) {
  return (
    <div className="group relative">
      {/* second sheet peeking out bottom-right */}
      <div
        className="absolute inset-0 rounded-2xl bg-[#f3ece2] shadow-lg transition-transform duration-300 group-hover:translate-x-1 group-hover:translate-y-1"
        style={{ transform: "rotate(2.5deg) translate(6px, 8px)" }}
      >
        <p
          className="absolute bottom-3 right-4 max-w-[70%] truncate text-[11px] italic text-black/35"
          style={{ fontFamily: "Georgia, serif" }}
        >
          {snippet}
        </p>
      </div>

      {/* main card */}
      <div className="relative flex h-full flex-col gap-4 rounded-2xl bg-white p-5 shadow-[0_10px_30px_-12px_rgba(0,0,0,0.35)] transition-transform duration-300 group-hover:-translate-y-1 md:p-6">
        <div
          className="flex h-11 w-11 items-center justify-center rounded-xl"
          style={{ backgroundColor: "rgba(255,90,31,0.1)" }}
        >
          <Icon className="h-5 w-5" style={{ color: ORANGE }} strokeWidth={2} />
        </div>

        <p className="text-[15px] font-medium leading-snug text-[#1c1c22] md:text-base">
          {title}
        </p>

        {/* dog-ear fold */}
        <span
          className="pointer-events-none absolute bottom-0 right-0 h-9 w-9 rounded-br-2xl"
          style={{
            background:
              "linear-gradient(135deg, transparent 50%, #efe7da 50%)",
            boxShadow: "-3px -3px 6px rgba(0,0,0,0.08)",
          }}
        />
      </div>
    </div>
  );
}

export default function WhatIsSection() {
  return (
    <section className="relative w-full overflow-hidden border-x border-b border-white/10 bg-[#0a0e1a] px-6 py-20 md:px-10 md:py-28">
      {/* ambient glow, echoes hero */}
      <div
        className="pointer-events-none absolute -top-40 left-1/2 h-[500px] w-[900px] -translate-x-1/2 rounded-full opacity-25 blur-[120px]"
        style={{ backgroundColor: ORANGE }}
      />
      <div
        className="pointer-events-none absolute bottom-0 right-0 h-[300px] w-[300px] rounded-full opacity-10 blur-[100px]"
        style={{ backgroundColor: "#6C5CE7" }}
      />

      <div className="relative z-10 mx-auto max-w-6xl">
        {/* heading */}
        <div className="mx-auto max-w-3xl text-center">
          <span className="text-xs font-medium uppercase tracking-[0.2em] text-[#FF9A5C]">
            The method
          </span>

          <h2 className="mt-4 text-3xl font-semibold leading-[1.15] tracking-tight text-white md:text-5xl">
            What is{" "}
            <span style={{ color: ORANGE_SOFT }}>Teilen Teens</span>?
          </h2>

          <p className="mt-4 text-base text-white/50 md:text-lg">
            It's not just another vocational test.
          </p>

          <p className="mt-3 text-lg font-medium leading-snug text-transparent bg-clip-text bg-gradient-to-r from-[#8B7CF6] to-[#FF7A33] md:text-xl">
            An in-depth diagnosis of human talent, built on neuroscience and
            six validated psychological models.
          </p>

          <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-white/45 md:text-base">
            In just 10 minutes, we detect how your mind works, what your
            natural power is, what blocks you, and what to do about it.
          </p>
        </div>

        {/* cards */}
        <div className="mt-14 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {ITEMS.map((item, i) => (
            <ReportCard key={i} {...item} />
          ))}
        </div>
      </div>
    </section>
  );
}