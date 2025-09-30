import { cookies } from "next/headers";
import { AppSidebar } from "@/components/app-sidebar";
import { AppNavbar } from "@/components/ui/app-navbar";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { ThemeProvider } from "@/lib/providers/theme-provider";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const defaultSidebarState =
    cookieStore.get("sidebar_state")?.value === "true";

  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="light"
      enableSystem
      disableTransitionOnChange
    >
      <div className="h-screen w-full bg-background relative flex flex-col">
        <SidebarProvider defaultOpen={defaultSidebarState}>
          <div className="flex h-full w-full">
            <AppSidebar />

            <SidebarInset className="flex-1 w-auto min-w-0 flex flex-col overflow-hidden">
              {/* Header avec style entreprise mais structure responsive */}
              <div className="m-2 rounded-2xl border bg-background shadow-sm flex flex-col h-full">
                <div className="px-6 py-4 border-b border-border/50">
                  <AppNavbar
                    variant="dashboard"
                    showAuthButtons={false}
                    showUserMenu={true}
                  />
                </div>

                {/* Contenu scrollable */}
                <main className="flex-1 overflow-auto px-6 py-4">
                  {children}
                </main>
              </div>
            </SidebarInset>
          </div>
        </SidebarProvider>
      </div>
    </ThemeProvider>
  );
}
