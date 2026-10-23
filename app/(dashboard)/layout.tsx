import { requireAuth }  from "@/lib/auth";
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { Navbar } from "./_componets/navbar";
import { AppSidebar } from "../components/dashboard/sidebar";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const user = await requireAuth();

  return (
    <SidebarProvider>
      <AppSidebar user={user} />
      <SidebarInset className="flex min-h-screen min-w-0 flex-col overflow-hidden bg-[#f6f5fb]">
        {/* Mobile sidebar trigger — shown only when sidebar is collapsed */}
        <Navbar />
        <main className="flex-1 overflow-auto bg-[#f6f5fb]">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}