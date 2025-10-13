// frontend/src/features/medical-records/components/provider/request-access-dialog.tsx
"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { QrCode, KeyRound, Camera } from "lucide-react";
import { useRequestAccessWithCode } from "../../hooks/use-provider-records";
import { toast } from "sonner";

type RequestAccessDialogProps = {
    open: boolean;
    setOpen: (open: boolean) => void;
};

export default function RequestAccessDialog({ open, setOpen }: RequestAccessDialogProps) {
    const [code, setCode] = useState("");
    const [activeTab, setActiveTab] = useState("code");

    const { mutate: requestAccess, isPending } = useRequestAccessWithCode();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!code) {
            toast.error("Veuillez entrer un code d'accès");
            return;
        }

        requestAccess(code, {
            onSuccess: () => {
                setCode("");
                setOpen(false);
            },
        });
    };

    const handleScan = () => {
        toast.info("Fonctionnalité de scan QR en développement");
        // TODO: Implement QR scanner using device camera
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Demander l&apos;accès au dossier</DialogTitle>
                    <DialogDescription>Scannez le code QR ou entrez le code fourni par le patient</DialogDescription>
                </DialogHeader>

                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                    <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="code" className="gap-2">
                            <KeyRound className="h-4 w-4" />
                            Code
                        </TabsTrigger>
                        <TabsTrigger value="scan" className="gap-2">
                            <Camera className="h-4 w-4" />
                            Scanner
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="code" className="space-y-4 mt-4">
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="code">Code d&apos;accès</Label>
                                <Input
                                    id="code"
                                    value={code}
                                    onChange={(e) => setCode(e.target.value.toUpperCase())}
                                    placeholder="A1B2C3D4"
                                    maxLength={8}
                                    className="font-mono text-lg text-center tracking-wider"
                                    required
                                />
                                <p className="text-xs text-muted-foreground">
                                    Entrez le code à 8 caractères fourni par le patient
                                </p>
                            </div>

                            <Button type="submit" className="w-full" disabled={isPending || !code}>
                                {isPending ? "Envoi..." : "Demander l'accès"}
                            </Button>
                        </form>
                    </TabsContent>

                    <TabsContent value="scan" className="space-y-4 mt-4">
                        <div className="flex flex-col items-center justify-center py-8 space-y-4">
                            <div className="p-6 bg-muted rounded-full">
                                <QrCode className="h-16 w-16 text-muted-foreground" />
                            </div>
                            <p className="text-center text-muted-foreground">
                                Scanner un code QR pour demander l&apos;accès automatiquement
                            </p>
                            <Button onClick={handleScan} className="gap-2">
                                <Camera className="h-4 w-4" />
                                Activer la caméra
                            </Button>
                        </div>
                    </TabsContent>
                </Tabs>
            </DialogContent>
        </Dialog>
    );
}
