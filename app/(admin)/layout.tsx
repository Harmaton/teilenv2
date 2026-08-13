import { requireAuth }  from "@/lib/auth";

import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { Navbar } from "../(dashboard)/_componets/navbar";
import { AppSidebar } from "./_components/admin-sidebar";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const user = await requireAuth();

  return (
    <SidebarProvider>
      <AppSidebar user={user} />
      <SidebarInset className="flex flex-col min-h-screen min-w-0 overflow-hidden">
        {/* Mobile sidebar trigger — shown only when sidebar is collapsed */}
        <div className="flex items-center gap-2 px-4 py-2 border-b border-black/10 md:hidden">
          <SidebarTrigger className="h-8 w-8" />
        </div>
        <Navbar />
        <main className="flex-1 overflow-auto">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}