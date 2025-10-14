"use client";

import Link from "next/link";
import {
  FileHeart,
  Eye,
  EyeOff,
  ArrowRight,
  Sparkles,
  Shield,
  Lock,
} from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useState } from "react";

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
import { useLogin } from "../hooks/use-auth";
import { loginSchema } from "../schemas/login-schema";

export default function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);

  const loginForm = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
    mode: "onChange",
  });

  const { mutate: login, isPending } = useLogin();

  const onSubmit = (data: z.infer<typeof loginSchema>) => {
    login(data);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden pd-8">
      {/* Layout en deux colonnes */}
      <div className="w-full max-w-6xl mx-auto grid lg:grid-cols-2 gap-12 items-center relative z-10">
        
        {/* SECTION GAUCHE - Informations et branding */}
        <div className="text-center lg:text-left animate-fade-in-up">
          {/* Logo et nom de l'application */}
          <div className="flex items-center justify-center lg:justify-start mb-8 animate-scale-in animate-delay-200">
            <div className="w-20 h-20 bg-primary rounded-3xl flex items-center justify-center shadow-2xl mr-6">
              <FileHeart className="h-10 w-10 text-white" />
            </div>
            <div>
              <h1 className="text-5xl font-bold text-primary">
                MedQR
              </h1>
              <p className="text-lg text-muted-foreground mt-2">
                Votre Dossier Médical Numérique
              </p>
            </div>
          </div>

          {/* Titre et description */}
          <div className="space-y-6">
            <h2 className="text-4xl md:text-5xl font-bold text-foreground leading-tight animate-slide-in-left animate-delay-300">
              Bienvenue{" "}
              <span className="text-primary">
                sur MedQR
              </span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-xl lg:max-w-none leading-relaxed animate-slide-in-right animate-delay-500">
              Accédez à votre dossier médical en toute sécurité et gérez vos documents de santé en un seul endroit
            </p>
            <div className="flex items-center justify-center lg:justify-start gap-3 text-base text-muted-foreground animate-fade-in-up animate-delay-700">
              <Shield className="h-5 w-5 text-primary" />
              <span>Sécurisé • Accessible • Partageable</span>
              <Sparkles className="h-5 w-5 text-primary" />
            </div>

            {/* Avantages de la plateforme */}
            <div className="grid grid-cols-2 gap-6 mt-8 animate-fade-in-up animate-delay-1000">
              <div className="text-center lg:text-left">
                <div className="text-3xl font-bold text-primary mb-1">100%</div>
                <div className="text-sm text-muted-foreground">Sécurisé et confidentiel</div>
              </div>
              <div className="text-center lg:text-left">
                <div className="text-3xl font-bold text-primary mb-1">24/7</div>
                <div className="text-sm text-muted-foreground">Accès à vos documents</div>
              </div>
            </div>
          </div>
        </div>

        {/* SECTION DROITE - Formulaire de connexion */}
        <Card className="w-full max-w-xl glass border-border shadow-2xl mx-auto animate-fade-in animate-delay-1200">
          <CardHeader className="text-center pb-6">
            <CardTitle className="text-foreground text-2xl font-semibold">
              Connexion
            </CardTitle>
            <CardDescription className="text-muted-foreground">
              Connectez-vous à votre espace MedQR
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...loginForm}>
              <form
                onSubmit={loginForm.handleSubmit(onSubmit)}
                className="space-y-4"
              >
                {/* Champ Email */}
                <FormField
                  control={loginForm.control}
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

                {/* Champ Mot de passe */}
                <FormField
                  control={loginForm.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm flex justify-between text-foreground font-medium">
                        Mot de passe
                        <Link
                          href="/forgot-password"
                          className="w-fit text-sm text-muted-foreground hover:text-primary transition-colors font-medium"
                        >
                          Mot de passe oublié?
                        </Link>
                      </FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            type={showPassword ? "text" : "password"}
                            placeholder="••••••••"
                            {...field}
                            className="input-enhanced focus-ring pr-12"
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-accent/20 text-muted-foreground hover:text-foreground transition-colors"
                            onClick={() => setShowPassword(!showPassword)}
                          >
                            {showPassword ? (
                              <EyeOff className="h-4 w-4" />
                            ) : (
                              <Eye className="h-4 w-4" />
                            )}
                          </Button>
                        </div>
                      </FormControl>
                      <FormMessage className="text-destructive" />
                    </FormItem>
                  )}
                />

                {/* Bouton de connexion */}
                <Button
                  type="submit"
                  className="w-full bg-primary hover:bg-muted-foreground text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 font-semibold text-base py-3 group"
                  disabled={isPending}
                >
                  {isPending ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                      Connexion en cours...
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <Lock className="h-4 w-4" />
                      Se connecter
                      <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </div>
                  )}
                </Button>
              </form>
            </Form>

            {/* Lien vers l'inscription */}
            <div className="mt-6 text-center">
              <p className="text-sm text-muted-foreground">
                Pas encore de compte?{" "}
                <Link
                  href="/register"
                  className="text-primary hover:text-muted-foreground hover:underline transition-colors font-medium"
                >
                  Créer un compte
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}