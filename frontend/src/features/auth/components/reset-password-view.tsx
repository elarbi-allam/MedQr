"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { KeyRound, Eye, EyeOff } from "lucide-react";

import { resetPasswordSchema } from "../schemas/reset-password-schema";
import { useResetPassword } from "../hooks/use-auth";
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
import { BackgroundEffects } from "@/components/ui/background-effects";

type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>;

type ResetPasswordViewProps = {
  token: string;
  isTokenValid: boolean;
  message: string | null;
};

export default function ResetPasswordView({
  token,
  isTokenValid,
  message,
}: ResetPasswordViewProps) {
  const [showPassword, setShowPassword] = useState(false);
  const { mutate: resetPassword, isPending } = useResetPassword();

  const form = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { password: "", confirmPassword: "" },
  });

  const onSubmit = (data: ResetPasswordFormValues) => {
    resetPassword({
      password: data.password,
      confirmPassword: data.confirmPassword,
      token,
    });
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4 relative overflow-hidden">
      <BackgroundEffects intensity="high" />

      <Card className="w-full max-w-md glass border-border shadow-2xl relative z-10">
        <CardHeader className="text-center pb-6">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-gradient-to-br from-brand to-primary rounded-2xl flex items-center justify-center shadow-lg">
              <KeyRound className="h-8 w-8 text-brand-foreground" />
            </div>
          </div>
          <CardTitle className="text-foreground text-xl font-semibold">
            Réinitialiser votre mot de passe
          </CardTitle>
          <CardDescription className="text-muted-foreground">
            {isTokenValid ? message : "Lien invalide."}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isTokenValid ? (
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6"
              >
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nouveau mot de passe</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            type={showPassword ? "text" : "password"}
                            placeholder="••••••••"
                            {...field}
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                            onClick={() => setShowPassword((prev) => !prev)}
                          >
                            {showPassword ? (
                              <EyeOff className="h-4 w-4" />
                            ) : (
                              <Eye className="h-4 w-4" />
                            )}
                          </Button>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Confirmez le mot de passe</FormLabel>
                      <FormControl>
                        <Input
                          type="password"
                          placeholder="••••••••"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" className="w-full" disabled={isPending}>
                  {isPending
                    ? "Enregistrement..."
                    : "Réinitialiser le mot de passe"}
                </Button>
              </form>
            </Form>
          ) : (
            <div className="text-center text-destructive bg-destructive/10 p-4 rounded-md">
              <p className="font-medium">
                {message || "Une erreur est survenue."}
              </p>
              <p className="text-sm text-destructive/80 mt-1">
                Veuillez faire une nouvelle demande.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
