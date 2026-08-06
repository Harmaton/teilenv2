"use client"

import { useRouter, usePathname } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import {
  LayoutDashboard,
  Users,
  FileText,
  FolderKanban,
  GraduationCap,
  Trophy,
  LogOut,
  FilePieChart,
} from "lucide-react"
import { User } from "@supabase/supabase-js"
import Link from "next/link"
import { cn } from "@/lib/utils"
import Image from 'next/image'

type NavItem = {
  label: string
  href: string
  icon: React.ElementType
}

type NavGroup = {
  label: string
  items: NavItem[]
}

const NAV: NavGroup[] = [
  {
    label: "Main",
    items: [
      { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    ],
  },
  {
    label: "Manage",
    items: [
      { label: "Team",      href: "/team",      icon: Users         },
      { label: "Editorial", href: "/editorial", icon: FileText      },
      { label: "Projects",  href: "/projects",  icon: FolderKanban  },
    ],
  },
  {
    label: "Programmes & Learning",
    items: [
      { label: "Cohorts & Programmes", href: "/programmes", icon: GraduationCap },
      { label: "Hackathons",           href: "/hackathons", icon: Trophy        }
    ],
  },
  {
    label: "Business Intelligence",
    items: [
      { label: "Business Intelligence Tickets", href: "/contact-support", icon: FilePieChart },
    ],
  },
   {
    label: "K AI",
    items: [
      { label: "Knowledgebase Management", href: "/knowledgebase", icon: FilePieChart },
    ],
  },
]


type AppSidebarProps = {
  user: User
}


export function AppSidebar({ user }: AppSidebarProps) {
  const router   = useRouter()
  const pathname = usePathname()
  const supabase = createClient()

  const email    = user.email ?? "admin"
  const initials = email.slice(0, 2).toUpperCase()

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push("/")
  }

  return (
    <Sidebar className="border-r border-black/10 bg-white">

      {/* ── Header ─────────────────────────────────────────── */}
      <SidebarHeader className="border-b border-black/10 px-4 py-4">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-sm bg-black">
           <Image
              src='/logo.png'
              alt='Logo'
              width={120}
              height={40}
              priority
              quality={100}
              style={{ objectFit: 'contain' }}
            />
          </div>
          <div className="flex flex-col gap-0.5">
            <span className="text-[13px] font-semibold tracking-tight text-black">
              Admin-CMS
            </span>
            <span className="w-fit border border-black px-1.5 py-px text-[9px] font-bold uppercase tracking-widest text-black">
              Management
            </span>
          </div>
        </div>
      </SidebarHeader>

      {/* ── Nav ────────────────────────────────────────────── */}
      <SidebarContent className="px-2 py-3">
        {NAV.map((group) => (
          <SidebarGroup key={group.label} className="mb-4">
            <SidebarGroupLabel className="mb-1 px-2 text-[10px] font-semibold uppercase tracking-widest text-black/40">
              {group.label}
            </SidebarGroupLabel>
            <SidebarMenu>
              {group.items.map(({ label, href, icon: Icon }) => {
                const isActive = pathname === href || pathname.startsWith(href + "/")
                return (
                  <SidebarMenuItem key={href}>
                    <SidebarMenuButton >
                      <Link
                        href={href}
                        className={cn(
                          "flex items-center gap-2.5 rounded-sm px-2 py-2 text-[13px] transition-colors",
                          isActive
                            ? "bg-black text-white"
                            : "text-black/60 hover:bg-black/5 hover:text-black"
                        )}
                      >
                        <Icon className="h-4 w-4 shrink-0" />
                        <span>{label}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )
              })}
            </SidebarMenu>
          </SidebarGroup>
        ))}
      </SidebarContent>

      {/* ── Footer ─────────────────────────────────────────── */}
      <SidebarFooter className="border-t border-black/10 p-3">
        {/* User card */}
        <div className="mb-1 flex items-center gap-2.5 rounded-sm bg-black/5 px-3 py-2">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-black text-[11px] font-semibold text-white">
            {initials}
          </div>
          <div className="flex min-w-0 flex-col">
            <span className="truncate text-[12px] font-medium text-black">{email}</span>
            <span className="text-[11px] text-black/40">Super Admin</span>
          </div>
        </div>

        {/* Sign out */}
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              onClick={handleLogout}
              className="flex w-full items-center gap-2.5 rounded-sm px-2 py-2 text-[13px] text-black/50 transition-colors hover:bg-black/5 hover:text-black"
            >
              <LogOut className="h-4 w-4" />
              <span>Sign out</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>

    </Sidebar>
  )
}