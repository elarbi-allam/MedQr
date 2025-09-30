import { useRouter } from "next/navigation";
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
import { useDeleteEnterprise } from "../hooks/use-admin-enterprise";
import { EnterpriseDataType } from "../types/enterprise.type";

interface DeleteAdminEnterpriseDialogProps {
  enterprise: EnterpriseDataType;
  open: boolean;
  setOpen: (open: boolean) => void;
  redirectAfterDelete?: boolean;
}

export default function DeleteAdminEnterpriseDialog({
  enterprise,
  open,
  setOpen,
  redirectAfterDelete = false,
}: DeleteAdminEnterpriseDialogProps) {
  const router = useRouter();
  const { mutate: deleteEnterprise, isPending } = useDeleteEnterprise();

  const handleDelete = () => {
    deleteEnterprise(enterprise.id, {
      onSuccess: (data) => {
        if (data?.status === "SUCCESS") {
          setOpen(false);
          // Rediriger vers la liste si on est sur la page de détail
          if (redirectAfterDelete) {
            router.push("/admin/enterprises");
          }
        }
      },
    });
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogContent className="p-0 overflow-hidden">
        <AlertDialogHeader className="p-4 bg-muted border-b">
          <AlertDialogTitle>Supprimer l&apos;entreprise</AlertDialogTitle>
        </AlertDialogHeader>
        <AlertDialogDescription className="p-4 flex flex-col gap-1.5">
          <span>
            Êtes-vous sûr de vouloir supprimer l&apos;entreprise{" "}
            <span className="font-semibold">{enterprise.name}</span> (ICE:{" "}
            {enterprise.ice}) ?
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
