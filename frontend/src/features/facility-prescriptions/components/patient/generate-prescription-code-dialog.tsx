// frontend/src/features/facility-prescriptions/components/patient/generate-prescription-code-dialog.tsx
"use client";

import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { QrCode, Copy, RefreshCw, Clock, Pill } from "lucide-react";
import { useGeneratePrescriptionAccessCode } from "../../hooks/use-patient-facility";
import QRCode from "qrcode";
import { toast } from "sonner";

type GeneratePrescriptionCodeDialogProps = {
    prescription: any;
    open: boolean;
    setOpen: (open: boolean) => void;
};

export default function GeneratePrescriptionCodeDialog({
    prescription,
    open,
    setOpen,
}: GeneratePrescriptionCodeDialogProps) {
    const [qrDataUrl, setQrDataUrl] = useState<string>("");
    const [accessCode, setAccessCode] = useState<string>("");
    const [expiresAt, setExpiresAt] = useState<string>("");
    const [prescriptionDetails, setPrescriptionDetails] = useState<string>("");

    const { mutate: generateCode, isPending } = useGeneratePrescriptionAccessCode();

    const handleGenerate = () => {
        if (!prescription?.prescriptionId) return;

        generateCode(prescription.prescriptionId, {
            onSuccess: async (data) => {
                if (data.status === "SUCCESS" && data.data) {
                    const code = data.data.accessCode;
                    setAccessCode(code);
                    setExpiresAt(data.data.expiresAt);
                    setPrescriptionDetails(data.data.prescriptionDetails);

                    try {
                        const url = await QRCode.toDataURL(code, {
                            width: 300,
                            margin: 2,
                            color: {
                                dark: "#000000",
                                light: "#FFFFFF",
                            },
                        });
                        setQrDataUrl(url);
                    } catch (err) {
                        console.error("QR Code generation error:", err);
                    }
                }
            },
        });
    };

    const handleCopyCode = () => {
        navigator.clipboard.writeText(accessCode);
        toast.success("Code copié dans le presse-papier");
    };

    useEffect(() => {
        if (open && prescription && !accessCode) {
            handleGenerate();
        }
    }, [open, prescription]);

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <Pill className="h-5 w-5" />
                        Code pour établissement
                    </DialogTitle>
                </DialogHeader>

                {isPending ? (
                    <div className="flex items-center justify-center py-12">
                        <RefreshCw className="h-8 w-8 animate-spin text-primary" />
                    </div>
                ) : (
                    <div className="space-y-4">
                        {qrDataUrl && (
                            <div className="flex justify-center">
                                <div className="border-4 border-primary rounded-lg p-4 bg-white">
                                    <img src={qrDataUrl} alt="QR Code" className="w-64 h-64" />
                                </div>
                            </div>
                        )}

                        {accessCode && (
                            <div className="space-y-2">
                                <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                                    <code className="text-lg font-mono font-bold">{accessCode}</code>
                                    <Button size="icon" variant="ghost" onClick={handleCopyCode}>
                                        <Copy className="h-4 w-4" />
                                    </Button>
                                </div>

                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                    <Clock className="h-4 w-4" />
                                    <span>Expire le {new Date(expiresAt).toLocaleString("fr-FR")}</span>
                                </div>
                            </div>
                        )}

                        {prescriptionDetails && (
                            <div className="bg-muted p-3 rounded-lg">
                                <p className="text-sm font-medium mb-1">Ordonnance:</p>
                                <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                                    {prescriptionDetails}
                                </p>
                            </div>
                        )}

                        <div className="bg-blue-50 dark:bg-blue-950 p-3 rounded-lg">
                            <p className="text-sm text-blue-900 dark:text-blue-100">
                                Présentez ce code QR ou le code à l'établissement (pharmacie/laboratoire) pour
                                qu'ils puissent accéder à votre ordonnance.
                            </p>
                        </div>

                        <Button
                            variant="outline"
                            className="w-full gap-2"
                            onClick={handleGenerate}
                            disabled={isPending}
                        >
                            <RefreshCw className="h-4 w-4" />
                            Générer un nouveau code
                        </Button>
                    </div>
                )}
            </DialogContent>
        </Dialog>
    );
}