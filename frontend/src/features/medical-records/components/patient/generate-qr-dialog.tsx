// frontend/src/features/medical-records/components/patient/generate-qr-dialog.tsx
"use client";

import { useEffect, useState, useCallback } from "react";
import Image from "next/image";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { QrCode, Copy, RefreshCw, Clock } from "lucide-react";
import { useGenerateAccessCode } from "../../hooks/use-patient-records";
import QRCode from "qrcode";
import { toast } from "sonner";

type GenerateQRDialogProps = {
    open: boolean;
    setOpen: (open: boolean) => void;
};

export default function GenerateQRDialog({ open, setOpen }: GenerateQRDialogProps) {
    const [qrDataUrl, setQrDataUrl] = useState<string>("");
    const [accessCode, setAccessCode] = useState<string>("");
    const [expiresAt, setExpiresAt] = useState<string>("");

    const { mutate: generateCode, isPending } = useGenerateAccessCode();

    const handleGenerate = useCallback(() => {
        generateCode(undefined, {
            onSuccess: async (data) => {
                if (data.status === "SUCCESS" && data.data) {
                    const code = data.data.accessCode;
                    setAccessCode(code);
                    setExpiresAt(data.data.expiresAt);

                    // Generate QR code
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
                        toast.error("Erreur lors de la génération du QR Code");
                    }
                }
            },
            onError: (error: unknown) => {
                console.error("Access code generation error:", error);
                toast.error("Erreur lors de la génération du code d'accès");
            },
        });
    }, [generateCode]);

    const handleCopyCode = useCallback(() => {
        if (!accessCode) return;
        
        navigator.clipboard.writeText(accessCode)
            .then(() => {
                toast.success("Code copié dans le presse-papier");
            })
            .catch((err) => {
                console.error("Failed to copy code:", err);
                toast.error("Erreur lors de la copie du code");
            });
    }, [accessCode]);

    useEffect(() => {
        if (open && !accessCode) {
            handleGenerate();
        }
    }, [open, accessCode, handleGenerate]);

    const handleDialogOpenChange = useCallback((newOpen: boolean) => {
        setOpen(newOpen);
        if (!newOpen) {
            // Reset state when dialog closes
            setTimeout(() => {
                setQrDataUrl("");
                setAccessCode("");
                setExpiresAt("");
            }, 300);
        }
    }, [setOpen]);

    return (
        <Dialog open={open} onOpenChange={handleDialogOpenChange}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <QrCode className="h-5 w-5" />
                        Code d&apos;accès temporaire
                    </DialogTitle>
                </DialogHeader>

                {isPending ? (
                    <div className="flex flex-col items-center justify-center py-12 space-y-3">
                        <RefreshCw className="h-8 w-8 animate-spin text-primary" />
                        <p className="text-sm text-muted-foreground">Génération du code...</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {qrDataUrl && (
                            <div className="flex justify-center">
                                <div className="border-4 border-primary rounded-lg p-4 bg-white">
                                    <Image 
                                        src={qrDataUrl} 
                                        alt="QR Code pour l'accès au dossier médical" 
                                        width={256}
                                        height={256}
                                        className="w-64 h-64"
                                        priority
                                    />
                                </div>
                            </div>
                        )}

                        {accessCode && (
                            <div className="space-y-2">
                                <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                                    <code className="text-lg font-mono font-bold tracking-wider">{accessCode}</code>
                                    <Button 
                                        size="icon" 
                                        variant="ghost" 
                                        onClick={handleCopyCode}
                                        disabled={!accessCode}
                                    >
                                        <Copy className="h-4 w-4" />
                                    </Button>
                                </div>

                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                    <Clock className="h-4 w-4" />
                                    <span>Expire le {new Date(expiresAt).toLocaleString("fr-FR")}</span>
                                </div>
                            </div>
                        )}

                        <div className="bg-blue-50 dark:bg-blue-950 p-3 rounded-lg border border-blue-200 dark:border-blue-800">
                            <p className="text-sm text-blue-900 dark:text-blue-100">
                                Présentez ce code QR ou le code à votre médecin pour qu&apos;il puisse accéder temporairement
                                à votre dossier médical.
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