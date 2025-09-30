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
import { Textarea } from "@/components/ui/textarea";
import { useCreateTruckType } from "../hooks/use-admin-truck-type";
import { TruckTypeStatus } from "../types/truck-type.type";

const addTruckTypeFormSchema = z.object({
  name: z.string().min(2, "Le nom doit contenir au moins 2 caractères"),
  description: z
    .string()
    .min(10, "La description doit contenir au moins 10 caractères"),
  slug: z.string().min(2, "Le slug est requis"),
  icon: z.string().optional(),
  status: z.nativeEnum(TruckTypeStatus, { message: "Le statut est requis" }),
});

const statusOptions = [
  { value: TruckTypeStatus.ACTIVE, label: "Actif" },
  { value: TruckTypeStatus.INACTIVE, label: "Inactif" },
  { value: TruckTypeStatus.ARCHIVE, label: "Archivé" },
];

export default function AddAdminTruckType() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const addTruckTypeForm = useForm<z.infer<typeof addTruckTypeFormSchema>>({
    resolver: zodResolver(addTruckTypeFormSchema),
    defaultValues: {
      name: "",
      description: "",
      slug: "",
      icon: "",
      status: TruckTypeStatus.ACTIVE,
    },
    mode: "onChange",
  });

  const { mutateAsync: createTruckType, isPending } = useCreateTruckType();

  async function onSubmit(values: z.infer<typeof addTruckTypeFormSchema>) {
    const result = await createTruckType(values);
    if (result.status === "SUCCESS") {
      setIsDialogOpen(false);
      addTruckTypeForm.reset();
    }
  }

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button
          className="flex items-center gap-2 has-[>svg]:px-4 h-auto bg-gradient-to-r from-brand to-primary"
          onClick={() => {
            addTruckTypeForm.reset();
          }}
        >
          <PlusIcon className="size-4" />
          Nouveau Type de Camion
        </Button>
      </DialogTrigger>
      <DialogContent className="p-0 overflow-hidden sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader className="p-4 bg-muted border-b">
          <DialogTitle>Créer un nouveau type de camion</DialogTitle>
          <DialogDescription>
            Ajoutez un nouveau type de camion à la plateforme.
          </DialogDescription>
        </DialogHeader>

        <Form {...addTruckTypeForm}>
          <form
            onSubmit={addTruckTypeForm.handleSubmit(onSubmit)}
            className="space-y-8"
          >
            <div className="p-4 flex flex-col gap-4">
              <FormField
                control={addTruckTypeForm.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nom du type *</FormLabel>
                    <FormControl>
                      <Input placeholder="Nom du type de camion" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={addTruckTypeForm.control}
                name="slug"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Slug *</FormLabel>
                    <FormControl>
                      <Input placeholder="slug-du-type" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={addTruckTypeForm.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description *</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Description du type de camion"
                        {...field}
                        rows={3}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={addTruckTypeForm.control}
                name="icon"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Icône</FormLabel>
                    <FormControl>
                      <Input placeholder="URL de l'icône" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={addTruckTypeForm.control}
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
