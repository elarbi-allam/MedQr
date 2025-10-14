"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Upload } from "lucide-react";
import { useUploadPatientDocument } from "../../hooks/use-patient-records";
import { DocumentType } from "../../types/medical-record.types";

type UploadDocumentDialogProps = {
    open: boolean;
    setOpen: (open: boolean) => void;
};

export default function UploadDocumentDialog({ open, setOpen }: UploadDocumentDialogProps) {
    const [title, setTitle] = useState("");
    const [type, setType] = useState<DocumentType>(DocumentType.OTHER);
    const [file, setFile] = useState<File | null>(null);

    const { mutate: uploadDocument, isPending } = useUploadPatientDocument();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!file || !title) {
            return;
        }

        const formData = new FormData();
        formData.append("title", title);
        formData.append("type", type);
        formData.append("file", file);

        uploadDocument(formData, {
            onSuccess: () => {
                setTitle("");
                setType(DocumentType.OTHER);
                setFile(null);
                setOpen(false);
            },
        });
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Ajouter un document</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="title">Titre du document</Label>
                        <Input
                            id="title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="Ex: Analyse sanguine du 04/10/2025"
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="type">Type de document</Label>
                        <Select value={type} onValueChange={(v) => setType(v as DocumentType)}>
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value={DocumentType.ANALYSIS}>Analyse</SelectItem>
                                <SelectItem value={DocumentType.SCAN}>Scanner/Radio</SelectItem>
                                <SelectItem value={DocumentType.REPORT}>Rapport</SelectItem>
                                <SelectItem value={DocumentType.PRESCRIPTION}>Ordonnance</SelectItem>
                                <SelectItem value={DocumentType.OTHER}>Autre</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="file">Fichier</Label>
                        <Input
                            id="file"
                            type="file"
                            accept=".pdf,.jpg,.jpeg,.png"
                            onChange={(e) => setFile(e.target.files?.[0] || null)}
                            required
                        />
                        <p className="text-xs text-muted-foreground">PDF, JPG ou PNG - Max 10MB</p>
                    </div>

                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                            Annuler
                        </Button>
                        <Button type="submit" disabled={isPending || !file || !title}>
                            <Upload className="h-4 w-4 mr-2" />
                            {isPending ? "Téléchargement..." : "Télécharger"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
