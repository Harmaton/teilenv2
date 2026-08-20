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
import { User } from "@supabase/supabase-js"
import Link from "next/link"
import { cn } from "@/lib/utils"
import Image from "next/image"

const ACCENT = "#FF5A1F"

type NavItem = {
  label: string
  href: string
  icon: React.ElementType
}

type NavGroup = {
  label: string
  items: NavItem[]
}

import {
  LayoutDashboard,
  UserCircle,
  FileBarChart2,
  ClipboardList,
  Settings,
  ChevronRight,
  LogOut,
  AdIcon,
} from "lucide-react"
import { useEffect, useState } from "react"

const NAV: NavGroup[] = [
  {
    label: "Main",
    items: [
      { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    ],
  },
  {
    label: "Assessments",
    items: [
      { label: "Tests", href: "/tests", icon: ClipboardList },
      { label: "Reports", href: "/reports", icon: FileBarChart2 },
    ],
  },
  {
    label: "Account",
    items: [
      // { label: "Profile", href: "/profile", icon: UserCircle },
      { label: "Settings", href: "/settings", icon: Settings },
    ],
  },
]

type AppSidebarProps = {
  user: User
}

export function AppSidebar({ user }: AppSidebarProps) {
  const router = useRouter()
  const pathname = usePathname()
  const supabase = createClient()

  const [isAdmin, setIsAdmin] = useState(false)

    useEffect(() => {
    async function checkAdmin() {
      const { data, error } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single()

      if (error) {
        console.error('Failed to fetch role:', error)
        return
      }

      setIsAdmin(data?.role === 'admin')
    }

    checkAdmin()
  }, [user.id, supabase])

  const email = user.email ?? "admin"
  const initials = email.slice(0, 2).toUpperCase()

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push("/")
  }

  return (
    <Sidebar className="border-r border-black/[0.06] bg-white">
      {/* ── Header ─────────────────────────────────────────── */}
      <SidebarHeader className="border-b border-black/[0.06] px-4 py-4">
        <div className="flex items-center gap-3">
          <Image
            src="/logo.png"
            alt="Logo"
            width={120}
            height={40}
            priority
            quality={100}
            style={{ objectFit: "contain" }}
          />
        </div>
      </SidebarHeader>

      {/* ── Nav ────────────────────────────────────────────── */}
      <SidebarContent className="px-2.5 py-4">
        {NAV.map((group) => (
          <SidebarGroup key={group.label} className="mb-5">
            <SidebarGroupLabel className="mb-1.5 px-3 text-[10px] font-semibold uppercase tracking-[0.08em] text-black/35">
              {group.label}
            </SidebarGroupLabel>
            <SidebarMenu className="gap-0.5">
              {group.items.map(({ label, href, icon: Icon }) => {
                const isActive = pathname === href || pathname.startsWith(href + "/")
                return (
                  <SidebarMenuItem key={href} className="px-1">
                    <SidebarMenuButton >
                      <Link
                        href={href}
                        className={cn(
                          "group relative flex items-center gap-2.5 rounded-full px-3 py-2 text-[13px] font-medium transition-all duration-150",
                          isActive
                            ? "text-white shadow-[0_2px_10px_-2px_rgba(255,90,31,0.55)]"
                            : "text-black/55 hover:bg-black/[0.04] hover:text-black"
                        )}
                        style={isActive ? { backgroundColor: ACCENT } : undefined}
                      >
                        <Icon
                          className={cn(
                            "h-[15px] w-[15px] shrink-0 transition-colors",
                            isActive ? "text-white" : "text-black/40 group-hover:text-black/70"
                          )}
                        />
                        <span className="truncate">{label}</span>
                        {isActive && (
                          <ChevronRight className="ml-auto h-3.5 w-3.5 shrink-0 text-white/70" />
                        )}
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
      <SidebarFooter className="border-t border-black/[0.06] p-3">
        {/* User card */}
        <div className="mb-1.5 flex items-center gap-2.5 rounded-2xl bg-black/[0.03] px-3 py-2.5">
          <div
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[11px] font-semibold text-white"
            style={{ backgroundColor: ACCENT }}
          >
            {initials}
          </div>
          <div className="flex min-w-0 flex-col">
            <span className="truncate text-[12px] font-medium text-black">{email}</span>

          </div>
        </div>

        {/* Sign out */}
        <SidebarMenu>
          {isAdmin ?   <SidebarMenuItem className="px-1">
            
            <SidebarMenuButton
              onClick={()=>router.push('/admin/dashboard')}
              className="flex w-full items-center gap-2.5 rounded-full px-3 py-2 text-[13px] font-medium text-black/45 transition-colors hover:bg-black/[0.04] hover:text-black"
            >
              <AdIcon className="h-[15px] w-[15px]" />
              <span>Admin Page</span>
            </SidebarMenuButton>
          </SidebarMenuItem> : <div>
            
            </div>}
         
          <SidebarMenuItem className="px-1">
            
            <SidebarMenuButton
              onClick={handleLogout}
              className="flex w-full items-center gap-2.5 rounded-full px-3 py-2 text-[13px] font-medium text-black/45 transition-colors hover:bg-black/[0.04] hover:text-black"
            >
              <LogOut className="h-[15px] w-[15px]" />
              <span>Sign out</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}