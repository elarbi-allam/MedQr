import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { VerificationPhase } from "@/features/enterprise/verification/types/verification.type";
import { useQuery } from "@tanstack/react-query";
import { getVerificationStatus } from "../actions/verification-actions";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { submitForVerification } from "../actions/verification-actions";

interface UseVerificationRedirectOptions {
  currentPage?:
    | "/enterprise-user"
    | "verification"
    | "my-enterprise"
    | "documents";
  enableAutoRedirect?: boolean;
}

export function useVerificationRedirect(
  options: UseVerificationRedirectOptions = {}
) {
  const { currentPage, enableAutoRedirect = true } = options;
  const router = useRouter();
  const { data: verificationStatus, isLoading } = useVerificationStatus();

  useEffect(() => {
    if (!isLoading && verificationStatus?.data && enableAutoRedirect) {
      const { phase, canAccessDashboard } = verificationStatus.data;

      // Si vérifié et peut accéder au dashboard
      if (canAccessDashboard) {
        if (currentPage !== "/enterprise-user") {
          router.push("/enterprise-user");
        }
        return;
      }

      // Redirections basées sur la phase actuelle
      switch (phase) {
        case VerificationPhase.ENTERPRISE_CREATION:
          // Si on n'est pas sur la page de création d'entreprise, rediriger
          if (currentPage !== "my-enterprise") {
            router.push("/verification/my-enterprise");
          }
          break;

        case VerificationPhase.DOCUMENT_UPLOAD:
          // Si l'entreprise est créée, rediriger vers les documents
          if (currentPage === "my-enterprise") {
            router.push("/verification/documents");
          } else if (
            currentPage !== "documents" &&
            currentPage !== "verification"
          ) {
            router.push("/verification/documents");
          }
          break;

        case VerificationPhase.VERIFICATION_PENDING:
          // En attente de vérification, rediriger vers la page principale de vérification
          if (currentPage === "documents") {
            router.push("/verification");
          } else if (currentPage !== "verification") {
            router.push("/verification");
          }
          break;

        case VerificationPhase.VERIFIED:
          // Vérifié, aller au dashboard
          router.push("/enterprise-user");
          break;

        default:
          // Par défaut, aller à la page de vérification principale
          if (currentPage !== "verification") {
            router.push("/verification");
          }
          break;
      }
    }
  }, [verificationStatus, isLoading, router, currentPage, enableAutoRedirect]);

  return {
    isLoading,
    isVerified: verificationStatus?.data?.canAccessDashboard || false,
    currentPhase: verificationStatus?.data?.phase,
    verificationData: verificationStatus?.data,
  };
}
export function useVerificationStatus() {
  return useQuery({
    queryKey: ["verification-status"],
    queryFn: () => getVerificationStatus().then((response) => response),
    staleTime: 1000 * 60 * 1, // 1 minute
    refetchOnWindowFocus: true,
    refetchInterval: 30000, // Refetch toutes les 30 secondes
  });
}

export function useSubmitVerification() {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: submitForVerification,
    onSuccess: (data) => {
      if (data.status === "SUCCESS") {
        toast.success("Dossier soumis pour vérification");

        // Invalider les queries pour forcer le rechargement
        queryClient.invalidateQueries({
          queryKey: ["verification-status"],
        });
        queryClient.invalidateQueries({
          queryKey: ["my-enterprise"],
        });

        // Redirection automatique vers la page de vérification principale
        // La redirection se fera automatiquement grâce au hook useVerificationRedirect
        setTimeout(() => {
          router.push("/verification");
        }, 500);
      } else {
        toast.error(data.message);
      }
    },
    onError: () => {
      toast.error("Erreur lors de la soumission");
    },
  });
}
