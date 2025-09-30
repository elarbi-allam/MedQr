import { Loader2 } from "lucide-react";

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
import { useUpdateUserStatus } from "../hooks/use-user";
import { STATUS_OPTIONS, UserDataType } from "../types/user.type";

export default function ChangeStatusDialog({
    user,
    open,
    setOpen,
    status,
}: {
    user: UserDataType;
    open: boolean;
    setOpen: (open: boolean) => void;
    status: string;
}) {
    const { mutate: updateUserStatus, isPending } = useUpdateUserStatus();
    return (
        <AlertDialog open={open} onOpenChange={setOpen}>
            <AlertDialogContent className="p-0 overflow-hidden">
                <AlertDialogHeader className="p-4 bg-muted border-b">
                    <AlertDialogTitle>
                        {status === STATUS_OPTIONS.Values.active
                            ? "Activer l'utilisateur"
                            : status === STATUS_OPTIONS.Values.inActive
                              ? "Désactiver l'utilisateur"
                              : "Suspendre l'utilisateur"}
                    </AlertDialogTitle>
                </AlertDialogHeader>
                <AlertDialogDescription className="p-4">
                    {status === STATUS_OPTIONS.Values.active
                        ? `Êtes-vous sûr de vouloir activer l'utilisateur ${user.firstName} ${user.lastName} ?`
                        : status === STATUS_OPTIONS.Values.inActive
                          ? `Êtes-vous sûr de vouloir désactiver l'utilisateur ${user.firstName} ${user.lastName} ?`
                          : `Êtes-vous sûr de vouloir suspendre l'utilisateur ${user.firstName} ${user.lastName} ?`}
                </AlertDialogDescription>
                <AlertDialogFooter className="p-4 bg-muted border-t">
                    <AlertDialogCancel>Annuler</AlertDialogCancel>
                    <AlertDialogAction
                        onClick={() =>
                            updateUserStatus({
                                id: user.id,
                                userData: { status: status },
                            })
                        }
                        disabled={isPending}
                    >
                        {isPending ? <Loader2 className="size-4 animate-spin" /> : "Confirmer"}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
