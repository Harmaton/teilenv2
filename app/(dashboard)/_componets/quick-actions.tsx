// components/quick-action.tsx
import Link from "next/link";
import type { LucideIcon } from "lucide-react";

interface QuickActionProps {
  href: string;
  icon: LucideIcon;
  label: string;
}

export function QuickAction({ href, icon: Icon, label }: QuickActionProps) {
  return (
    <Link
      href={href}
      className="group relative flex flex-col gap-4 rounded-2xl border border-[#141b3c]/10 bg-white p-5 shadow-[0_12px_34px_-30px_rgba(20,27,60,.5)] transition-all duration-300 hover:-translate-y-0.5 hover:border-[#f27a1a]/35 hover:shadow-[0_18px_40px_-28px_rgba(20,27,60,.45)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f27a1a]/40"
    >
      <span
        aria-hidden
        className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#fff3cf] transition-colors duration-300 group-hover:bg-[#ffc94d]"
      >
        <Icon
          strokeWidth={1.5}
          className="h-4 w-4 text-[#e46a12] transition-colors duration-300 group-hover:text-[#141b3c]"
        />
      </span>

      <span className="text-sm font-semibold leading-snug text-[#141b3c] transition-colors duration-300">
        {label}
      </span>

      <span
        aria-hidden
        className="absolute inset-x-5 bottom-0 h-0.5 origin-left scale-x-0 bg-[#f27a1a] transition-transform duration-300 ease-out group-hover:scale-x-100"
      />
    </Link>
  );
}