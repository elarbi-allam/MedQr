"use client";

import Link from "next/link";
import { Mail, KeyRound, ArrowLeft } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { BackgroundEffects } from "@/components/ui/background-effects";
import { useRequestPasswordReset } from "../hooks/use-auth";

const forgotPasswordSchema = z.object({
  email: z.string().email("Adresse email invalide"),
});

export default function ForgotPasswordForm() {
  const form = useForm<z.infer<typeof forgotPasswordSchema>>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
    mode: "onChange",
  });

  const { mutate: requestReset, isPending } = useRequestPasswordReset();

  const onSubmit = (data: z.infer<typeof forgotPasswordSchema>) => {
    requestReset(data);
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4 relative overflow-hidden">
      <BackgroundEffects intensity="medium" />

      <div className="w-full max-w-6xl mx-auto grid lg:grid-cols-2 gap-12 items-center relative z-10">
        {/* Section d'en-tête */}
        <div className="text-center lg:text-left animate-fade-in-up">
          <div className="flex items-center justify-center lg:justify-start mb-8">
            <div className="w-20 h-20 bg-gradient-to-br from-brand to-primary rounded-3xl flex items-center justify-center shadow-2xl mr-6">
              <KeyRound className="h-10 w-10 text-brand-foreground" />
            </div>
            <div>
              <h1 className="text-5xl font-bold bg-gradient-to-r from-brand via-primary to-accent bg-clip-text text-transparent">
                Mot de passe
              </h1>
              <p className="text-lg text-muted-foreground mt-2">
                Oublié ? Pas de problème.
              </p>
            </div>
          </div>
          <div className="space-y-6">
            <h2 className="text-4xl md:text-5xl font-bold text-foreground leading-tight">
              Récupérez votre accès en toute sécurité
            </h2>
            <p className="text-xl text-muted-foreground max-w-xl lg:max-w-none leading-relaxed">
              Entrez votre adresse e-mail et nous vous enverrons un lien pour
              réinitialiser votre mot de passe.
            </p>
          </div>
        </div>

        {/* Formulaire */}
        <Card className="w-full max-w-md glass border-border shadow-2xl hover-lift mx-auto">
          <CardHeader className="text-center pb-6">
            <CardTitle className="text-foreground text-xl font-semibold">
              Réinitialisation
            </CardTitle>
            <CardDescription className="text-muted-foreground">
              Entrez votre email ci-dessous
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6"
              >
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-foreground font-medium">
                        Email
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="votre@email.com"
                          {...field}
                          className="input-enhanced focus-ring"
                        />
                      </FormControl>
                      <FormMessage className="text-destructive" />
                    </FormItem>
                  )}
                />
                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-brand to-primary hover:from-brand/90 hover:to-primary/90 text-brand-foreground border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 font-semibold text-base py-3 group"
                  disabled={isPending}
                >
                  {isPending ? (
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                      Envoi en cours...
                    </div>
                  ) : (
                    <div className="flex items-center justify-center gap-2">
                      <Mail className="h-4 w-4" />
                      Envoyer le lien de réinitialisation
                    </div>
                  )}
                </Button>
              </form>
            </Form>
            <div className="mt-6 text-center">
              <Link
                href="/login"
                className="text-sm text-muted-foreground hover:text-brand transition-colors font-medium flex items-center justify-center gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Retour à la page de connexion
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
