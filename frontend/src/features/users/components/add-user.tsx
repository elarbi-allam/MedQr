"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { CopyIcon, PlusIcon } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
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
import { useCreateUser } from "../hooks/use-user";

const addUserFormSchema = z.object({
    firstName: z.string().min(1, { message: "Le nom est requis" }),
    lastName: z.string().min(1, { message: "Le prénom est requis" }),
    email: z.string().email({ message: "L'adresse e-mail est invalide" }),
    role: z.enum(["admin", "user"], { message: "Le rôle est requis" }),
});

export default function AddUser() {
    const [userPassword, setUserPassword] = useState("");
    const addUserForm = useForm<z.infer<typeof addUserFormSchema>>({
        resolver: zodResolver(addUserFormSchema),
        defaultValues: {
            firstName: "",
            lastName: "",
            email: "",
            role: "user",
        },
        mode: "onChange",
    });

    const { mutateAsync: createUser } = useCreateUser();

    async function onSubmit(values: z.infer<typeof addUserFormSchema>) {
        const createdUser = await createUser({
            ...values,
        });
        if (createdUser.status === "SUCCESS") {
            setUserPassword(createdUser.data?.password || "");
        }
    }

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button
                    className="flex items-center gap-2 has-[>svg]:px-4 h-auto"
                    onClick={() => {
                        setUserPassword("");
                        addUserForm.reset();
                    }}
                >
                    <PlusIcon className="size-4" />
                    Ajouter un utilisateur
                </Button>
            </DialogTrigger>
            <DialogContent className="p-0 overflow-hidden">
                <DialogHeader className="p-4 bg-muted border-b">
                    <DialogTitle>Ajouter un utilisateur</DialogTitle>
                    <DialogDescription>
                        Ajouter un utilisateur à votre organisation
                    </DialogDescription>
                </DialogHeader>

                {/* form */}
                <Form {...addUserForm}>
                    <form
                        onSubmit={addUserForm.handleSubmit(onSubmit)}
                        className="space-y-8"
                    >
                        <div className="p-4 flex flex-col gap-4">
                            {/* first name */}
                            <FormField
                                control={addUserForm.control}
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
                                control={addUserForm.control}
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
                                control={addUserForm.control}
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
                                control={addUserForm.control}
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

                        {userPassword && (
                            <div className="p-4 mx-4 flex justify-center border rounded-lg">
                                <div className="flex flex-col gap-2">
                                    <span className="text-sm text-muted-foreground">
                                        Mot de passe
                                    </span>
                                    <div className="flex items-center gap-2">
                                        <span className="text-sm text-muted-foreground">
                                            {userPassword}
                                        </span>
                                        <CopyIcon
                                            className="size-4 cursor-pointer hover:text-brand animate-all duration-300 hover:scale-110"
                                            onClick={() => {
                                                navigator.clipboard.writeText(
                                                    userPassword
                                                );
                                                toast.success(
                                                    "Mot de passe copié avec succès"
                                                );
                                            }}
                                        />
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* footer */}
                        <DialogFooter className="p-4 bg-muted flex justify-end border-t">
                            <Button type="submit" className="">
                                Ajouter un utilisateur
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}
