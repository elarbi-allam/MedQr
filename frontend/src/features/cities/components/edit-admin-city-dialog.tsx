"use client";

import { useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
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
import { useUpdateAdminCity } from "../hooks/use-cities";
import { useCountriesForCities } from "@/features/countries/hooks/use-countries";
import { CityDataType, CityStatus } from "../types/city.type";

const updateCityFormSchema = z.object({
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

export default function EditAdminCityDialog({
  city,
  open,
  setOpen,
}: {
  city: CityDataType;
  open: boolean;
  setOpen: (open: boolean) => void;
}) {
  const { data: countriesResponse, isLoading: loadingCountries } =
    useCountriesForCities();
  const countries = countriesResponse?.data || [];

  const updateCityForm = useForm<z.infer<typeof updateCityFormSchema>>({
    resolver: zodResolver(updateCityFormSchema),
    defaultValues: {
      name: city.name,
      en_name: city.en_name,
      ar_name: city.ar_name,
      countryId: city.country.id,
      status: city.status,
    },
    mode: "onChange",
  });

  const { mutateAsync: updateAdminCity, isPending } = useUpdateAdminCity();

  const onSubmit = async (data: z.infer<typeof updateCityFormSchema>) => {
    const result = await updateAdminCity({
      id: city.id,
      cityData: data,
    });

    if (result.status === "SUCCESS") {
      setOpen(false);
    }
  };

  useEffect(() => {
    updateCityForm.reset({
      name: city.name,
      en_name: city.en_name,
      ar_name: city.ar_name,
      countryId: city.country.id,
      status: city.status,
    });
  }, [city, updateCityForm]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-2xl p-0 overflow-hidden max-h-[90vh] overflow-y-auto">
        <DialogHeader className="p-4 bg-muted border-b">
          <DialogTitle>Modifier la ville</DialogTitle>
          <DialogDescription>
            Modifiez les informations de {city.name}.
          </DialogDescription>
        </DialogHeader>

        <Form {...updateCityForm}>
          <form
            onSubmit={updateCityForm.handleSubmit(onSubmit)}
            className="space-y-8"
          >
            <div className="p-4 flex flex-col gap-4">
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={updateCityForm.control}
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
                  control={updateCityForm.control}
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
                control={updateCityForm.control}
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
                control={updateCityForm.control}
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
                control={updateCityForm.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Statut *</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue />
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
                onClick={() => setOpen(false)}
              >
                Annuler
              </Button>
              <Button type="submit" disabled={isPending || loadingCountries}>
                {isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span className="ml-2">Modification...</span>
                  </>
                ) : (
                  "Modifier"
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
