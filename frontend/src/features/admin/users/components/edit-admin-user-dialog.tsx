"use client";

import { useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { useUpdateAdminUser } from "../hooks/use-admin-user";
import { AdminUserDataType } from "../types/admin-user.type";
import { UserRole } from "@/lib/types/user.type";
import { UserStatus } from "@/lib/enums/user-status";

const updateAdminUserFormSchema = z.object({
    firstName: z.string().min(2, "Le prénom doit contenir au moins 2 caractères"),
    lastName: z.string().min(2, "Le nom doit contenir au moins 2 caractères"),
    phoneNumber: z.string().optional(),
    role: z.nativeEnum(UserRole, { message: "Le rôle est requis" }),
    status: z.nativeEnum(UserStatus, { message: "Le statut est requis" }),
});

const roleOptions = [
    { value: UserRole.USER, label: "Utilisateur" },
    { value: UserRole.ENTERPRISE_USER, label: "Utilisateur Entreprise" },
    { value: UserRole.ADMIN, label: "Administrateur" },
];

const statusOptions = [
    { value: UserStatus.ACTIVE, label: "Actif" },
    { value: UserStatus.INACTIVE, label: "Inactif" },
    { value: UserStatus.PENDING, label: "En attente" },
    { value: UserStatus.ARCHIVE, label: "Archivé" },
];

export default function EditAdminUserDialog({
    user,
    open,
    setOpen,
}: {
    user: AdminUserDataType;
    open: boolean;
    setOpen: (open: boolean) => void;
}) {
    const updateUserForm = useForm<z.infer<typeof updateAdminUserFormSchema>>({
        resolver: zodResolver(updateAdminUserFormSchema),
        defaultValues: {
            firstName: user.firstName,
            lastName: user.lastName,
            phoneNumber: user.phoneNumber || "",
            role: user.role,
            status: user.status,
        },
        mode: "onChange",
    });

    const { mutateAsync: updateAdminUser, isPending } = useUpdateAdminUser();

    const onSubmit = async (data: z.infer<typeof updateAdminUserFormSchema>) => {
        const result = await updateAdminUser({
            id: user.id,
            userData: data,
        });

        if (result.status === "SUCCESS") {
            setOpen(false);
        }
    };

    useEffect(() => {
        updateUserForm.reset({
            firstName: user.firstName,
            lastName: user.lastName,
            phoneNumber: user.phoneNumber || "",
            role: user.role,
            status: user.status,
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user]);

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="max-w-2xl p-0 overflow-hidden">
                <DialogHeader className="p-4 bg-muted border-b">
                    <DialogTitle>Modifier l&apos;utilisateur</DialogTitle>
                    <DialogDescription>
                        Modifiez les informations de {user.firstName} {user.lastName}.
                    </DialogDescription>
                </DialogHeader>

                <Form {...updateUserForm}>
                    <form
                        onSubmit={updateUserForm.handleSubmit(onSubmit)}
                        className="space-y-8"
                    >
                        <div className="p-4 flex flex-col gap-4">
                            <FormField
                                control={updateUserForm.control}
                                name="firstName"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Prénom</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Prénom" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={updateUserForm.control}
                                name="lastName"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Nom</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Nom" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={updateUserForm.control}
                                name="phoneNumber"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Téléphone (optionnel)</FormLabel>
                                        <FormControl>
                                            <Input placeholder="+212 6 XX XX XX XX" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={updateUserForm.control}
                                name="role"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Rôle</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {roleOptions.map((option) => (
                                                    <SelectItem key={option.value} value={option.value}>
                                                        {option.label}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={updateUserForm.control}
                                name="status"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Statut</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {statusOptions.map((option) => (
                                                    <SelectItem key={option.value} value={option.value}>
                                                        {option.label}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <DialogFooter className="p-4 bg-muted flex justify-end border-t">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => setOpen(false)}
                            >
                                Annuler
                            </Button>
                            <Button type="submit" disabled={isPending}>
                                {isPending ? (
                                    <>
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                        <span className="ml-2">En cours...</span>
                                    </>
                                ) : (
                                    "Modifier"
                                )}
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}