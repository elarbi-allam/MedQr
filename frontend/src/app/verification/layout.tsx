import { redirect } from "next/navigation";
import { isEnterpriseUser } from "@/features/auth/dal/role-checks";
import { ThemeProvider } from "@/lib/providers/theme-provider";

export default async function VerificationLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const is_EnterpriseUser = await isEnterpriseUser();

  if (!is_EnterpriseUser) {
    return redirect("/unauthorized");
  }

  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="light"
      enableSystem
      disableTransitionOnChange
    >
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
        <div className="container mx-auto px-4 py-6 max-w-8xl">
          <div className="bg-white/80 backdrop-blur-sm dark:bg-slate-900/80 rounded-2xl shadow-xl border-0 p-8">
            {children}
          </div>
        </div>
      </div>
    </ThemeProvider>
  );
}
