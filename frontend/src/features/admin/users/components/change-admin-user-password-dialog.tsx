import React, { useState } from "react";
import { CopyIcon, Loader2, AlertTriangle } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { 
    Dialog, 
    DialogContent, 
    DialogDescription, 
    DialogHeader, 
    DialogTitle,
    DialogFooter 
} from "@/components/ui/dialog";
import {
    Alert,
    AlertDescription,
} from "@/components/ui/alert";
import { useAdminChangeUserPassword } from "../hooks/use-admin-user";
import { AdminUserDataType } from "../types/admin-user.type";

interface ChangeAdminUserPasswordDialogProps {
    user: AdminUserDataType;
    open: boolean;
    setOpen: (open: boolean) => void;
}

export default function ChangeAdminUserPasswordDialog({ 
    user, 
    open, 
    setOpen 
}: ChangeAdminUserPasswordDialogProps) {
    const [passwordData, setPasswordData] = useState<{
        newPassword: string;
        message: string;
        email: string;
    } | null>(null);

    const { mutateAsync: changePassword, isPending } = useAdminChangeUserPassword();

    const handleGeneratePassword = async () => {
        const response = await changePassword(user.id);

        if (response.status === "SUCCESS" && response.data) {
            setPasswordData(response.data);
        }
    };

    const handleClose = () => {
        setOpen(false);
        setPasswordData(null);
    };

    const copyToClipboard = () => {
        if (passwordData?.newPassword) {
            navigator.clipboard.writeText(passwordData.newPassword);
            toast.success("Mot de passe copié avec succès");
        }
    };

    return (
        <Dialog open={open} onOpenChange={handleClose}>
            <DialogContent className="max-w-2xl p-0 overflow-hidden">
                <DialogHeader className="p-4 bg-muted border-b">
                    <DialogTitle>
                        Générer un nouveau mot de passe pour {user.firstName} {user.lastName}
                    </DialogTitle>
                    <DialogDescription>
                        Un nouveau mot de passe sera généré automatiquement pour cet utilisateur.
                    </DialogDescription>
                </DialogHeader>

                <div className="p-4 space-y-4">
                    {!passwordData ? (
                        <div className="space-y-4">
                            <Alert>
                                <AlertTriangle className="h-4 w-4" />
                                <AlertDescription>
                                    Cette action va générer un nouveau mot de passe aléatoirement pour l&apos;utilisateur <strong>{user.email}</strong>.
                                    L&apos;ancien mot de passe ne sera plus valide.
                                </AlertDescription>
                            </Alert>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            <Alert className="border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950">
                                <AlertDescription className="text-green-800 dark:text-green-200">
                                    {passwordData.message}
                                </AlertDescription>
                            </Alert>

                            <div className="p-4 border rounded-lg bg-muted/50">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-foreground">
                                        Nouveau mot de passe généré :
                                    </label>
                                    <div className="flex items-center gap-2">
                                        <code className="flex-1 p-2 bg-background border rounded font-mono text-sm">
                                            {passwordData.newPassword}
                                        </code>
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            onClick={copyToClipboard}
                                            className="flex items-center gap-2"
                                        >
                                            <CopyIcon className="h-4 w-4" />
                                            Copier
                                        </Button>
                                    </div>
                                </div>
                            </div>

                            <Alert>
                                <AlertTriangle className="h-4 w-4" />
                                <AlertDescription>
                                    Assurez-vous de communiquer ce mot de passe à l&apos;utilisateur de manière sécurisée.
                                    Ce mot de passe ne sera plus affiché après fermeture de cette fenêtre.
                                </AlertDescription>
                            </Alert>
                        </div>
                    )}
                </div>

                <DialogFooter className="p-4 bg-muted border-t">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={handleClose}
                    >
                        {passwordData ? "Fermer" : "Annuler"}
                    </Button>
                    {!passwordData && (
                        <Button 
                            onClick={handleGeneratePassword} 
                            disabled={isPending}
                            className="bg-blue-600 hover:bg-blue-700"
                        >
                            {isPending ? (
                                <>
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                    <span className="ml-2">Génération...</span>
                                </>
                            ) : (
                                "Générer un nouveau mot de passe"
                            )}
                        </Button>
                    )}
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}