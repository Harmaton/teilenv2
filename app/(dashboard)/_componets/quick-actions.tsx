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
      className="group relative flex flex-col gap-4 rounded-lg border border-black/[0.08] bg-white p-5 transition-colors duration-300 hover:border-black/[0.16] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black/20"
    >
      <span
        aria-hidden
        className="flex h-9 w-9 items-center justify-center rounded-md bg-black/[0.04] transition-colors duration-300 group-hover:bg-black/[0.08]"
      >
        <Icon
          strokeWidth={1.5}
          className="h-4 w-4 text-black/45 transition-colors duration-300 group-hover:text-black/80"
        />
      </span>

      <span className="text-[13px] font-medium leading-snug text-black/65 transition-colors duration-300 group-hover:text-black">
        {label}
      </span>

      <span
        aria-hidden
        className="absolute inset-x-5 bottom-0 h-px origin-left scale-x-0 bg-black/70 transition-transform duration-300 ease-out group-hover:scale-x-100"
      />
    </Link>
  );
}