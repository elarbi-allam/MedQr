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
import { Textarea } from "@/components/ui/textarea";
import { useUpdateAdminTruckType } from "../hooks/use-admin-truck-type";
import { TruckTypeDataType, TruckTypeStatus } from "../types/truck-type.type";

const updateTruckTypeFormSchema = z.object({
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

export default function EditAdminTruckTypeDialog({
  truckType,
  open,
  setOpen,
}: {
  truckType: TruckTypeDataType;
  open: boolean;
  setOpen: (open: boolean) => void;
}) {
  const updateTruckTypeForm = useForm<
    z.infer<typeof updateTruckTypeFormSchema>
  >({
    resolver: zodResolver(updateTruckTypeFormSchema),
    defaultValues: {
      name: truckType.name,
      description: truckType.description,
      slug: truckType.slug,
      icon: truckType.icon || "",
      status: truckType.status,
    },
    mode: "onChange",
  });

  const { mutateAsync: updateAdminTruckType, isPending } =
    useUpdateAdminTruckType();

  const onSubmit = async (data: z.infer<typeof updateTruckTypeFormSchema>) => {
    const result = await updateAdminTruckType({
      id: truckType.id,
      truckTypeData: data,
    });

    if (result.status === "SUCCESS") {
      setOpen(false);
    }
  };

  useEffect(() => {
    updateTruckTypeForm.reset({
      name: truckType.name,
      description: truckType.description,
      slug: truckType.slug,
      icon: truckType.icon || "",
      status: truckType.status,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [truckType]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-2xl p-0 overflow-hidden max-h-[90vh] overflow-y-auto">
        <DialogHeader className="p-4 bg-muted border-b">
          <DialogTitle>Modifier le type de camion</DialogTitle>
          <DialogDescription>
            Modifiez les informations de {truckType.name}.
          </DialogDescription>
        </DialogHeader>

        <Form {...updateTruckTypeForm}>
          <form
            onSubmit={updateTruckTypeForm.handleSubmit(onSubmit)}
            className="space-y-8"
          >
            <div className="p-4 flex flex-col gap-4">
              <FormField
                control={updateTruckTypeForm.control}
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
                control={updateTruckTypeForm.control}
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
                control={updateTruckTypeForm.control}
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
                control={updateTruckTypeForm.control}
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
                control={updateTruckTypeForm.control}
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
