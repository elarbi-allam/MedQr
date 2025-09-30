"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useUpdateDocumentStatus } from "../../hooks/use-document";
import { DocumentDataType, DocumentStatus } from "../../types/document.type";

const updateStatusFormSchema = z.object({
    status: z.nativeEnum(DocumentStatus, {
        message: "Le statut est requis",
    }),
});

const statusOptions = [
    {
        value: DocumentStatus.PENDING,
        label: "En attente",
        description: "Le document est en cours de vérification",
    },
    {
        value: DocumentStatus.ACCEPTED,
        label: "Accepté",
        description: "Le document a été approuvé",
    },
    {
        value: DocumentStatus.REJECTED,
        label: "Rejeté",
        description: "Le document a été refusé et doit être renvoyé",
    },
    {
        value: DocumentStatus.EXPIRED,
        label: "Expiré",
        description: "Le document a expiré et doit être renouvelé",
    },
];

interface UpdateDocumentStatusDialogProps {
    document: DocumentDataType;
    open: boolean;
    setOpen: (open: boolean) => void;
}

export default function UpdateDocumentStatusDialog({ document, open, setOpen }: UpdateDocumentStatusDialogProps) {
    const updateStatusForm = useForm<z.infer<typeof updateStatusFormSchema>>({
        resolver: zodResolver(updateStatusFormSchema),
        defaultValues: {
            status: document.status,
        },
        mode: "onChange",
    });

    const { mutateAsync: updateDocumentStatus, isPending } = useUpdateDocumentStatus();

    const onSubmit = async (data: z.infer<typeof updateStatusFormSchema>) => {
        const result = await updateDocumentStatus({
            id: document.id,
            statusData: data,
        });

        if (result.status === "SUCCESS") {
            setOpen(false);
            updateStatusForm.reset();
        }
    };

    const getCurrentStatusLabel = () => {
        const currentStatus = statusOptions.find((option) => option.value === document.status);
        return currentStatus?.label || "Inconnu";
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="sm:max-w-[500px] p-0 overflow-hidden">
                <DialogHeader className="p-4 bg-muted border-b">
                    <DialogTitle>Modifier le statut du document</DialogTitle>
                    <DialogDescription>
                        Changez le statut du document &quot;{document.docName}&quot;.
                        <br />
                        <span className="text-sm text-muted-foreground">
                            Statut actuel: <strong>{getCurrentStatusLabel()}</strong>
                        </span>
                    </DialogDescription>
                </DialogHeader>

                <Form {...updateStatusForm}>
                    <form onSubmit={updateStatusForm.handleSubmit(onSubmit)} className="space-y-6">
                        <div className="p-4">
                            <FormField
                                control={updateStatusForm.control}
                                name="status"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Nouveau statut</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Sélectionner un statut" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {statusOptions.map((option) => (
                                                    <SelectItem key={option.value} value={option.value}>
                                                        <div className="flex flex-col">
                                                            <span className="font-medium">{option.label}</span>
                                                            <span className="text-xs text-muted-foreground">
                                                                {option.description}
                                                            </span>
                                                        </div>
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {(updateStatusForm.watch("status") === DocumentStatus.REJECTED ||
                                updateStatusForm.watch("status") === DocumentStatus.EXPIRED) && (
                                <div className="mt-4 p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-700 rounded-md">
                                    <p className="text-sm text-yellow-800 dark:text-yellow-200">
                                        <strong>Note :</strong> L&apos;utilisateur pourra télécharger un nouveau
                                        document avec ce statut.
                                    </p>
                                </div>
                            )}
                        </div>

                        <DialogFooter className="p-4 bg-muted flex justify-end border-t">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => {
                                    setOpen(false);
                                    updateStatusForm.reset();
                                }}
                            >
                                Annuler
                            </Button>
                            <Button
                                type="submit"
                                disabled={isPending || updateStatusForm.watch("status") === document.status}
                            >
                                {isPending ? (
                                    <>
                                        <Loader2 className="w-4 h-4 animate-spin mr-2" />
                                        Mise à jour...
                                    </>
                                ) : (
                                    "Mettre à jour"
                                )}
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}
