"use client";

import Link from "next/link";
import {
  Truck,
  Eye,
  EyeOff,
  ArrowRight,
  Sparkles,
  Zap,
  Shield,
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
import { BackgroundEffects } from "@/components/ui/background-effects";
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
    <div className="min-h-screen bg-background flex items-center justify-center p-4 relative overflow-hidden pt-20">
      {/* Arrière-plan animé amélioré */}
      <BackgroundEffects intensity="medium" />

      {/* Layout en deux colonnes */}
      <div className="w-full max-w-6xl mx-auto grid lg:grid-cols-2 gap-12 items-center relative z-10">
        {/* Section d'en-tête motivante - Colonne de gauche */}
        <div className="text-center lg:text-left animate-fade-in-up">
          <div className="flex items-center justify-center lg:justify-start mb-8 animate-fade-in-up">
            <div className="w-20 h-20 bg-gradient-to-br from-brand to-primary rounded-3xl flex items-center justify-center shadow-2xl mr-6">
              <Truck className="h-10 w-10 text-brand-foreground" />
            </div>
            <div>
              <h1 className="text-5xl font-bold bg-gradient-to-r from-brand via-primary to-accent bg-clip-text text-transparent">
                Transmarket
              </h1>
              <p className="text-lg text-muted-foreground mt-2">
                Plateforme de Transport Intelligente
              </p>
            </div>
          </div>

          <div className="space-y-6">
            <h2 className="text-4xl md:text-5xl font-bold text-foreground leading-tight animate-fade-in-up animate-delay-200">
              Bienvenue{" "}
              <span className="bg-gradient-to-r from-brand to-primary bg-clip-text text-transparent">
                de retour
              </span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-xl lg:max-w-none leading-relaxed animate-fade-in-up animate-delay-300">
              Accédez à votre espace personnel et gérez vos transports en toute
              simplicité
            </p>
            <div className="flex items-center justify-center lg:justify-start gap-3 text-base text-muted-foreground animate-fade-in-up animate-delay-400">
              <Shield className="h-5 w-5 text-brand" />
              <span>Connexion sécurisée et rapide</span>
              <Sparkles className="h-5 w-5 text-primary" />
            </div>

            {/* Avantages de la connexion */}
            <div className="grid grid-cols-1 gap-4 mt-8 animate-fade-in-up animate-delay-600">
              <div className="flex items-center gap-3 text-center lg:text-left">
                <div className="w-8 h-8 bg-brand/20 rounded-full flex items-center justify-center">
                  <Sparkles className="h-4 w-4 text-brand" />
                </div>
                <span className="text-sm text-muted-foreground">
                  Accès instantané à votre tableau de bord
                </span>
              </div>
              <div className="flex items-center gap-3 text-center lg:text-left">
                <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center">
                  <Shield className="h-4 w-4 text-primary" />
                </div>
                <span className="text-sm text-muted-foreground">
                  Sécurité maximale avec authentification avancée
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Formulaire - Colonne de droite */}
        <Card className="w-full max-w-md glass border-border shadow-2xl hover-lift mx-auto">
          <CardHeader className="text-center pb-6">
            <CardTitle className="text-foreground text-xl font-semibold">
              Connexion
            </CardTitle>
            <CardDescription className="text-muted-foreground">
              Connectez-vous à votre compte
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...loginForm}>
              <form
                onSubmit={loginForm.handleSubmit(onSubmit)}
                className="space-y-6"
              >
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
                <FormField
                  control={loginForm.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm flex justify-between text-foreground font-medium">
                        Mot de passe
                        <Link
                          href="/forgot-password"
                          className="w-fit text-sm text-muted-foreground hover:text-brand transition-colors font-medium"
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
                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-brand to-primary hover:from-brand/90 hover:to-primary/90 text-brand-foreground border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 font-semibold text-base py-3 group"
                  disabled={isPending}
                >
                  {isPending ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                      Connexion en cours...
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <Zap className="h-4 w-4 group-hover:animate-pulse" />
                      Se connecter
                      <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </div>
                  )}
                </Button>
              </form>
            </Form>
            <div className="mt-6 text-center">
              <p className="text-sm text-muted-foreground">
                Pas encore de compte?{" "}
                <Link
                  href="/register"
                  className="text-brand hover:text-brand/80 hover:underline transition-colors font-medium"
                >
                  S&apos;inscrire
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
