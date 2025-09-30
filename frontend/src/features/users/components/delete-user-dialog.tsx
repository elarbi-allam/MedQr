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
import { useDeleteUser } from "../hooks/use-user";
import { UserDataType } from "../types/user.type";

interface DeleteUserDialogProps {
    user: UserDataType;
    open: boolean;
    setOpen: (open: boolean) => void;
}

export default function DeleteUserDialog({ user, open, setOpen }: DeleteUserDialogProps) {
    const { mutate: deleteUser, isPending } = useDeleteUser();
    return (
        <AlertDialog open={open} onOpenChange={setOpen}>
            <AlertDialogContent className="p-0 overflow-hidden">
                <AlertDialogHeader className="p-4 bg-muted border-b">
                    <AlertDialogTitle>Supprimer l&apos;utilisateur</AlertDialogTitle>
                </AlertDialogHeader>
                <AlertDialogDescription className="p-4 flex flex-col gap-1.5">
                    <span>
                        Êtes-vous sûr de vouloir supprimer l&apos;utilisateur{" "}
                        <span className="font-semibold capitalize">
                            {user.firstName} {user.lastName}
                        </span>{" "}
                        ?
                    </span>
                    <span className="inline-flex items-center gap-1 font-semibold text-error-foreground">
                        <AlertTriangleIcon className="size-4" /> Cette action est irréversible.
                    </span>
                </AlertDialogDescription>
                <AlertDialogFooter className="p-4 bg-muted border-t">
                    <AlertDialogCancel>Annuler</AlertDialogCancel>
                    <AlertDialogAction
                        className="bg-error text-error-foreground hover:bg-error"
                        onClick={() => deleteUser(user.id)}
                        disabled={isPending}
                    >
                        {isPending ? <Loader2 className="size-4 animate-spin" /> : "Supprimer"}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
