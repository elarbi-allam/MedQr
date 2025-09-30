"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Building, FileText, Clock, Loader2, ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";
import {
  useVerificationStatus,
  useVerificationRedirect,
} from "../hooks/use-verification";
import { VerificationProgress } from "@/components/ui/verification-progress";
import { VerificationPhase } from "../types/verification.type";

export default function VerificationDashboard() {
  const router = useRouter();
  const { data: verificationStatus, isLoading } = useVerificationStatus();

  // Utiliser le hook de redirection avec la page actuelle
  const { isLoading: redirectLoading } = useVerificationRedirect({
    currentPage: "verification",
    enableAutoRedirect: true,
  });

  if (isLoading || redirectLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!verificationStatus?.data) return null;

  const status = verificationStatus.data;

  // Si peut accéder au dashboard, la redirection se fera automatiquement
  if (status.canAccessDashboard) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  const getActionContent = () => {
    switch (status.phase) {
      case VerificationPhase.ENTERPRISE_CREATION:
        return {
          icon: Building,
          title: "Créer votre entreprise",
          description: "Ajoutez les informations de votre entreprise",
          action: () => router.push("/verification/my-enterprise"),
          buttonText: "Commencer",
        };

      case VerificationPhase.DOCUMENT_UPLOAD:
        return {
          icon: FileText,
          title: "Télécharger vos documents",
          description: "Ajoutez les documents requis",
          action: () => router.push("/verification/documents"),
          buttonText: "Continuer",
        };

      case VerificationPhase.VERIFICATION_PENDING:
        return {
          icon: Clock,
          title: "Vérification en cours",
          description: "Nous examinons votre dossier",
          action: null,
          buttonText: "En attente...",
        };

      default:
        return null;
    }
  };

  const actionContent = getActionContent();
  if (!actionContent) return null;

  const Icon = actionContent.icon;

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-2">Vérification entreprise</h1>
        <p className="text-muted-foreground">
          Complétez votre profil pour accéder au dashboard
        </p>
      </div>

      <VerificationProgress currentPhase={status.phase} />

      <Card className="border-0 shadow-none">
        <CardContent className="p-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-blue-100 rounded-lg">
                <Icon className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold">{actionContent.title}</h3>
                <p className="text-muted-foreground text-sm">
                  {actionContent.description}
                </p>
              </div>
            </div>
            {actionContent.action && (
              <Button
                onClick={actionContent.action}
                size="lg"
                className="flex items-center gap-2"
              >
                {actionContent.buttonText}
                <ArrowRight className="h-4 w-4" />
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
