"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
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
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { updateProfileSchema } from "../schemas/profile-schemas";
import { useUpdateProfile } from "../hooks/use-profile";
import { UserRole } from "@/lib/types/user.type";

type ProfileDetailsFormProps = {
  defaultValues: z.infer<typeof updateProfileSchema> & {
    email: string;
    enterpriseName?: string;
    role: UserRole;
  };
};

export function ProfileDetailsForm({ defaultValues }: ProfileDetailsFormProps) {
  const { mutate: updateProfile, isPending } = useUpdateProfile();
  const isAdmin = defaultValues.role === UserRole.ADMIN;

  const form = useForm<z.infer<typeof updateProfileSchema>>({
    resolver: zodResolver(updateProfileSchema),
    defaultValues,
    mode: "onChange",
  });

  const onSubmit = (values: z.infer<typeof updateProfileSchema>) => {
    updateProfile(values);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Informations Personnelles</CardTitle>
        <CardDescription>
          Mettez à jour vos informations personnelles.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input readOnly disabled value={defaultValues.email} />
              </FormControl>
            </FormItem>

            {/* Afficher l'entreprise seulement si ce n'est pas un admin */}
            {!isAdmin && (
              <FormItem>
                <FormLabel>Nom de l&apos;entreprise</FormLabel>
                <FormControl>
                  <Input
                    readOnly
                    disabled
                    value={
                      defaultValues.enterpriseName ||
                      "Vous n'êtes pas encore associé à une entreprise."
                    }
                  />
                </FormControl>
              </FormItem>
            )}

            <FormField
              control={form.control}
              name="firstName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Prénom</FormLabel>
                  <FormControl>
                    <Input placeholder="Votre prénom" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="lastName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nom</FormLabel>
                  <FormControl>
                    <Input placeholder="Votre nom" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="phoneNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Téléphone</FormLabel>
                  <FormControl>
                    <Input placeholder="Votre numéro de téléphone" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={isPending}>
              {isPending ? "Sauvegarde..." : "Sauvegarder"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
