// frontend/src/features/facility-prescriptions/components/facility/upload-result-dialog.tsx
"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Upload } from "lucide-react";
import { useUploadPrescriptionResult } from "../../hooks/use-facility";

interface Request {
    requestId: string;
}

type UploadResultDialogProps = {
    request: Request | null;
    open: boolean;
    setOpen: (open: boolean) => void;
};

export default function UploadResultDialog({ request, open, setOpen }: UploadResultDialogProps) {
    const [documentTitle, setDocumentTitle] = useState("");
    const [file, setFile] = useState<File | null>(null);

    const { mutate: uploadResult, isPending } = useUploadPrescriptionResult();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!file || !documentTitle || !request) {
            return;
        }

        const formData = new FormData();
        formData.append("documentTitle", documentTitle);
        formData.append("file", file);

        uploadResult(
            { requestId: request.requestId, formData },
            {
                onSuccess: () => {
                    setDocumentTitle("");
                    setFile(null);
                    setOpen(false);
                },
            },
        );
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Ajouter le résultat</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="title">Titre du document</Label>
                        <Input
                            id="title"
                            value={documentTitle}
                            onChange={(e) => setDocumentTitle(e.target.value)}
                            placeholder="Ex: Résultat analyse sanguine"
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="file">Fichier PDF</Label>
                        <Input
                            id="file"
                            type="file"
                            accept=".pdf"
                            onChange={(e) => setFile(e.target.files?.[0] || null)}
                            required
                        />
                        <p className="text-xs text-muted-foreground">Fichier PDF du résultat - Max 10MB</p>
                    </div>

                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                            Annuler
                        </Button>
                        <Button type="submit" disabled={isPending || !file || !documentTitle}>
                            <Upload className="h-4 w-4 mr-2" />
                            {isPending ? "Téléchargement..." : "Télécharger"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
