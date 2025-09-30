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
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useUpdateDocumentTemplate } from "../hooks/use-document-template";
import { DocumentTemplateDataType, AppliesTo, EnterpriseType, DocumentTemplateStatus } from "../types/document-template.type";

const updateDocumentTemplateFormSchema = z.object({
  name: z.string().min(2, "Le nom doit contenir au moins 2 caractères"),
  fieldname: z.string().min(2, "Le nom du champ doit contenir au moins 2 caractères"),
  description: z.string().min(10, "La description doit contenir au moins 10 caractères"),
  appliesTo: z.nativeEnum(AppliesTo, { message: "Le type d'application est requis" }),
  enterpriseType: z.union([z.nativeEnum(EnterpriseType), z.null()]),
  status: z.nativeEnum(DocumentTemplateStatus, { message: "Le statut est requis" }),
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

const statusOptions = [
  { value: DocumentTemplateStatus.ACTIVE, label: "Actif" },
  { value: DocumentTemplateStatus.INACTIVE, label: "Inactif" },
];

export default function EditDocumentTemplateDialog({
  template,
  open,
  setOpen,
}: {
  template: DocumentTemplateDataType;
  open: boolean;
  setOpen: (open: boolean) => void;
}) {
  const updateTemplateForm = useForm<z.infer<typeof updateDocumentTemplateFormSchema>>({
    resolver: zodResolver(updateDocumentTemplateFormSchema),
    defaultValues: {
      name: template.name,
      fieldname: template.fieldname,
      description: template.description,
      appliesTo: template.appliesTo,
      enterpriseType: template.enterpriseType,
      status: template.status,
    },
    mode: "onChange",
  });

  const { mutateAsync: updateDocumentTemplate, isPending } = useUpdateDocumentTemplate();

  const onSubmit = async (data: z.infer<typeof updateDocumentTemplateFormSchema>) => {
    const result = await updateDocumentTemplate({
      id: template.id,
      templateData: data,
    });

    if (result.status === "SUCCESS") {
      setOpen(false);
    }
  };

  useEffect(() => {
    updateTemplateForm.reset({
      name: template.name,
      fieldname: template.fieldname,
      description: template.description,
      appliesTo: template.appliesTo,
      enterpriseType: template.enterpriseType,
      status: template.status,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [template]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-2xl p-0 overflow-hidden">
        <DialogHeader className="p-4 bg-muted border-b">
          <DialogTitle>Modifier le modèle de document</DialogTitle>
          <DialogDescription>
            Modifiez les informations du modèle &quot;{template.name}&quot;.
          </DialogDescription>
        </DialogHeader>

        <Form {...updateTemplateForm}>
          <form
            onSubmit={updateTemplateForm.handleSubmit(onSubmit)}
            className="space-y-8"
          >
            <div className="p-4 flex flex-col gap-4">
              <FormField
                control={updateTemplateForm.control}
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
                control={updateTemplateForm.control}
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
                control={updateTemplateForm.control}
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
                control={updateTemplateForm.control}
                name="appliesTo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>S&apos;applique à</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue />
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
                control={updateTemplateForm.control}
                name="enterpriseType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Type d&apos;entreprise</FormLabel>
                    <Select 
                      onValueChange={(value) => field.onChange(value === "null" ? null : value)}
                      defaultValue={field.value || "null"}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {enterpriseTypeOptions.map((option) => (
                          <SelectItem key={option.value || "null"} value={option.value || "null"}>
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
                control={updateTemplateForm.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Statut</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
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
                    <span className="ml-2">En cours...</span>
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