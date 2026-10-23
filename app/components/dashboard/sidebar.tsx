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

const ACCENT = "#F27A1A"

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
    label: "Principal",
    items: [
      { label: "Panel", href: "/dashboard", icon: LayoutDashboard },
    ],
  },
  {
    label: "Evaluaciones",
    items: [
      { label: "Tests", href: "/tests", icon: ClipboardList },
      { label: "Informes", href: "/reports", icon: FileBarChart2 },
    ],
  },
  {
    label: "Cuenta",
    items: [
      { label: "Configuración", href: "/settings", icon: Settings },
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
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null)

    useEffect(() => {
    async function checkAdmin() {
      const { data, error } = await supabase
        .from('profiles')
        .select('role, avatar_url')
        .eq('id', user.id)
        .single()

      if (error) {
        console.error('Failed to fetch role:', error)
        return
      }

      setIsAdmin(data?.role === 'admin')
      setAvatarUrl(data?.avatar_url ?? null)
    }

    checkAdmin()
  }, [user.id, supabase])

  useEffect(() => {
    const handleAvatarUpdate = (event: Event) => {
      setAvatarUrl((event as CustomEvent<string>).detail)
    }
    window.addEventListener("profile-avatar-updated", handleAvatarUpdate)
    return () => window.removeEventListener("profile-avatar-updated", handleAvatarUpdate)
  }, [])

  const email = user.email ?? "admin"
  const initials = email.slice(0, 2).toUpperCase()

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push("/")
  }

  return (
    <Sidebar className="border-r border-[#141b3c]/10 bg-[#f6f5fb]">
      {/* ── Header ─────────────────────────────────────────── */}
      <SidebarHeader className="border-b border-[#141b3c]/10 px-4 py-4">
        <div className="flex items-center gap-3 rounded-2xl bg-white px-3 py-2.5 shadow-sm ring-1 ring-[#141b3c]/5">
          <Image
            src="/assets/teilen-logo.png"
            alt="Teilen Teens"
            width={52}
            height={42}
            priority
            style={{ objectFit: "contain" }}
          />
          <div className="min-w-0"><p className="truncate text-sm font-bold tracking-tight text-[#141b3c]">Teilen <span className="text-[#e46a12]">Teens</span></p><p className="mt-0.5 text-[10px] font-semibold uppercase tracking-[.16em] text-[#545c7e]/70">Tu espacio personal</p></div>
        </div>
      </SidebarHeader>

      {/* ── Nav ────────────────────────────────────────────── */}
      <SidebarContent className="px-2.5 py-4">
        {NAV.map((group) => (
          <SidebarGroup key={group.label} className="mb-5">
            <SidebarGroupLabel className="mb-1.5 px-3 text-[10px] font-bold uppercase tracking-[0.16em] text-[#545c7e]/70">
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
                          "group relative flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-[13px] font-semibold transition-all duration-150",
                          isActive
                            ? "text-[#141b3c] shadow-[3px_3px_0_#141b3c]"
                            : "text-[#545c7e] hover:bg-white hover:text-[#141b3c]"
                        )}
                        style={isActive ? { backgroundColor: ACCENT } : undefined}
                      >
                        <Icon
                          className={cn(
                            "h-[15px] w-[15px] shrink-0 transition-colors",
                            isActive ? "text-[#141b3c]" : "text-[#545c7e]/70 group-hover:text-[#e46a12]"
                          )}
                        />
                        <span className="truncate">{label}</span>
                        {isActive && (
                          <ChevronRight className="ml-auto h-3.5 w-3.5 shrink-0 text-[#141b3c]/65" />
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
      <SidebarFooter className="border-t border-[#141b3c]/10 p-3">
        {/* User card */}
        <div className="mb-1.5 flex items-center gap-2.5 rounded-2xl border border-[#141b3c]/8 bg-white px-3 py-2.5">
          {avatarUrl ? (
            <img src={avatarUrl} alt="Avatar" className="h-8 w-8 shrink-0 rounded-full object-cover" />
          ) : (
            <div
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl text-[11px] font-bold text-[#141b3c]"
              style={{ backgroundColor: "#ffc94d" }}
            >
              {initials}
            </div>
          )}
          <div className="flex min-w-0 flex-col">
            <span className="truncate text-[12px] font-semibold text-[#141b3c]">{email}</span>

          </div>
        </div>

        {/* Sign out */}
        <SidebarMenu>
          {isAdmin ?   <SidebarMenuItem className="px-1">
            
            <SidebarMenuButton
              onClick={()=>router.push('/admin/dashboard')}
              className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-[13px] font-semibold text-[#545c7e] transition-colors hover:bg-white hover:text-[#141b3c]"
            >
              <AdIcon className="h-[15px] w-[15px]" />
              <span>Página de administración</span>
            </SidebarMenuButton>
          </SidebarMenuItem> : <div>
            
            </div>}
         
          <SidebarMenuItem className="px-1">
            
            <SidebarMenuButton
              onClick={handleLogout}
              className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-[13px] font-semibold text-[#545c7e] transition-colors hover:bg-white hover:text-[#141b3c]"
            >
              <LogOut className="h-[15px] w-[15px]" />
              <span>Cerrar sesión</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}