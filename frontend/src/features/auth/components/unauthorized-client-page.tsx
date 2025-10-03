"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { UserRole } from "@/lib/types/user.type";

const roleToDashboardPath: Record<string, string> = {
  [UserRole.PATIENT]: "/patient",
  [UserRole.PROVIDER]: "/provider",
  [UserRole.FACILITY]: "/facility",
};

export default function UnauthorizedClientPage({
  userRole,
}: {
  userRole: string | null;
}) {
  const router = useRouter();

  const handleGoToDashboard = () => {
    if (userRole && roleToDashboardPath[userRole]) {
      router.push(roleToDashboardPath[userRole]);
    } else {
      router.push("/");
    }
  };

  const handleGoToLogin = () => {
    router.push("/login");
  };

  const handleGoHome = () => {
    router.push("/");
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      {/* Background effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,theme(colors.brand/0.1),transparent_70%)]"></div>
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-brand/10 rounded-full blur-3xl animate-pulse"></div>
        <div
          className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-primary/10 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "2s" }}
        ></div>
      </div>
      <div className="p-8 glass border-border rounded-lg shadow-2xl text-center w-full max-w-md relative z-10">
        <h1 className="text-3xl font-bold mb-4 text-foreground">
          Accès Refusé
        </h1>
        {/* Le message et les boutons changent en fonction de `userRole` */}
        {userRole ? (
          <>
            <p className="text-muted-foreground mb-6">
              Vous êtes connecté, mais vous n&apos;avez pas la permission pour
              cette page.
            </p>
            <div className="flex flex-col gap-3">
              <Button
                onClick={handleGoToDashboard}
                className="bg-gradient-to-r from-brand to-primary hover:from-brand/90 hover:to-primary/90 text-brand-foreground border-0 shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105"
              >
                Aller à mon tableau de bord
              </Button>
              <Button
                onClick={handleGoHome}
                variant="outline"
                className="border-border text-foreground hover:bg-accent bg-transparent"
              >
                Retour à l&apos;accueil
              </Button>
            </div>
          </>
        ) : (
          <>
            <p className="text-muted-foreground mb-6">
              Vous devez être connecté pour accéder à cette page.
            </p>
            <div className="flex flex-col gap-3">
              <Button
                onClick={handleGoToLogin}
                className="bg-gradient-to-r from-brand to-primary hover:from-brand/90 hover:to-primary/90 text-brand-foreground border-0 shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105"
              >
                Se connecter
              </Button>
              <Button
                onClick={handleGoHome}
                variant="outline"
                className="border-border text-foreground hover:bg-accent bg-transparent"
              >
                Retour à l&apos;accueil
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
