"use client";

import { useCallback, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Upload, FileText, X } from "lucide-react";
import { useForm } from "react-hook-form";
import { useDropzone } from "react-dropzone";
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
import { Progress } from "@/components/ui/progress";
import { useUploadEnterpriseDocument } from "../../hooks/use-document";

const uploadFormSchema = z.object({
    file: z.instanceof(File, { message: "Veuillez sélectionner un fichier" }),
});

interface UploadDocumentDialogProps {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    template: any;
    open: boolean;
    setOpen: (open: boolean) => void;
    onSuccess?: () => void;
}

export default function UploadDocumentDialog({ template, open, setOpen, onSuccess }: UploadDocumentDialogProps) {
    const [uploadProgress, setUploadProgress] = useState(0);

    const uploadForm = useForm<z.infer<typeof uploadFormSchema>>({
        resolver: zodResolver(uploadFormSchema),
        mode: "onChange",
    });

    const { mutateAsync: uploadDocument, isPending } = useUploadEnterpriseDocument();

    const onDrop = useCallback(
        (acceptedFiles: File[]) => {
            if (acceptedFiles.length > 0) {
                const file = acceptedFiles[0];
                uploadForm.setValue("file", file);
                uploadForm.clearErrors("file");
            }
        },
        [uploadForm],
    );

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            "application/pdf": [".pdf"],
            "image/*": [".png", ".jpg", ".jpeg"],
            "application/msword": [".doc"],
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [".docx"],
        },
        maxFiles: 1,
        multiple: false,
    });

    const selectedFile = uploadForm.watch("file");

    const onSubmit = async (data: z.infer<typeof uploadFormSchema>) => {
        if (!template) return;

        const formData = new FormData();
        formData.append("documentTemplateId", template.id);
        formData.append(template.fieldname, data.file);

        try {
            // Simuler une progression
            const progressInterval = setInterval(() => {
                setUploadProgress((prev) => {
                    if (prev >= 90) {
                        clearInterval(progressInterval);
                        return prev;
                    }
                    return prev + 10;
                });
            }, 100);

            const result = await uploadDocument(formData);

            clearInterval(progressInterval);
            setUploadProgress(100);

            if (result.status === "SUCCESS") {
                setTimeout(() => {
                    setOpen(false);
                    uploadForm.reset();
                    setUploadProgress(0);
                    onSuccess?.();
                }, 1000);
            } else {
                setUploadProgress(0);
            }
        } catch {
            setUploadProgress(0);
        }
    };

    const handleClose = () => {
        if (!isPending) {
            setOpen(false);
            uploadForm.reset();
            setUploadProgress(0);
        }
    };

    const removeSelectedFile = () => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        uploadForm.setValue("file", undefined as any);
        uploadForm.clearErrors("file");
    };

    if (!template) return null;

    return (
        <Dialog open={open} onOpenChange={handleClose}>
            <DialogContent className="sm:max-w-[500px] p-0 overflow-hidden">
                <DialogHeader className="p-4 bg-muted border-b">
                    <DialogTitle>Télécharger un document</DialogTitle>
                    <DialogDescription>Téléchargez votre document pour &quot;{template.name}&quot;.</DialogDescription>
                </DialogHeader>

                <Form {...uploadForm}>
                    <form onSubmit={uploadForm.handleSubmit(onSubmit)} className="space-y-6">
                        <div className="p-4 space-y-4">
                            {/* Informations du template */}
                            <div className="p-3 bg-muted/50 rounded-lg">
                                <h4 className="font-medium text-sm mb-1">{template.name}</h4>
                                <p className="text-xs text-muted-foreground">{template.description}</p>
                            </div>

                            <FormField
                                control={uploadForm.control}
                                name="file"
                                render={() => (
                                    <FormItem>
                                        <FormLabel>Fichier à télécharger</FormLabel>
                                        <FormControl>
                                            <div className="space-y-2">
                                                {!selectedFile ? (
                                                    <div
                                                        {...getRootProps()}
                                                        className={`
                              border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors
                              ${
                                  isDragActive
                                      ? "border-brand bg-brand/5"
                                      : "border-muted-foreground/25 hover:border-brand hover:bg-brand/5"
                              }
                            `}
                                                    >
                                                        <input {...getInputProps()} />
                                                        <Upload className="h-10 w-10 mx-auto mb-4 text-muted-foreground" />
                                                        {isDragActive ? (
                                                            <p className="text-brand">Déposez le fichier ici...</p>
                                                        ) : (
                                                            <div>
                                                                <p className="text-sm font-medium mb-1">
                                                                    Cliquez pour sélectionner ou glissez-déposez
                                                                </p>
                                                                <p className="text-xs text-muted-foreground">
                                                                    PDF, Images, Word (max 10MB)
                                                                </p>
                                                            </div>
                                                        )}
                                                    </div>
                                                ) : (
                                                    <div className="flex items-center justify-between p-3 border rounded-lg bg-muted/50">
                                                        <div className="flex items-center gap-2">
                                                            <FileText className="h-4 w-4 text-brand" />
                                                            <div>
                                                                <p className="text-sm font-medium">
                                                                    {selectedFile.name}
                                                                </p>
                                                                <p className="text-xs text-muted-foreground">
                                                                    {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                                                                </p>
                                                            </div>
                                                        </div>
                                                        <Button
                                                            type="button"
                                                            variant="ghost"
                                                            size="sm"
                                                            onClick={removeSelectedFile}
                                                            disabled={isPending}
                                                        >
                                                            <X className="h-4 w-4" />
                                                        </Button>
                                                    </div>
                                                )}
                                            </div>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {isPending && uploadProgress > 0 && (
                                <div className="space-y-2">
                                    <div className="flex justify-between text-sm">
                                        <span>Téléchargement en cours...</span>
                                        <span>{uploadProgress}%</span>
                                    </div>
                                    <Progress value={uploadProgress} className="h-2" />
                                </div>
                            )}
                        </div>

                        <DialogFooter className="p-4 bg-muted flex justify-end border-t">
                            <Button type="button" variant="outline" onClick={handleClose} disabled={isPending}>
                                Annuler
                            </Button>
                            <Button type="submit" disabled={isPending || !selectedFile} className="min-w-[120px]">
                                {isPending ? "Téléchargement..." : "Télécharger"}
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}
