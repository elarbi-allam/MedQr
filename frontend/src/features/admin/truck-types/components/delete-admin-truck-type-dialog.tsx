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
import { useDeleteTruckType } from "../hooks/use-admin-truck-type";
import { TruckTypeDataType } from "../types/truck-type.type";

interface DeleteAdminTruckTypeDialogProps {
  truckType: TruckTypeDataType;
  open: boolean;
  setOpen: (open: boolean) => void;
}

export default function DeleteAdminTruckTypeDialog({
  truckType,
  open,
  setOpen,
}: DeleteAdminTruckTypeDialogProps) {
  const { mutate: deleteTruckType, isPending } = useDeleteTruckType();

  const handleDelete = () => {
    deleteTruckType(truckType.id, {
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
          <AlertDialogTitle>Supprimer le type de camion</AlertDialogTitle>
        </AlertDialogHeader>
        <AlertDialogDescription className="p-4 flex flex-col gap-1.5">
          <span>
            Êtes-vous sûr de vouloir supprimer le type de camion{" "}
            <span className="font-semibold">{truckType.name}</span> (Slug:{" "}
            {truckType.slug}) ?
          </span>
          <span className="inline-flex items-center gap-1 font-semibold text-error-foreground">
            <AlertTriangleIcon className="size-4" /> Cette action est
            irréversible et supprimera toutes les données associées.
          </span>
        </AlertDialogDescription>
        <AlertDialogFooter className="p-4 bg-muted border-t">
          <AlertDialogCancel>Annuler</AlertDialogCancel>
          <AlertDialogAction
            className="bg-red-600 hover:bg-red-700"
            onClick={handleDelete}
            disabled={isPending}
          >
            {isPending ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              "Supprimer"
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
