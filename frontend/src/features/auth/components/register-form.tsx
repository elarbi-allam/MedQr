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
    CalendarDays,
    MapPin,
    Building2,
} from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useRegister } from "../hooks/use-auth";
import { registerSchema, registerServerSchema } from "../schemas/register-schema";

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

    const { mutate: register, isPending } = useRegister();

    const selectedUserType = registerForm.watch("userType");

const onSubmit = (data: z.infer<typeof registerSchema>) => {
    register(data as z.infer<typeof registerServerSchema>);
};

    return (
        <div className="min-h-screen bg-background flex items-center justify-center p-4 relative overflow-hidden py-20">
            <div className="w-full max-w-6xl mx-auto grid lg:grid-cols-2 gap-12 items-center relative z-10">
                {/* SECTION GAUCHE */}
                <div className="text-center lg:text-left animate-fade-in-up">
                    <div className="flex items-center justify-center lg:justify-start mb-8 animate-scale-in animate-delay-200">
                        <div className="w-20 h-20 bg-primary rounded-3xl flex items-center justify-center shadow-2xl mr-6">
                            <FileHeart className="h-10 w-10 text-white" />
                        </div>
                        <div>
                            <h1 className="text-5xl font-bold text-primary">MedQR</h1>
                            <p className="text-lg text-muted-foreground mt-2">Votre Dossier Médical Numérique</p>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <h2 className="text-4xl md:text-5xl font-bold text-foreground leading-tight animate-slide-in-left animate-delay-300">
                            Centralisez votre <span className="text-primary">santé en un seul endroit</span>
                        </h2>
                        <p className="text-xl text-muted-foreground max-w-xl lg:max-w-none leading-relaxed animate-slide-in-right animate-delay-500">
                            Rejoignez la plateforme qui révolutionne la gestion des dossiers médicaux au Maroc
                        </p>
                        <div className="flex items-center justify-center lg:justify-start gap-3 text-base text-muted-foreground animate-fade-in-up animate-delay-700">
                            <Shield className="h-5 w-5 text-primary" />
                            <span>Sécurisé • Accessible • Partageable</span>
                            <Sparkles className="h-5 w-5 text-primary" />
                        </div>

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

                {/* SECTION DROITE - Formulaire */}
                <Card className="w-full max-w-xl glass border-border shadow-2xl mx-auto animate-fade-in animate-delay-1200">
                    <CardHeader className="text-center pb-6">
                        <CardTitle className="text-foreground text-2xl font-semibold">Créer votre compte</CardTitle>
                        <CardDescription className="text-muted-foreground">
                            Rejoignez MedQR en quelques étapes
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Form {...registerForm}>
                            <form onSubmit={registerForm.handleSubmit(onSubmit)} className="space-y-4">
                                {/* Type de compte */}
                                <FormField
                                    control={registerForm.control}
                                    name="userType"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-foreground font-medium flex items-center gap-2">
                                                <User className="h-4 w-4 text-primary" /> Type de compte
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

                                {/* Champs conditionnels pour FACILITY */}
                                {selectedUserType === "FACILITY" ? (
                                    <>
                                        {/* Nom de l'établissement */}
                                        <FormField
                                            control={registerForm.control}
                                            name="facilityName"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel className="text-foreground font-medium flex items-center gap-2">
                                                        <Building2 className="h-4 w-4 text-primary" /> Nom de
                                                        l&apos;établissement
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

                                        {/* Type d'établissement */}
                                        <FormField
                                            control={registerForm.control}
                                            name="facilityType"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel className="text-foreground font-medium flex items-center gap-2">
                                                        <Hospital className="h-4 w-4 text-primary" /> Type
                                                        d&apos;établissement
                                                    </FormLabel>
                                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                        <FormControl>
                                                            <SelectTrigger className="input-enhanced focus-ring">
                                                                <SelectValue placeholder="Sélectionnez le type" />
                                                            </SelectTrigger>
                                                        </FormControl>
                                                        <SelectContent>
                                                            <SelectItem value="Hospital">Hôpital</SelectItem>
                                                            <SelectItem value="Labo">
                                                                Laboratoire d&apos;analyses
                                                            </SelectItem>
                                                            <SelectItem value="RadiologyCenter">
                                                                Centre de radiologie
                                                            </SelectItem>
                                                            <SelectItem value="Clinic">Clinique privée</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                    <FormMessage className="text-destructive" />
                                                </FormItem>
                                            )}
                                        />
                                    </>
                                ) : (
                                    <>
                                        {/* Prénom et Nom pour PATIENT et PROVIDER */}
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
                                    </>
                                )}

                                {/* Email */}
                                <FormField
                                    control={registerForm.control}
                                    name="email"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-foreground font-medium flex items-center gap-2">
                                                <Mail className="h-4 w-4 text-primary" /> Email
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

                                {/* Téléphone et Date de naissance (pour PATIENT) ou juste Téléphone */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <FormField
                                        control={registerForm.control}
                                        name="phoneNumber"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="text-foreground font-medium flex items-center gap-2">
                                                    <Phone className="h-4 w-4 text-primary" /> Téléphone
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

                                    {selectedUserType === "PATIENT" && (
                                        <FormField
                                            control={registerForm.control}
                                            name="dateOfBirth"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel className="text-foreground font-medium flex items-center gap-2">
                                                        <CalendarDays className="h-4 w-4 text-primary" /> Date de
                                                        naissance
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
                                    )}
                                </div>

                                {/* Adresse (pour PATIENT et FACILITY) */}
                                {(selectedUserType === "PATIENT" || selectedUserType === "FACILITY") && (
                                    <FormField
                                        control={registerForm.control}
                                        name="address"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="text-foreground font-medium flex items-center gap-2">
                                                    <MapPin className="h-4 w-4 text-primary" /> Adresse{" "}
                                                    {selectedUserType === "PATIENT" ? "(optionnel)" : ""}
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
                                )}

                                {/* Champs conditionnels pour PROVIDER */}
                                {selectedUserType === "PROVIDER" && (
                                    <>
                                        <FormField
                                            control={registerForm.control}
                                            name="specialty"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel className="text-foreground font-medium flex items-center gap-2">
                                                        <Stethoscope className="h-4 w-4 text-primary" /> Spécialité
                                                        médicale
                                                    </FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            placeholder="Ex: Cardiologie, Pédiatrie..."
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
                                                    <FormLabel className="text-foreground font-medium flex items-center gap-2">
                                                        <Shield className="h-4 w-4 text-primary" /> Numéro de licence
                                                    </FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            placeholder="Votre numéro d'inscription"
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

                                {/* Mot de passe */}
                                <FormField
                                    control={registerForm.control}
                                    name="password"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-foreground font-medium">Mot de passe</FormLabel>
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

                                {/* Confirmation du mot de passe */}
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
                                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
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
                                    className="w-full bg-primary hover:bg-muted-foreground text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 font-semibold text-base py-3 group"
                                    disabled={isPending}
                                >
                                    {isPending ? (
                                        <div className="flex items-center gap-2">
                                            <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                                            Création du compte...
                                        </div>
                                    ) : (
                                        <div className="flex items-center gap-2">
                                            <Shield className="h-4 w-4" />
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
                                    className="text-primary hover:text-muted-foreground hover:underline transition-colors font-medium"
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
