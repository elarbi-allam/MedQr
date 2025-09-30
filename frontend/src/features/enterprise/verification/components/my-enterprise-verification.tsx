"use client";

import { Loader2 } from "lucide-react";
import {
  useVerificationStatus,
  useVerificationRedirect,
} from "../hooks/use-verification";
import { VerificationProgress } from "@/components/ui/verification-progress";
import MyEnterpriseForm from "@/features/enterprise/my-enterprise/components/my-enterprise-form";

export default function MyEnterpriseVerification() {
  const { data: verificationStatus, isLoading } = useVerificationStatus();

  // Utiliser le hook de redirection avec la page actuelle
  const { isLoading: redirectLoading } = useVerificationRedirect({
    currentPage: "my-enterprise",
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

  return (
    <div className="space-y-8">
      <VerificationProgress currentPhase={verificationStatus.data.phase} />
      <MyEnterpriseForm />
    </div>
  );
}
