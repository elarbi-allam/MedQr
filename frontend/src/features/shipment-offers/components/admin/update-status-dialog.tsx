"use client";

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
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useUpdateShipmentOfferStatus } from "../../hooks/use-shipment-offers";
import { ShipmentOfferDataType, ShipmentOfferStatus } from "../../types/shipment-offer.type";

const updateStatusFormSchema = z.object({
    status: z.nativeEnum(ShipmentOfferStatus, {
        message: "Le statut est requis",
    }),
});

const statusOptions = [
    { value: ShipmentOfferStatus.ACCEPTED, label: "Accepté" },
    { value: ShipmentOfferStatus.REJECTED, label: "Rejeté" },
    { value: ShipmentOfferStatus.EXPIRED, label: "Expiré" },
    { value: ShipmentOfferStatus.CANCELLED, label: "Annulé" },
];

interface UpdateStatusDialogProps {
    offer: ShipmentOfferDataType;
    open: boolean;
    setOpen: (open: boolean) => void;
}

export default function UpdateStatusDialog({ offer, open, setOpen }: UpdateStatusDialogProps) {
    const updateStatusForm = useForm<z.infer<typeof updateStatusFormSchema>>({
        resolver: zodResolver(updateStatusFormSchema),
        defaultValues: {
            status: ShipmentOfferStatus.ACCEPTED,
        },
        mode: "onChange",
    });

    const { mutateAsync: updateStatus, isPending } = useUpdateShipmentOfferStatus();

    const onSubmit = async (data: z.infer<typeof updateStatusFormSchema>) => {
        const result = await updateStatus({
            id: offer.id,
            statusData: data,
        });

        if (result.status === "SUCCESS") {
            setOpen(false);
            updateStatusForm.reset();
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="sm:max-w-[500px] p-0 overflow-hidden">
                <DialogHeader className="p-4 bg-muted border-b">
                    <DialogTitle>Modifier le statut de l&apos;offre</DialogTitle>
                    <DialogDescription>
                        Changez le statut de l&apos;offre d&apos;expédition pour &quot;{offer.commodity}&quot;.
                    </DialogDescription>
                </DialogHeader>

                <Form {...updateStatusForm}>
                    <form onSubmit={updateStatusForm.handleSubmit(onSubmit)} className="space-y-8">
                        <div className="p-4 flex flex-col gap-4">
                            <FormField
                                control={updateStatusForm.control}
                                name="status"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Nouveau statut</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Sélectionner le nouveau statut" />
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
                                onClick={() => {
                                    setOpen(false);
                                    updateStatusForm.reset();
                                }}
                            >
                                Annuler
                            </Button>
                            <Button type="submit" disabled={isPending}>
                                {isPending ? (
                                    <>
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                        <span className="ml-2">Mise à jour...</span>
                                    </>
                                ) : (
                                    "Mettre à jour"
                                )}
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}
