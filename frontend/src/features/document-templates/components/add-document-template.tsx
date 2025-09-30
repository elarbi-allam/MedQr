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
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useCreateDocumentTemplate } from "../hooks/use-document-template";
import { AppliesTo, EnterpriseType } from "../types/document-template.type";

const addDocumentTemplateFormSchema = z.object({
  name: z.string().min(2, "Le nom doit contenir au moins 2 caractères"),
  fieldname: z
    .string()
    .min(2, "Le nom du champ doit contenir au moins 2 caractères"),
  description: z
    .string()
    .min(10, "La description doit contenir au moins 10 caractères"),
  appliesTo: z.nativeEnum(AppliesTo, {
    message: "Le type d'application est requis",
  }),
  enterpriseType: z.union([z.nativeEnum(EnterpriseType), z.null()]),
});

const appliesToOptions = [
  { value: AppliesTo.ENTERPRISE, label: "Entreprise" },
  { value: AppliesTo.TRUCK, label: "Camion" },
];

const enterpriseTypeOptions = [
  { value: null, label: "Tous (Transporteur et Expéditeur)" },
  { value: EnterpriseType.CARRIER, label: "Transporteur" },
  { value: EnterpriseType.SHIPPER, label: "Expéditeur" },
];

export default function AddDocumentTemplate() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const addTemplateForm = useForm<
    z.infer<typeof addDocumentTemplateFormSchema>
  >({
    resolver: zodResolver(addDocumentTemplateFormSchema),
    defaultValues: {
      name: "",
      fieldname: "",
      description: "",
      appliesTo: AppliesTo.ENTERPRISE,
      enterpriseType: EnterpriseType.CARRIER,
    },
    mode: "onChange",
  });

  const { mutateAsync: createDocumentTemplate, isPending } =
    useCreateDocumentTemplate();

  async function onSubmit(
    values: z.infer<typeof addDocumentTemplateFormSchema>
  ) {
    const result = await createDocumentTemplate(values);
    if (result.status === "SUCCESS") {
      setIsDialogOpen(false);
      addTemplateForm.reset();
    }
  }

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button
          className="flex items-center gap-2 has-[>svg]:px-4 h-auto bg-gradient-to-r from-brand to-primary"
          onClick={() => {
            addTemplateForm.reset();
          }}
        >
          <PlusIcon className="size-4" />
          Nouveau Modèle
        </Button>
      </DialogTrigger>
      <DialogContent className="p-0 overflow-hidden sm:max-w-[500px]">
        <DialogHeader className="p-4 bg-muted border-b">
          <DialogTitle>Créer un nouveau modèle de document</DialogTitle>
          <DialogDescription>
            Ajoutez un nouveau modèle de document à la plateforme.
          </DialogDescription>
        </DialogHeader>

        <Form {...addTemplateForm}>
          <form
            onSubmit={addTemplateForm.handleSubmit(onSubmit)}
            className="space-y-8"
          >
            <div className="p-4 flex flex-col gap-4">
              <FormField
                control={addTemplateForm.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nom du modèle</FormLabel>
                    <FormControl>
                      <Input placeholder="Ex: ICE, RC, CMR..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={addTemplateForm.control}
                name="fieldname"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nom du champ</FormLabel>
                    <FormControl>
                      <Input placeholder="Ex: ice, rc, cmr..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={addTemplateForm.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Description du document requis..."
                        rows={3}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={addTemplateForm.control}
                name="appliesTo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>S&apos;applique à</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionner le type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {appliesToOptions.map((option) => (
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

              <FormField
                control={addTemplateForm.control}
                name="enterpriseType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Type d&apos;entreprise</FormLabel>
                    <Select
                      onValueChange={(value) =>
                        field.onChange(value === "null" ? null : value)
                      }
                      defaultValue={field.value || "null"}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionner le type d'entreprise" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {enterpriseTypeOptions.map((option) => (
                          <SelectItem
                            key={option.value || "null"}
                            value={option.value || "null"}
                          >
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
