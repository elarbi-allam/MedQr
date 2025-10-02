"use client";

import Link from "next/link";
import { 
  FileHeart, 
  Eye, 
  EyeOff, 
  ArrowRight, 
  Sparkles, 
  Shield, 
  Hospital, 
  Stethoscope, 
  User,
  Mail,
  Phone,
  CalendarDays 
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { BackgroundEffects } from "@/components/ui/background-effects";
// import { useRegister } from "../hooks/use-auth";
import { registerSchema } from "../schemas/register-schema";

export default function RegisterForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

const [isPending, setIsPending] = useState(false);

  const registerForm = useForm<z.infer<typeof registerSchema>>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phoneNumber: "",
      dateOfBirth: "",
      address: "",
      userType: "PATIENT",
      specialty: "",
      licenseNumber: "",
      facilityName: "",
      facilityType: "",
      password: "",
      confirmPassword: "",
    },
    mode: "onChange",
  });

  // const { mutate: register, isPending } = useRegister();
  
  // Surveiller le type d'utilisateur sélectionné pour afficher les champs conditionnels
  const selectedUserType = registerForm.watch("userType");

  // const onSubmit = (data: z.infer<typeof registerSchema>) => {
  //   register(data);
  // };



const onSubmit = (data: z.infer<typeof registerSchema>) => {
  setIsPending(true);
  console.log("Register data:", data);
  
  // Simulation d'un appel API
  setTimeout(() => {
    setIsPending(false);
    alert(`Inscription réussie!\nNom: ${data.firstName} ${data.lastName}\nEmail: ${data.email}\nType: ${data.userType}`);
  }, 1500);
};
return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4 relative overflow-hidden py-20">
      {/* Layout en deux colonnes */}
      <div className="w-full max-w-6xl mx-auto grid lg:grid-cols-2 gap-12 items-center relative z-10">
        
        {/* SECTION GAUCHE - Informations et branding */}
        <div className="text-center lg:text-left animate-fade-in-up">
          {/* Logo et nom de l'application */}
          <div className="flex items-center justify-center lg:justify-start mb-8 animate-scale-in animate-delay-200">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-3xl flex items-center justify-center shadow-2xl mr-6 animate-glow-pulse">
              <FileHeart className="h-10 w-10 text-white" />
            </div>
            <div>
              <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 via-cyan-500 to-teal-500 bg-clip-text text-transparent animate-gradient">
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
              Centralisez votre{" "}
              <span className="bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent animate-gradient">
                santé en un seul endroit
              </span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-xl lg:max-w-none leading-relaxed animate-slide-in-right animate-delay-500">
              Rejoignez la plateforme qui révolutionne la gestion des dossiers médicaux au Maroc
            </p>
            <div className="flex items-center justify-center lg:justify-start gap-3 text-base text-muted-foreground animate-fade-in-up animate-delay-700">
              <Shield className="h-5 w-5 text-blue-600 animate-pulse" />
              <span>Sécurisé • Accessible • Partageable</span>
              <Sparkles className="h-5 w-5 text-cyan-500 animate-pulse" />
            </div>

            {/* Statistiques */}
            <div className="grid grid-cols-2 gap-6 mt-8 animate-fade-in-up animate-delay-1000">
              <div className="text-center lg:text-left">
                <div className="text-3xl font-bold text-blue-600 mb-1">100%</div>
                <div className="text-sm text-muted-foreground">
                  Sécurisé et confidentiel
                </div>
              </div>
              <div className="text-center lg:text-left">
                <div className="text-3xl font-bold text-cyan-500 mb-1">24/7</div>
                <div className="text-sm text-muted-foreground">
                  Accès à vos documents
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* SECTION DROITE - Formulaire d'inscription */}
        {/* MODIFICATION: Augmentation de la largeur maximale pour le formulaire à 'max-w-xl' (576px - plus large que 'max-w-md' qui est 448px) */}
        <Card className="w-full max-w-xl glass border-border shadow-2xl hover-lift mx-auto animate-fade-in animate-delay-1200">
          <CardHeader className="text-center pb-6">
            <CardTitle className="text-foreground text-2xl font-semibold">
              Créer votre compte
            </CardTitle>
            <CardDescription className="text-muted-foreground">
              Rejoignez MedQR en quelques étapes
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...registerForm}>
              <form
                onSubmit={registerForm.handleSubmit(onSubmit)}
                className="space-y-4"
              >
                {/* 1. Sélection du type de compte (Plein largeur) */}
                <FormField
                  control={registerForm.control}
                  name="userType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-foreground font-medium flex items-center gap-2">
                         <User className="h-4 w-4 text-blue-500" /> Type de compte
                      </FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className="input-enhanced focus-ring">
                            <SelectValue placeholder="Sélectionnez votre type de compte" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="PATIENT">
                            <div className="flex items-center gap-2">
                              <User className="h-4 w-4" />
                              Patient
                            </div>
                          </SelectItem>
                          <SelectItem value="PROVIDER">
                            <div className="flex items-center gap-2">
                              <Stethoscope className="h-4 w-4" />
                              Professionnel de santé
                            </div>
                          </SelectItem>
                          <SelectItem value="FACILITY">
                            <div className="flex items-center gap-2">
                              <Hospital className="h-4 w-4" />
                              Établissement médical
                            </div>
                          </SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage className="text-destructive" />
                    </FormItem>
                  )}
                />

                {/* 2. Prénom et Nom (Réduction de la longueur: Combinés sur une seule ligne) */}
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
                            placeholder="Mohammed"
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
                            placeholder="Alami"
                            {...field}
                            className="input-enhanced focus-ring"
                          />
                        </FormControl>
                        <FormMessage className="text-destructive" />
                      </FormItem>
                    )}
                  />
                </div>
                
                {/* 3. Email (Plein largeur) */}
                <FormField
                  control={registerForm.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-foreground font-medium flex items-center gap-2">
                          <Mail className="h-4 w-4 text-blue-500" /> Email
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

                {/* 4. Téléphone et Date de naissance (Réduction de la longueur: Combinés sur une seule ligne) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <FormField
                    control={registerForm.control}
                    name="phoneNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-foreground font-medium flex items-center gap-2">
                          <Phone className="h-4 w-4 text-blue-500" /> Téléphone
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
                    name="dateOfBirth"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-foreground font-medium flex items-center gap-2">
                          <CalendarDays className="h-4 w-4 text-blue-500" /> Date de naissance
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="date"
                            {...field}
                            className="input-enhanced focus-ring"
                          />
                        </FormControl>
                        <FormMessage className="text-destructive" />
                      </FormItem>
                    )}
                  />
                </div>

                {/* 5. Adresse (Plein largeur) */}
                <FormField
                  control={registerForm.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-foreground font-medium">
                        Adresse (optionnel)
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="123 Rue Mohammed V, Casablanca"
                          {...field}
                          className="input-enhanced focus-ring"
                        />
                      </FormControl>
                      <FormMessage className="text-destructive" />
                    </FormItem>
                  )}
                />

                {/* CHAMPS CONDITIONNELS POUR PROVIDER (Professionnel de santé) */}
                {selectedUserType === "PROVIDER" && (
                  <>
                    <FormField
                      control={registerForm.control}
                      name="specialty"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-foreground font-medium">
                            Spécialité médicale
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Ex: Cardiologie, Pédiatrie, Médecine générale..."
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
                      name="licenseNumber"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-foreground font-medium">
                            Numéro de licence / N° d&apos;ordre
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Votre numéro d'inscription à l'ordre"
                              {...field}
                              className="input-enhanced focus-ring"
                            />
                          </FormControl>
                          <FormMessage className="text-destructive" />
                        </FormItem>
                      )}
                    />
                  </>
                )}

                {/* CHAMPS CONDITIONNELS POUR FACILITY (Établissement médical) */}
                {selectedUserType === "FACILITY" && (
                  <>
                    {/* Nom et Type d'établissement (Réduction de la longueur: Combinés sur une seule ligne) */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <FormField
                            control={registerForm.control}
                            name="facilityName"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-foreground font-medium">
                                  Nom de l&apos;établissement
                                </FormLabel>
                                <FormControl>
                                  <Input
                                    placeholder="Ex: Clinique Al Amal"
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
                            name="facilityType"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-foreground font-medium">
                                  Type d&apos;établissement
                                </FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                  <FormControl>
                                    <SelectTrigger className="input-enhanced focus-ring">
                                      <SelectValue placeholder="Sélectionnez le type" />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    <SelectItem value="Hospital">Hôpital</SelectItem>
                                    <SelectItem value="Lab">Laboratoire d&apos;analyses</SelectItem>
                                    <SelectItem value="RadiologyCenter">Centre de radiologie</SelectItem>
                                    <SelectItem value="Clinic">Clinique privée</SelectItem>
                                  </SelectContent>
                                </Select>
                                <FormMessage className="text-destructive" />
                              </FormItem>
                            )}
                        />
                    </div>
                  </>
                )}

                {/* 6. Mot de passe (Plein largeur) */}
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

                {/* 7. Confirmation du mot de passe (Plein largeur) */}
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

                {/* Bouton de soumission */}
                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 font-semibold text-base py-3 group"
                  disabled={isPending}
                >
                  {isPending ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                      Création du compte...
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <Shield className="h-4 w-4 group-hover:animate-pulse" />
                      Créer mon compte
                      <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </div>
                  )}
                </Button>
              </form>
            </Form>

            {/* Lien vers la connexion */}
            <div className="mt-6 text-center">
              <p className="text-sm text-muted-foreground">
                Vous avez déjà un compte ?{" "}
                <Link
                  href="/login"
                  className="text-blue-600 hover:text-blue-700 hover:underline transition-colors font-medium"
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
