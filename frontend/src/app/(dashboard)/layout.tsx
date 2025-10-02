import { cookies } from "next/headers";
import { AppSidebar } from "@/components/app-sidebar";
import { AppNavbar } from "@/components/app-navbar-minim";
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
              {/* Container principal avec bordure arrondie */}
              <div className="m-2 rounded-2xl border bg-background shadow-sm flex flex-col h-full overflow-hidden">
                
                {/* Navbar minimaliste en haut */}
                <AppNavbar />

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