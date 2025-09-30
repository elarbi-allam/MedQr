"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { PlusIcon, Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
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
import { useCreateCity } from "../hooks/use-cities";
import { useCountriesForCities } from "@/features/countries/hooks/use-countries";
import { CityStatus } from "../types/city.type";

const addCityFormSchema = z.object({
  name: z.string().min(2, "Le nom doit contenir au moins 2 caractères"),
  en_name: z
    .string()
    .min(2, "Le nom anglais doit contenir au moins 2 caractères"),
  ar_name: z.string().min(1, "Le nom arabe est requis"),
  countryId: z.string().min(1, "Le pays est requis"),
  status: z.nativeEnum(CityStatus, { message: "Le statut est requis" }),
});

const statusOptions = [
  { value: CityStatus.ACTIVE, label: "Actif" },
  { value: CityStatus.INACTIVE, label: "Inactif" },
];

export default function AddAdminCity() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const { data: countriesResponse, isLoading: loadingCountries } =
    useCountriesForCities();
  const countries = countriesResponse?.data || [];

  const addCityForm = useForm<z.infer<typeof addCityFormSchema>>({
    resolver: zodResolver(addCityFormSchema),
    defaultValues: {
      name: "",
      en_name: "",
      ar_name: "",
      countryId: "",
      status: CityStatus.ACTIVE,
    },
    mode: "onChange",
  });

  const { mutateAsync: createCity, isPending } = useCreateCity();

  async function onSubmit(values: z.infer<typeof addCityFormSchema>) {
    const result = await createCity(values);
    if (result.status === "SUCCESS") {
      setIsDialogOpen(false);
      addCityForm.reset();
    }
  }

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button
          className="flex items-center gap-2 has-[>svg]:px-4 h-auto bg-gradient-to-r from-brand to-primary"
          onClick={() => {
            addCityForm.reset();
          }}
        >
          <PlusIcon className="size-4" />
          Nouvelle Ville
        </Button>
      </DialogTrigger>
      <DialogContent className="p-0 overflow-hidden sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader className="p-4 bg-muted border-b">
          <DialogTitle>Créer une nouvelle ville</DialogTitle>
          <DialogDescription>
            Ajoutez une nouvelle ville à la plateforme.
          </DialogDescription>
        </DialogHeader>

        <Form {...addCityForm}>
          <form
            onSubmit={addCityForm.handleSubmit(onSubmit)}
            className="space-y-8"
          >
            <div className="p-4 flex flex-col gap-4">
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={addCityForm.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nom de la ville *</FormLabel>
                      <FormControl>
                        <Input placeholder="Nom de la ville" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={addCityForm.control}
                  name="en_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nom anglais *</FormLabel>
                      <FormControl>
                        <Input placeholder="Nom anglais" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={addCityForm.control}
                name="ar_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nom arabe *</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="الاسم بالعربية"
                        {...field}
                        dir="rtl"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={addCityForm.control}
                name="countryId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Pays *</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue
                            placeholder={
                              loadingCountries
                                ? "Chargement..."
                                : "Sélectionner un pays"
                            }
                          />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {loadingCountries ? (
                          <SelectItem value="" disabled>
                            <div className="flex items-center gap-2">
                              <Loader2 className="h-4 w-4 animate-spin" />
                              Chargement...
                            </div>
                          </SelectItem>
                        ) : (
                          countries.map((country) => (
                            <SelectItem key={country.id} value={country.id}>
                              {country.name} ({country.en_name})
                            </SelectItem>
                          ))
                        )}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={addCityForm.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Statut *</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionner un statut" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {statusOptions.map((option) => (
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
            </div>

            <DialogFooter className="p-4 bg-muted flex justify-end border-t">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsDialogOpen(false)}
              >
                Annuler
              </Button>
              <Button type="submit" disabled={isPending || loadingCountries}>
                {isPending ? "Création..." : "Créer"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
