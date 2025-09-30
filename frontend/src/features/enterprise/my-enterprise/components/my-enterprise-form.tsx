"use client";

import { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Building, Loader2, Save, AlertCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Import des nouveaux composants de localisation
import { CountryCombobox } from "@/components/ui/country-combobox";
import { CityCombobox } from "@/components/ui/city-combobox";

// Import des hooks
import {
  useMyEnterprise,
  useCreateMyEnterprise,
  useUpdateMyEnterprise,
} from "../hooks/use-my-enterprise";

// Import des types
import {
  EnterpriseType,
  EnterpriseStatus,
} from "@/features/admin/enterprises/types/enterprise.type";

// Schéma de validation
const enterpriseFormSchema = z.object({
  name: z.string().min(2, "Le nom doit contenir au moins 2 caractères"),
  description: z
    .string()
    .min(10, "La description doit contenir au moins 10 caractères"),
  ice: z.string().min(1, "L'ICE est requis"),
  rc: z.string().min(1, "Le RC est requis"),
  cityId: z.string().min(1, "La ville est requise"),
  enterpriseType: z.nativeEnum(EnterpriseType, {
    message: "Le type d'entreprise est requis",
  }),
});

// Options pour le type d'entreprise
const enterpriseTypeOptions = [
  { value: EnterpriseType.CARRIER, label: "Transporteur" },
  { value: EnterpriseType.SHIPPER, label: "Expéditeur" },
];

// Fonction utilitaire pour obtenir les informations de statut
const getStatusInfo = (status: EnterpriseStatus) => {
  switch (status) {
    case EnterpriseStatus.ACTIVE:
      return {
        label: "Active",
        color:
          "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
        description:
          "Votre entreprise est active et peut utiliser toutes les fonctionnalités.",
      };
    case EnterpriseStatus.PENDING_VERIFICATION:
      return {
        label: "En attente de vérification",
        color:
          "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
        description:
          "Votre entreprise est en attente de vérification par nos équipes.",
      };
    case EnterpriseStatus.INCOMPLETE:
      return {
        label: "Incomplète",
        color: "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300",
        description: "Veuillez compléter toutes les informations requises.",
      };
    case EnterpriseStatus.INACTIVE:
      return {
        label: "Inactive",
        color: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
        description:
          "Votre entreprise est inactive et ne peut pas utiliser les fonctionnalités.",
      };
    case EnterpriseStatus.REJECTED:
      return {
        label: "Rejetée",
        color: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
        description:
          "Votre demande a été rejetée. Contactez le support pour plus d'informations.",
      };
    case EnterpriseStatus.SUSPENDED:
      return {
        label: "Suspendue",
        color:
          "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300",
        description: "Votre entreprise a été temporairement suspendue.",
      };
    default:
      return {
        label: "Inconnu",
        color: "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300",
        description: "Statut inconnu.",
      };
  }
};

export default function MyEnterpriseForm() {
  // Hooks pour la gestion des données
  const { data: myEnterprise, isLoading, error } = useMyEnterprise();
  const { mutateAsync: createMyEnterprise, isPending: isCreating } =
    useCreateMyEnterprise();
  const { mutateAsync: updateMyEnterprise, isPending: isUpdating } =
    useUpdateMyEnterprise();

  // État pour la gestion de la sélection de pays
  const [selectedCountryId, setSelectedCountryId] = useState<string>("");

  // Détermination si c'est une nouvelle entreprise
  const isNewEnterprise =
    !myEnterprise?.data &&
    (error?.response?.status === 404 || myEnterprise?.status === "ERROR");

  const enterprise = myEnterprise?.data;

  // Configuration du formulaire
  const enterpriseForm = useForm<z.infer<typeof enterpriseFormSchema>>({
    resolver: zodResolver(enterpriseFormSchema),
    defaultValues: {
      name: "",
      description: "",
      ice: "",
      rc: "",
      cityId: "",
      enterpriseType: EnterpriseType.CARRIER,
    },
    mode: "onChange",
  });

  // Effet pour pré-remplir le formulaire avec les données existantes
  useEffect(() => {
    if (enterprise && enterprise.city && enterprise.city.country) {
      // D'abord définir le pays pour que les villes se chargent
      setSelectedCountryId(enterprise.city.country.id);

      // Ensuite réinitialiser le formulaire avec toutes les données
      enterpriseForm.reset({
        name: enterprise.name,
        description: enterprise.description,
        ice: enterprise.ice,
        rc: enterprise.rc,
        cityId: enterprise.city.id,
        enterpriseType: enterprise.enterpriseType,
      });
    }
  }, [enterprise, enterpriseForm]);

  // Effet supplémentaire pour s'assurer que le selectedCountryId est bien défini
  useEffect(() => {
    if (enterprise?.city?.country?.id && !selectedCountryId) {
      setSelectedCountryId(enterprise.city.country.id);
    }
  }, [enterprise?.city?.country?.id, selectedCountryId]);

  // Gestionnaire de soumission du formulaire
  const onSubmit = async (data: z.infer<typeof enterpriseFormSchema>) => {
    if (isNewEnterprise) {
      await createMyEnterprise(data);
    } else {
      await updateMyEnterprise(data);
    }
  };

  // Gestionnaire de changement de pays
  const handleCountryChange = (countryId: string) => {
    setSelectedCountryId(countryId);
    // Réinitialiser la ville sélectionnée quand le pays change
    enterpriseForm.setValue("cityId", "");
  };

  // État de chargement
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  // Gestion des erreurs (autres que 404)
  if (error && error?.response?.status !== 404) {
    return (
      <div className="max-w-4xl mx-auto space-y-8">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Une erreur est survenue lors du chargement des données de votre
            entreprise.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  // Obtenir les informations de statut
  const statusInfo = enterprise ? getStatusInfo(enterprise.status) : null;

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* En-tête */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
            <Building className="h-8 w-8" />
            {isNewEnterprise ? "Créer mon entreprise" : "Mon entreprise"}
          </h1>
          <p className="text-muted-foreground">
            {isNewEnterprise
              ? "Configurez les informations de votre entreprise pour commencer."
              : "Gérez les informations de votre entreprise."}
          </p>
        </div>

        {statusInfo && (
          <Badge className={statusInfo.color}>{statusInfo.label}</Badge>
        )}
      </div>

      {/* Alerte de statut */}
      {statusInfo && (
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{statusInfo.description}</AlertDescription>
        </Alert>
      )}

      {/* Formulaire principal */}
      <Card>
        <CardHeader>
          <CardTitle>
            {isNewEnterprise
              ? "Informations de l'entreprise"
              : "Modifier les informations"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...enterpriseForm}>
            <form
              onSubmit={enterpriseForm.handleSubmit(onSubmit)}
              className="space-y-6"
            >
              {/* Nom de l'entreprise */}
              <FormField
                control={enterpriseForm.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nom de l&apos;entreprise *</FormLabel>
                    <FormControl>
                      <Input placeholder="Nom de l'entreprise" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Description */}
              <FormField
                control={enterpriseForm.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description *</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Description de l'entreprise"
                        {...field}
                        rows={4}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* ICE et RC */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={enterpriseForm.control}
                  name="ice"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>ICE *</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Identifiant Commun de l'Entreprise"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={enterpriseForm.control}
                  name="rc"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>RC *</FormLabel>
                      <FormControl>
                        <Input placeholder="Registre de Commerce" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Localisation : Pays et Ville */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Sélection du pays */}
                <div className="space-y-2">
                  <FormLabel>Pays *</FormLabel>
                  <CountryCombobox
                    value={selectedCountryId}
                    onValueChange={handleCountryChange}
                    placeholder="Sélectionner un pays"
                  />
                </div>

                {/* Sélection de la ville */}
                <FormField
                  control={enterpriseForm.control}
                  name="cityId"
                  render={({ field, fieldState }) => (
                    <FormItem>
                      <FormLabel>Ville *</FormLabel>
                      <FormControl>
                        <CityCombobox
                          value={field.value}
                          onValueChange={field.onChange}
                          countryId={selectedCountryId}
                          placeholder="Sélectionner une ville"
                          error={fieldState.error?.message}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Type d'entreprise */}
              <FormField
                control={enterpriseForm.control}
                name="enterpriseType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Type d&apos;entreprise *</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionner un type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {enterpriseTypeOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Bouton de soumission */}
              <div className="flex justify-end">
                <Button
                  type="submit"
                  disabled={isCreating || isUpdating}
                  className="flex items-center gap-2"
                >
                  {isCreating || isUpdating ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Save className="h-4 w-4" />
                  )}
                  {isNewEnterprise
                    ? isCreating
                      ? "Création..."
                      : "Créer l'entreprise"
                    : isUpdating
                      ? "Mise à jour..."
                      : "Mettre à jour"}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
