"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { PlusIcon } from "lucide-react";
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
import { useCreateCountry } from "../hooks/use-countries";
import { CountryStatus } from "../types/country.type";

const addCountryFormSchema = z.object({
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

export default function AddAdminCountry() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const addCountryForm = useForm<z.infer<typeof addCountryFormSchema>>({
    resolver: zodResolver(addCountryFormSchema),
    defaultValues: {
      name: "",
      en_name: "",
      ar_name: "",
      flag: "",
      isoA3: "",
      isoNum: 0,
      dialCode: "",
      status: CountryStatus.ACTIVE,
    },
    mode: "onChange",
  });

  const { mutateAsync: createCountry, isPending } = useCreateCountry();

  async function onSubmit(values: z.infer<typeof addCountryFormSchema>) {
    const result = await createCountry(values);
    if (result.status === "SUCCESS") {
      setIsDialogOpen(false);
      addCountryForm.reset();
    }
  }

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button
          className="flex items-center gap-2 has-[>svg]:px-4 h-auto bg-gradient-to-r from-brand to-primary"
          onClick={() => {
            addCountryForm.reset();
          }}
        >
          <PlusIcon className="size-4" />
          Nouveau Pays
        </Button>
      </DialogTrigger>
      <DialogContent className="p-0 overflow-hidden sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader className="p-4 bg-muted border-b">
          <DialogTitle>Créer un nouveau pays</DialogTitle>
          <DialogDescription>
            Ajoutez un nouveau pays à la plateforme.
          </DialogDescription>
        </DialogHeader>

        <Form {...addCountryForm}>
          <form
            onSubmit={addCountryForm.handleSubmit(onSubmit)}
            className="space-y-8"
          >
            <div className="p-4 flex flex-col gap-4">
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={addCountryForm.control}
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
                  control={addCountryForm.control}
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
                control={addCountryForm.control}
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
                control={addCountryForm.control}
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
                  control={addCountryForm.control}
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
                  control={addCountryForm.control}
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
                  control={addCountryForm.control}
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
                control={addCountryForm.control}
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
              <Button type="submit" disabled={isPending}>
                {isPending ? "Création..." : "Créer"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
