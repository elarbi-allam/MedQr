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
import { useUpdateUser } from "../hooks/use-user";
import { UserDataType } from "../types/user.type";

const updateUserFormSchema = z.object({
    firstName: z.string().min(1, { message: "Le nom est requis" }),
    lastName: z.string().min(1, { message: "Le prénom est requis" }),
    email: z.string().email({ message: "L'adresse e-mail est invalide" }),
    role: z.enum(["admin", "user"], { message: "Le rôle est requis" }),
});

export default function EditUserDialog({
    user,
    open,
    setOpen,
}: {
    user: UserDataType;
    open: boolean;
    setOpen: (open: boolean) => void;
}) {
    const updateUserForm = useForm<z.infer<typeof updateUserFormSchema>>({
        resolver: zodResolver(updateUserFormSchema),
        defaultValues: {
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            role: "user",
        },
        mode: "onChange",
    });

    const { mutateAsync: updateUser, isPending } = useUpdateUser();

    const onSubmit = async (data: z.infer<typeof updateUserFormSchema>) => {
        const updatedUser = await updateUser({
            id: user.id,
            userData: {
                ...data,
            },
        });

        if (updatedUser.status === "SUCCESS") {
            setOpen(false);
        }
    };

    useEffect(() => {
        updateUserForm.reset({
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            role: "user",
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user]);

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="max-w-2xl p-0 overflow-hidden">
                <DialogHeader className="p-4 bg-muted border-b">
                    <DialogTitle>Modifier l&apos;utilisateur</DialogTitle>
                    <DialogDescription>
                        Faites des modifications à l&apos;information de
                        l&apos;utilisateur. Vous pouvez modifier leurs détails,
                        leurs rôles et leurs permissions.
                    </DialogDescription>
                </DialogHeader>
                {/* form */}
                <Form {...updateUserForm}>
                    <form
                        onSubmit={updateUserForm.handleSubmit(onSubmit)}
                        className="space-y-8"
                    >
                        <div className="p-4 flex flex-col gap-4">
                            {/* first name */}
                            <FormField
                                control={updateUserForm.control}
                                name="firstName"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Prénom</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="John"
                                                autoComplete="off"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* last name */}
                            <FormField
                                control={updateUserForm.control}
                                name="lastName"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Nom</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="Doe"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* email */}
                            <FormField
                                control={updateUserForm.control}
                                name="email"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Email</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="john.doe@example.com"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* role */}
                            <FormField
                                control={updateUserForm.control}
                                name="role"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Rôle</FormLabel>
                                        <FormControl>
                                            <Select
                                                {...field}
                                                value={field.value || ""}
                                                onValueChange={(val) => {
                                                    field.onChange(val);
                                                }}
                                            >
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Sélectionner un rôle" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="admin">
                                                        Admin
                                                    </SelectItem>
                                                    <SelectItem value="user">
                                                        User
                                                    </SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        {/* footer */}
                        <DialogFooter className="p-4 bg-muted flex justify-end border-t">
                            <Button
                                type="submit"
                                className=""
                                disabled={isPending}
                            >
                                {isPending ? (
                                    <>
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                        <span className="ml-2">
                                            En cours...
                                        </span>
                                    </>
                                ) : (
                                    "Modifier l'utilisateur"
                                )}
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}
