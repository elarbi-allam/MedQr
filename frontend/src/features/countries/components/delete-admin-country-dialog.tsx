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
import { useDeleteCountry } from "../hooks/use-countries";
import { CountryDataType } from "../types/country.type";

interface DeleteAdminCountryDialogProps {
  country: CountryDataType;
  open: boolean;
  setOpen: (open: boolean) => void;
}

export default function DeleteAdminCountryDialog({
  country,
  open,
  setOpen,
}: DeleteAdminCountryDialogProps) {
  const { mutate: deleteCountry, isPending } = useDeleteCountry();

  const handleDelete = () => {
    deleteCountry(country.id, {
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
          <AlertDialogTitle>Supprimer le pays</AlertDialogTitle>
        </AlertDialogHeader>
        <AlertDialogDescription className="p-4 flex flex-col gap-1.5">
          <span>
            Êtes-vous sûr de vouloir supprimer le pays{" "}
            <span className="font-semibold">{country.name}</span> (
            {country.isoA3}) ?
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
