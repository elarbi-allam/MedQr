// frontend/src/features/medical-records/components/provider/create-prescription-dialog.tsx
"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus } from "lucide-react";
import { useCreatePrescription } from "../../hooks/use-provider-records";
import { DocumentType, PatientType } from "../../types/medical-record.types";

type CreatePrescriptionDialogProps = {
    patient: PatientType;
    open: boolean;
    setOpen: (open: boolean) => void;
};

export default function CreatePrescriptionDialog({ patient, open, setOpen }: CreatePrescriptionDialogProps) {
    const [documentTitle, setDocumentTitle] = useState("");
    const [documentType, setDocumentType] = useState<DocumentType>(DocumentType.PRESCRIPTION);
    const [details, setDetails] = useState("");
    const [file, setFile] = useState<File | null>(null);

    const { mutate: createPrescription, isPending } = useCreatePrescription(patient.patientId);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!file || !documentTitle || !details) {
            return;
        }

        const formData = new FormData();
        formData.append("documentTitle", documentTitle);
        formData.append("documentType", documentType);
        formData.append("details", details);
        formData.append("file", file);

        createPrescription(formData, {
            onSuccess: () => {
                setDocumentTitle("");
                setDocumentType(DocumentType.PRESCRIPTION);
                setDetails("");
                setFile(null);
                setOpen(false);
            },
        });
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="sm:max-w-2xl">
                <DialogHeader>
                    <DialogTitle>
                        Créer une ordonnance pour {patient.firstName} {patient.lastName}
                    </DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="documentTitle">Titre du document</Label>
                        <Input
                            id="documentTitle"
                            value={documentTitle}
                            onChange={(e) => setDocumentTitle(e.target.value)}
                            placeholder="Ex: Ordonnance - Contrôle cardiaque"
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="documentType">Type de document</Label>
                        <Select value={documentType} onValueChange={(v) => setDocumentType(v as DocumentType)}>
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value={DocumentType.PRESCRIPTION}>Ordonnance</SelectItem>
                                <SelectItem value={DocumentType.REPORT}>Rapport</SelectItem>
                                <SelectItem value={DocumentType.OTHER}>Autre</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="details">Détails de l&apos;ordonnance</Label>
                        <Textarea
                            id="details"
                            value={details}
                            onChange={(e) => setDetails(e.target.value)}
                            placeholder="Médicaments: Paracétamol 500mg - 3 fois par jour pendant 5 jours.&#10;Analyses à faire: Bilan sanguin complet dans 2 semaines."
                            rows={6}
                            required
                        />
                        <p className="text-xs text-muted-foreground">
                            Décrivez les médicaments, analyses ou examens prescrits
                        </p>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="file">Document PDF</Label>
                        <Input
                            id="file"
                            type="file"
                            accept=".pdf"
                            onChange={(e) => setFile(e.target.files?.[0] || null)}
                            required
                        />
                        <p className="text-xs text-muted-foreground">Fichier PDF de l&apos;ordonnance - Max 10MB</p>
                    </div>

                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                            Annuler
                        </Button>
                        <Button type="submit" disabled={isPending || !file || !documentTitle || !details}>
                            <Plus className="h-4 w-4 mr-2" />
                            {isPending ? "Création..." : "Créer l'ordonnance"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
