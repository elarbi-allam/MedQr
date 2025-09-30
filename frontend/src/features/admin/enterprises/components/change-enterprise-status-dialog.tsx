"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Shield, Loader2 } from "lucide-react";

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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useChangeEnterpriseStatus } from "../hooks/use-admin-enterprise";
import { EnterpriseDataType, EnterpriseStatus } from "../types/enterprise.type";

const changeStatusFormSchema = z.object({
  status: z.nativeEnum(EnterpriseStatus, { message: "Le statut est requis" }),
});

const statusOptions = [
  {
    value: EnterpriseStatus.ACTIVE,
    label: "Active",
    description: "L'entreprise est active et peut utiliser la plateforme",
  },
  {
    value: EnterpriseStatus.INACTIVE,
    label: "Inactive",
    description: "L'entreprise est temporairement désactivée",
  },
  {
    value: EnterpriseStatus.PENDING_VERIFICATION,
    label: "En attente de vérification",
    description: "L'entreprise attend la vérification des documents",
  },
  {
    value: EnterpriseStatus.SUSPENDED,
    label: "Suspendue",
    description: "L'entreprise est suspendue pour violation des conditions",
  },
  {
    value: EnterpriseStatus.REJECTED,
    label: "Rejetée",
    description: "La demande de l'entreprise a été rejetée",
  },
  {
    value: EnterpriseStatus.INCOMPLETE,
    label: "Incomplète",
    description: "L'entreprise doit compléter ses informations",
  },
];

interface ChangeEnterpriseStatusDialogProps {
  enterprise: EnterpriseDataType;
  open: boolean;
  setOpen: (open: boolean) => void;
}

export default function ChangeEnterpriseStatusDialog({
  enterprise,
  open,
  setOpen,
}: ChangeEnterpriseStatusDialogProps) {
  const changeStatusForm = useForm<z.infer<typeof changeStatusFormSchema>>({
    resolver: zodResolver(changeStatusFormSchema),
    defaultValues: {
      status: enterprise.status,
    },
    mode: "onChange",
  });

  const { mutateAsync: changeStatus, isPending } = useChangeEnterpriseStatus();

  const onSubmit = async (data: z.infer<typeof changeStatusFormSchema>) => {
    const result = await changeStatus({
      id: enterprise.id,
      status: { status: data.status },
    });

    if (result.status === "SUCCESS") {
      setOpen(false);
    }
  };

  const selectedStatus = changeStatusForm.watch("status");
  const selectedStatusOption = statusOptions.find(
    (option) => option.value === selectedStatus
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-2xl p-0 overflow-hidden">
        <DialogHeader className="p-4 bg-muted border-b">
          <DialogTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Changer le statut de l&apos;entreprise
          </DialogTitle>
          <DialogDescription>
            Modifiez le statut de <strong>{enterprise.name}</strong>. Cette
            action affectera l&apos;accès de l&apos;entreprise à la plateforme.
          </DialogDescription>
        </DialogHeader>

        <Form {...changeStatusForm}>
          <form
            onSubmit={changeStatusForm.handleSubmit(onSubmit)}
            className="space-y-8"
          >
            <div className="p-4 flex flex-col gap-4">
              <div className="p-4 bg-muted/50 rounded-lg">
                <div className="text-sm">
                  <div className="font-medium">Statut actuel:</div>
                  <div className="text-muted-foreground">
                    {
                      statusOptions.find((s) => s.value === enterprise.status)
                        ?.label
                    }
                  </div>
                </div>
              </div>

              <FormField
                control={changeStatusForm.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nouveau statut *</FormLabel>
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
                            <div>
                              <div className="font-medium">{option.label}</div>
                              <div className="text-xs text-muted-foreground">
                                {option.description}
                              </div>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {selectedStatusOption && (
                <div className="p-4 bg-blue-50 dark:bg-blue-950 rounded-lg border border-blue-200 dark:border-blue-800">
                  <div className="text-sm">
                    <div className="font-medium text-blue-800 dark:text-blue-200">
                      Impact du changement:
                    </div>
                    <div className="text-blue-700 dark:text-blue-300 mt-1">
                      {selectedStatusOption.description}
                    </div>
                  </div>
                </div>
              )}
            </div>

            <DialogFooter className="p-4 bg-muted flex justify-end border-t">
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
              >
                Annuler
              </Button>
              <Button
                type="submit"
                disabled={isPending || selectedStatus === enterprise.status}
              >
                {isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span className="ml-2">Modification...</span>
                  </>
                ) : (
                  "Modifier le statut"
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
