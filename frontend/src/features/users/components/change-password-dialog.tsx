import React, { useState } from "react";
import { CopyIcon, Loader2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useAdminChangeUserPassword } from "../hooks/use-user";
import { UserDataType } from "../types/user.type";

interface ChangePasswordDialogProps {
    user: Omit<UserDataType, "createdAt" | "updatedAt" | "status" | "password">;
    open: boolean;
    setOpen: (open: boolean) => void;
    requestId: string;
}

export default function ChangePasswordDialog({ user, open, setOpen, requestId }: ChangePasswordDialogProps) {
    const [newPassword, setNewPassword] = useState<string | null>(null);

    const { mutateAsync: generateNewPassword, isPending } = useAdminChangeUserPassword();

    const handleGenerateNewPassword = async () => {
        const response = await generateNewPassword({
            id: user.id,
            requestId,
        });

        if (response.status === "SUCCESS") {
            setNewPassword(response.data?.newPassword || "");
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="max-w-2xl p-0 overflow-hidden">
                <DialogHeader className="p-4 bg-muted border-b">
                    <DialogTitle>
                        Changer le mot de passe de {user.firstName} {user.lastName}
                    </DialogTitle>
                    <DialogDescription>
                        Faites des modifications à l&apos;information de l&apos;utilisateur. Vous pouvez modifier leurs
                        détails, leurs rôles et leurs permissions.
                    </DialogDescription>
                </DialogHeader>
                {/* Button to generate new password */}
                <div className="p-4 flex justify-center mb-4">
                    <Button
                        variant="default"
                        className="rounded-lg"
                        onClick={handleGenerateNewPassword}
                        disabled={isPending}
                    >
                        {isPending ? <Loader2 className="size-4 animate-spin" /> : "Générer un nouveau mot de passe"}
                    </Button>
                </div>

                {newPassword && (
                    <div className="p-4 flex justify-center border rounded-lg">
                        <div className="flex flex-col gap-2">
                            <span className="text-sm text-muted-foreground">Nouveau mot de passe</span>
                            <div className="flex items-center gap-2">
                                <span className="text-sm text-muted-foreground">{newPassword}</span>
                                <CopyIcon
                                    className="size-4 cursor-pointer hover:text-brand animate-all duration-300 hover:scale-110"
                                    onClick={() => {
                                        navigator.clipboard.writeText(newPassword);
                                        toast.success("Mot de passe copié avec succès");
                                    }}
                                />
                            </div>
                        </div>
                    </div>
                )}
            </DialogContent>
        </Dialog>
    );
}
