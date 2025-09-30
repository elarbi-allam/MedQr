import { AlertTriangleIcon, Loader2 } from "lucide-react";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useDeleteDocumentTemplate } from "../hooks/use-document-template";
import { DocumentTemplateDataType } from "../types/document-template.type";

interface DeleteDocumentTemplateDialogProps {
  template: DocumentTemplateDataType;
  open: boolean;
  setOpen: (open: boolean) => void;
}

export default function DeleteDocumentTemplateDialog({ 
  template, 
  open, 
  setOpen 
}: DeleteDocumentTemplateDialogProps) {
  const { mutate: deleteDocumentTemplate, isPending } = useDeleteDocumentTemplate();

  const handleDelete = () => {
    deleteDocumentTemplate(template.id, {
      onSuccess: (data) => {
        if (data?.status === "SUCCESS") {
          setOpen(false);
        }
      },
    });
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogContent className="p-0 overflow-hidden">
        <AlertDialogHeader className="p-4 bg-muted border-b">
          <AlertDialogTitle>Supprimer le modèle de document</AlertDialogTitle>
        </AlertDialogHeader>
        <AlertDialogDescription className="p-4 flex flex-col gap-1.5">
          <span>
            Êtes-vous sûr de vouloir supprimer le modèle{" "}
            <span className="font-semibold">
              {template.name}
            </span>{" "}
            ({template.fieldname}) ?
          </span>
          <span className="inline-flex items-center gap-1 font-semibold text-error-foreground">
            <AlertTriangleIcon className="size-4" /> Cette action est irréversible.
          </span>
        </AlertDialogDescription>
        <AlertDialogFooter className="p-4 bg-muted border-t">
          <AlertDialogCancel>Annuler</AlertDialogCancel>
          <AlertDialogAction
            className="bg-red-600 hover:bg-red-700"
            onClick={handleDelete}
            disabled={isPending}
          >
            {isPending ? <Loader2 className="size-4 animate-spin" /> : "Supprimer"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}