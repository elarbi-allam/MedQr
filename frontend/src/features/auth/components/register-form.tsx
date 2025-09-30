"use client";

import Link from "next/link";
import { Truck, Eye, EyeOff, ArrowRight, Sparkles, Zap } from "lucide-react";
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
import { useRegister } from "../hooks/use-auth";
import { registerSchema } from "../schemas/register-schema";

export default function RegisterForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const registerForm = useForm<z.infer<typeof registerSchema>>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phoneNumber: "",
      password: "",
      confirmPassword: "",
    },
    mode: "onChange",
  });

  const { mutate: register, isPending } = useRegister();

  const onSubmit = (data: z.infer<typeof registerSchema>) => {
    register(data);
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4 relative overflow-hidden pt-20">
      {/* Arrière-plan animé amélioré */}
      <BackgroundEffects intensity="medium" />

      {/* Layout en deux colonnes */}
      <div className="w-full max-w-6xl mx-auto grid lg:grid-cols-2 gap-12 items-center relative z-10">
        {/* Section d'en-tête motivante - Colonne de gauche */}
        <div className="text-center lg:text-left animate-fade-in-up">
          <div className="flex items-center justify-center lg:justify-start mb-8 animate-scale-in animate-delay-200">
            <div className="w-20 h-20 bg-gradient-to-br from-brand to-primary rounded-3xl flex items-center justify-center shadow-2xl mr-6 animate-glow-pulse">
              <Truck className="h-10 w-10 text-brand-foreground" />
            </div>
            <div>
              <h1 className="text-5xl font-bold bg-gradient-to-r from-brand via-primary to-accent bg-clip-text text-transparent animate-gradient">
                Transmarket
              </h1>
              <p className="text-lg text-muted-foreground mt-2">
                Plateforme de Transport Intelligente
              </p>
            </div>
          </div>

          <div className="space-y-6">
            <h2 className="text-4xl md:text-5xl font-bold text-foreground leading-tight animate-slide-in-left animate-delay-300">
              Commencez votre{" "}
              <span className="bg-gradient-to-r from-brand to-primary bg-clip-text text-transparent animate-gradient">
                expérience extraordinaire
              </span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-xl lg:max-w-none leading-relaxed animate-slide-in-right animate-delay-500">
              Rejoignez la première bourse de fret intelligente du Maroc et
              découvrez un monde de possibilités infinies
            </p>
            <div className="flex items-center justify-center lg:justify-start gap-3 text-base text-muted-foreground animate-fade-in-up animate-delay-700">
              <Sparkles className="h-5 w-5 text-brand animate-pulse" />
              <span>Connectez expéditeurs et transporteurs</span>
              <Sparkles className="h-5 w-5 text-primary animate-pulse" />
            </div>

            {/* Statistiques ou points clés */}
            <div className="grid grid-cols-2 gap-6 mt-8 animate-fade-in-up animate-delay-1000">
              <div className="text-center lg:text-left">
                <div className="text-3xl font-bold text-brand mb-1">1000+</div>
                <div className="text-sm text-muted-foreground">
                  Entreprises connectées
                </div>
              </div>
              <div className="text-center lg:text-left">
                <div className="text-3xl font-bold text-primary mb-1">40%</div>
                <div className="text-sm text-muted-foreground">
                  Trajets optimisés
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Formulaire - Colonne de droite */}
        <Card className="w-full max-w-md glass border-border shadow-2xl hover-lift mx-auto">
          <CardHeader className="text-center pb-6">
            <CardTitle className="text-foreground text-xl font-semibold">
              Créer votre compte
            </CardTitle>
            <CardDescription className="text-muted-foreground">
              Rejoignez notre plateforme en quelques secondes
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...registerForm}>
              <form
                onSubmit={registerForm.handleSubmit(onSubmit)}
                className="space-y-4"
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <FormField
                    control={registerForm.control}
                    name="firstName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-foreground font-medium">
                          Prénom
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="John"
                            {...field}
                            className="input-enhanced focus-ring"
                          />
                        </FormControl>
                        <FormMessage className="text-destructive" />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={registerForm.control}
                    name="lastName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-foreground font-medium">
                          Nom
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Doe"
                            {...field}
                            className="input-enhanced focus-ring"
                          />
                        </FormControl>
                        <FormMessage className="text-destructive" />
                      </FormItem>
                    )}
                  />
                </div>
                <FormField
                  control={registerForm.control}
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
                  control={registerForm.control}
                  name="phoneNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-foreground font-medium">
                        Téléphone
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="0612345678"
                          {...field}
                          className="input-enhanced focus-ring"
                        />
                      </FormControl>
                      <FormMessage className="text-destructive" />
                    </FormItem>
                  )}
                />
                <FormField
                  control={registerForm.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-foreground font-medium">
                        Mot de passe
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
                <FormField
                  control={registerForm.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-foreground font-medium">
                        Confirmer le mot de passe
                      </FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            type={showConfirmPassword ? "text" : "password"}
                            placeholder="••••••••"
                            {...field}
                            className="input-enhanced focus-ring pr-12"
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-accent/20 text-muted-foreground hover:text-foreground transition-colors"
                            onClick={() =>
                              setShowConfirmPassword(!showConfirmPassword)
                            }
                          >
                            {showConfirmPassword ? (
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
                      Création du compte...
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <Zap className="h-4 w-4 group-hover:animate-pulse" />
                      Commencer l&apos;aventure
                      <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </div>
                  )}
                </Button>
              </form>
            </Form>
            <div className="mt-6 text-center">
              <p className="text-sm text-muted-foreground">
                Vous avez déjà un compte ?{" "}
                <Link
                  href="/login"
                  className="text-brand hover:text-brand/80 hover:underline transition-colors font-medium"
                >
                  Se connecter
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
