"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2, Send, CheckCircle } from "lucide-react";
import {
  useVerificationStatus,
  useSubmitVerification,
  useVerificationRedirect,
} from "../hooks/use-verification";
import { VerificationProgress } from "@/components/ui/verification-progress";
import { VerificationPhase } from "../types/verification.type";
import RequiredDocuments from "@/features/documents/components/enterprise/required-documents";

export default function DocumentsVerification() {
  const { data: verificationStatus, isLoading } = useVerificationStatus();
  const { mutate: submitVerification, isPending: isSubmitting } =
    useSubmitVerification();

  // Utiliser le hook de redirection avec la page actuelle
  const { isLoading: redirectLoading } = useVerificationRedirect({
    currentPage: "documents",
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
  const canSubmit =
    status.documentsUploaded &&
    status.phase === VerificationPhase.DOCUMENT_UPLOAD;

  return (
    <div className="space-y-8">
      <VerificationProgress currentPhase={status.phase} />
      <RequiredDocuments />
      {canSubmit && (
        <Card className="border-green-200 bg-green-50 dark:bg-green-950">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <div>
                  <h3 className="font-semibold text-green-800 dark:text-green-200">
                    Documents complets
                  </h3>
                  <p className="text-sm text-green-600 dark:text-green-300">
                    Soumettez votre dossier pour vérification
                  </p>
                </div>
              </div>
              <Button
                onClick={() => submitVerification()}
                disabled={isSubmitting}
                className="bg-green-600 hover:bg-green-700"
              >
                {isSubmitting ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                ) : (
                  <Send className="h-4 w-4 mr-2" />
                )}
                Soumettre
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
