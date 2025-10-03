//frontend\src\features\auth\components\login-form.tsx
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


// const onSubmit = (data: z.infer<typeof loginSchema>) => {
//   setIsPending(true);
//   console.log("Login data:", data);
  
//   // Simulation d'un appel API
//   setTimeout(() => {
//     setIsPending(false);
//     alert(`Login réussi!\nEmail: ${data.email}`);
//   }, 1500);
// };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4 relative overflow-hidden pt-20">
      {/* Arrière-plan animé */}
      <BackgroundEffects intensity="medium" />

      {/* Layout en deux colonnes */}
      <div className="w-full max-w-6xl mx-auto grid lg:grid-cols-2 gap-12 items-center relative z-10">
        
        {/* SECTION GAUCHE - Informations et branding */}
        <div className="text-center lg:text-left animate-fade-in-up">
          {/* Logo et nom de l'application */}
          <div className="flex items-center justify-center lg:justify-start mb-8 animate-fade-in-up">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-3xl flex items-center justify-center shadow-2xl mr-6">
              <FileHeart className="h-10 w-10 text-white" />
            </div>
            <div>
              <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 via-cyan-500 to-teal-500 bg-clip-text text-transparent">
                MedQR
              </h1>
              <p className="text-lg text-muted-foreground mt-2">
                Votre Dossier Médical Numérique
              </p>
            </div>
          </div>

          {/* Titre et description */}
          <div className="space-y-6">
            <h2 className="text-4xl md:text-5xl font-bold text-foreground leading-tight animate-fade-in-up animate-delay-200">
              Bienvenue{" "}
              <span className="bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
                sur MedQR
              </span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-xl lg:max-w-none leading-relaxed animate-fade-in-up animate-delay-300">
              Accédez à votre dossier médical en toute sécurité et gérez vos documents de santé en un seul endroit
            </p>
            <div className="flex items-center justify-center lg:justify-start gap-3 text-base text-muted-foreground animate-fade-in-up animate-delay-400">
              <Shield className="h-5 w-5 text-blue-600" />
              <span>Connexion sécurisée et cryptée</span>
              <Lock className="h-5 w-5 text-cyan-500" />
            </div>

            {/* Avantages de la plateforme */}
            <div className="grid grid-cols-1 gap-4 mt-8 animate-fade-in-up animate-delay-600">
              <div className="flex items-center gap-3 text-center lg:text-left">
                <div className="w-8 h-8 bg-blue-600/20 rounded-full flex items-center justify-center">
                  <Sparkles className="h-4 w-4 text-blue-600" />
                </div>
                <span className="text-sm text-muted-foreground">
                  Accédez à tous vos documents médicaux instantanément
                </span>
              </div>
              <div className="flex items-center gap-3 text-center lg:text-left">
                <div className="w-8 h-8 bg-cyan-500/20 rounded-full flex items-center justify-center">
                  <Shield className="h-4 w-4 text-cyan-500" />
                </div>
                <span className="text-sm text-muted-foreground">
                  Partagez vos dossiers en toute sécurité via QR code
                </span>
              </div>
              <div className="flex items-center gap-3 text-center lg:text-left">
                <div className="w-8 h-8 bg-teal-500/20 rounded-full flex items-center justify-center">
                  <FileHeart className="h-4 w-4 text-teal-500" />
                </div>
                <span className="text-sm text-muted-foreground">
                  Centralisez analyses, radios, ordonnances et plus
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* SECTION DROITE - Formulaire de connexion */}
        <Card className="w-full max-w-md glass border-border shadow-2xl hover-lift mx-auto">
          <CardHeader className="text-center pb-6">
            <CardTitle className="text-foreground text-xl font-semibold">
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
                className="space-y-6"
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
                          className="w-fit text-sm text-muted-foreground hover:text-blue-600 transition-colors font-medium"
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
                  className="w-full bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 font-semibold text-base py-3 group"
                  disabled={isPending}
                >
                  {isPending ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                      Connexion en cours...
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <Lock className="h-4 w-4 group-hover:animate-pulse" />
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
                  className="text-blue-600 hover:text-blue-700 hover:underline transition-colors font-medium"
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