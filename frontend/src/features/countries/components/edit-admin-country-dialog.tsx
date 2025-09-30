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
import { useUpdateAdminCountry } from "../hooks/use-countries";
import { CountryDataType, CountryStatus } from "../types/country.type";

const updateCountryFormSchema = z.object({
  name: z.string().min(2, "Le nom doit contenir au moins 2 caractères"),
  en_name: z
    .string()
    .min(2, "Le nom anglais doit contenir au moins 2 caractères"),
  ar_name: z.string().min(1, "Le nom arabe est requis"),
  flag: z.string().url("L'URL du drapeau doit être valide"),
  isoA3: z
    .string()
    .length(3, "Le code ISO A3 doit contenir exactement 3 caractères"),
  isoNum: z.number().min(1, "Le numéro ISO doit être positif"),
  dialCode: z.string().min(1, "L'indicatif téléphonique est requis"),
  status: z.nativeEnum(CountryStatus, { message: "Le statut est requis" }),
});

const statusOptions = [
  { value: CountryStatus.ACTIVE, label: "Actif" },
  { value: CountryStatus.INACTIVE, label: "Inactif" },
];

export default function EditAdminCountryDialog({
  country,
  open,
  setOpen,
}: {
  country: CountryDataType;
  open: boolean;
  setOpen: (open: boolean) => void;
}) {
  const updateCountryForm = useForm<z.infer<typeof updateCountryFormSchema>>({
    resolver: zodResolver(updateCountryFormSchema),
    defaultValues: {
      name: country.name,
      en_name: country.en_name,
      ar_name: country.ar_name,
      flag: country.flag,
      isoA3: country.isoA3,
      isoNum: country.isoNum,
      dialCode: country.dialCode,
      status: country.status,
    },
    mode: "onChange",
  });

  const { mutateAsync: updateAdminCountry, isPending } =
    useUpdateAdminCountry();

  const onSubmit = async (data: z.infer<typeof updateCountryFormSchema>) => {
    const result = await updateAdminCountry({
      id: country.id,
      countryData: data,
    });

    if (result.status === "SUCCESS") {
      setOpen(false);
    }
  };

  useEffect(() => {
    updateCountryForm.reset({
      name: country.name,
      en_name: country.en_name,
      ar_name: country.ar_name,
      flag: country.flag,
      isoA3: country.isoA3,
      isoNum: country.isoNum,
      dialCode: country.dialCode,
      status: country.status,
    });
  }, [country, updateCountryForm]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-2xl p-0 overflow-hidden max-h-[90vh] overflow-y-auto">
        <DialogHeader className="p-4 bg-muted border-b">
          <DialogTitle>Modifier le pays</DialogTitle>
          <DialogDescription>
            Modifiez les informations de {country.name}.
          </DialogDescription>
        </DialogHeader>

        <Form {...updateCountryForm}>
          <form
            onSubmit={updateCountryForm.handleSubmit(onSubmit)}
            className="space-y-8"
          >
            <div className="p-4 flex flex-col gap-4">
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={updateCountryForm.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nom du pays *</FormLabel>
                      <FormControl>
                        <Input placeholder="Nom du pays" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={updateCountryForm.control}
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
                control={updateCountryForm.control}
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
                control={updateCountryForm.control}
                name="flag"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>URL du drapeau *</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="https://example.com/flag.png"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-3 gap-4">
                <FormField
                  control={updateCountryForm.control}
                  name="isoA3"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Code ISO A3 *</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="MAR"
                          {...field}
                          maxLength={3}
                          style={{ textTransform: "uppercase" }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={updateCountryForm.control}
                  name="isoNum"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Numéro ISO *</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="504"
                          {...field}
                          onChange={(e) =>
                            field.onChange(Number(e.target.value))
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={updateCountryForm.control}
                  name="dialCode"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Indicatif *</FormLabel>
                      <FormControl>
                        <Input placeholder="+212" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={updateCountryForm.control}
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
              <Button type="submit" disabled={isPending}>
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
