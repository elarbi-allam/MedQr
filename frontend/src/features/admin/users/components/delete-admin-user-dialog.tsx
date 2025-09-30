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
import { useDeleteAdminUser } from "../hooks/use-admin-user";
import { AdminUserDataType } from "../types/admin-user.type";

interface DeleteAdminUserDialogProps {
    user: AdminUserDataType;
    open: boolean;
    setOpen: (open: boolean) => void;
}

export default function DeleteAdminUserDialog({ 
    user, 
    open, 
    setOpen 
}: DeleteAdminUserDialogProps) {
    const { mutate: deleteAdminUser, isPending } = useDeleteAdminUser();

    const handleDelete = () => {
        deleteAdminUser(user.id, {
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
                    <AlertDialogTitle>Supprimer l&apos;utilisateur</AlertDialogTitle>
                </AlertDialogHeader>
                <AlertDialogDescription className="p-4 flex flex-col gap-1.5">
                    <span>
                        Êtes-vous sûr de vouloir supprimer l&apos;utilisateur{" "}
                        <span className="font-semibold">
                            {user.firstName} {user.lastName}
                        </span>{" "}
                        avec l&apos;email ({user.email}) ?
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