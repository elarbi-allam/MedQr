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
import { useDeleteCity } from "../hooks/use-cities";
import { CityDataType } from "../types/city.type";

interface DeleteAdminCityDialogProps {
  city: CityDataType;
  open: boolean;
  setOpen: (open: boolean) => void;
}

export default function DeleteAdminCityDialog({
  city,
  open,
  setOpen,
}: DeleteAdminCityDialogProps) {
  const { mutate: deleteCity, isPending } = useDeleteCity();

  const handleDelete = () => {
    deleteCity(city.id, {
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
          <AlertDialogTitle>Supprimer la ville</AlertDialogTitle>
        </AlertDialogHeader>
        <AlertDialogDescription className="p-4 flex flex-col gap-1.5">
          <span>
            Êtes-vous sûr de vouloir supprimer la ville{" "}
            <span className="font-semibold">{city.name}</span> (
            {city.country.name}) ?
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
