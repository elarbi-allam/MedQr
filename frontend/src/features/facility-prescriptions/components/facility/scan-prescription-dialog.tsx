// frontend/src/features/facility-prescriptions/components/facility/scan-prescription-dialog.tsx
"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { QrCode, KeyRound, Camera, Clock, DollarSign } from "lucide-react";
import { useScanCodeAndRequestAccess } from "../../hooks/use-facility";
import { toast } from "sonner";

type ScanPrescriptionDialogProps = {
    open: boolean;
    setOpen: (open: boolean) => void;
};

export default function ScanPrescriptionDialog({ open, setOpen }: ScanPrescriptionDialogProps) {
    const [code, setCode] = useState("");
    const [estimatedDelay, setEstimatedDelay] = useState("");
    const [estimatedPrice, setEstimatedPrice] = useState("");
    const [activeTab, setActiveTab] = useState("code");

    const { mutate: scanAndRequest, isPending } = useScanCodeAndRequestAccess();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!code || !estimatedDelay || !estimatedPrice) {
            toast.error("Veuillez remplir tous les champs");
            return;
        }

        const price = parseFloat(estimatedPrice);
        if (isNaN(price) || price <= 0) {
            toast.error("Veuillez entrer un prix valide");
            return;
        }

        scanAndRequest(
            {
                code: code.toUpperCase(),
                request: {
                    estimatedDelay,
                    estimatedPrice: price,
                },
            },
            {
                onSuccess: () => {
                    setCode("");
                    setEstimatedDelay("");
                    setEstimatedPrice("");
                    setOpen(false);
                },
            }
        );
    };

    const handleScan = () => {
        toast.info("Fonctionnalité de scan QR en développement");
        // TODO: Implement QR scanner using device camera
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Scanner une ordonnance</DialogTitle>
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
                                <Label htmlFor="code">Code d'accès</Label>
                                <Input
                                    id="code"
                                    value={code}
                                    onChange={(e) => setCode(e.target.value.toUpperCase())}
                                    placeholder="20DB4424"
                                    maxLength={8}
                                    className="font-mono text-lg text-center tracking-wider"
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="delay">Délai estimé</Label>
                                <div className="flex items-center gap-2">
                                    <Clock className="h-4 w-4 text-muted-foreground" />
                                    <Input
                                        id="delay"
                                        value={estimatedDelay}
                                        onChange={(e) => setEstimatedDelay(e.target.value)}
                                        placeholder="Ex: 2 heures, 24h, 3 jours"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="price">Prix estimé (DH)</Label>
                                <div className="flex items-center gap-2">
                                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                                    <Input
                                        id="price"
                                        type="number"
                                        step="0.01"
                                        min="0"
                                        value={estimatedPrice}
                                        onChange={(e) => setEstimatedPrice(e.target.value)}
                                        placeholder="500.00"
                                        required
                                    />
                                </div>
                            </div>

                            <Button type="submit" className="w-full" disabled={isPending}>
                                {isPending ? "Envoi..." : "Envoyer la demande"}
                            </Button>
                        </form>
                    </TabsContent>

                    <TabsContent value="scan" className="space-y-4 mt-4">
                        <div className="flex flex-col items-center justify-center py-8 space-y-4">
                            <div className="p-6 bg-muted rounded-full">
                                <QrCode className="h-16 w-16 text-muted-foreground" />
                            </div>
                            <p className="text-center text-muted-foreground">
                                Scanner le code QR de l'ordonnance pour récupérer automatiquement le code
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