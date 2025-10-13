// frontend/src/features/medical-records/components/patient/document-details-dialog.tsx
"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { FileText, Calendar, User } from "lucide-react";
import { DocumentDataType } from "../../types/medical-record.types";

type DocumentDetailsDialogProps = {
    document: DocumentDataType | null;
    open: boolean;
    setOpen: (open: boolean) => void;
};

export default function DocumentDetailsDialog({ document, open, setOpen }: DocumentDetailsDialogProps) {
    if (!document) return null;

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="sm:max-w-lg">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <FileText className="h-5 w-5" />
                        Détails du document
                    </DialogTitle>
                </DialogHeader>

                <div className="space-y-4">
                    <div>
                        <h3 className="font-semibold text-lg">{document.title}</h3>
                        <Badge className="mt-2">{document.type}</Badge>
                    </div>

                    <Separator />

                    <div className="space-y-3">
                        <div className="flex items-center gap-3">
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                            <div>
                                <p className="text-sm font-medium">Date de création</p>
                                <p className="text-sm text-muted-foreground">
                                    {new Date(document.uploadDate).toLocaleDateString("fr-FR", {
                                        day: "numeric",
                                        month: "long",
                                        year: "numeric",
                                    })}
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            <User className="h-4 w-4 text-muted-foreground" />
                            <div>
                                <p className="text-sm font-medium">Source</p>
                                <p className="text-sm text-muted-foreground">{document.source}</p>
                            </div>
                        </div>

                        {document.uploaderName && (
                            <div className="flex items-center gap-3">
                                <User className="h-4 w-4 text-muted-foreground" />
                                <div>
                                    <p className="text-sm font-medium">Téléchargé par</p>
                                    <p className="text-sm text-muted-foreground">{document.uploaderName}</p>
                                </div>
                            </div>
                        )}
                    </div>

                    {document.type === "PRESCRIPTION" && document.details && (
                        <>
                            <Separator />
                            <div>
                                <p className="text-sm font-medium mb-2">Détails de l&apos;ordonnance</p>
                                <div className="bg-muted p-3 rounded-md">
                                    <p className="text-sm whitespace-pre-wrap">{document.details}</p>
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
}
