'use client';

import { useEffect } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { useUpdateTruck } from '../hooks/use-trucks';
import { TruckDataType } from '../types/truck.type';
import { useTruckTypeOptions } from '../../admin/truck-types/hooks/use-admin-truck-type';

const updateTruckFormSchema = z.object({
    registrationNumber: z
        .string()
        .min(1, "Le numéro d'immatriculation est requis"),
    maxWeight: z.number().min(1, 'Le poids maximum doit être supérieur à 0'),
    truckTypeId: z.string().min(1, 'Le type de camion est requis'),
});

export default function EditTruckDialog({
    truck,
    open,
    setOpen,
}: {
    truck: TruckDataType;
    open: boolean;
    setOpen: (open: boolean) => void;
}) {
    const updateTruckForm = useForm<z.infer<typeof updateTruckFormSchema>>({
        resolver: zodResolver(updateTruckFormSchema),
        defaultValues: {
            registrationNumber: truck.registrationNumber,
            maxWeight: parseFloat(truck.maxWeight),
            truckTypeId: truck.truckType.id,
        },
        mode: 'onChange',
    });

    const { mutateAsync: updateTruck, isPending } = useUpdateTruck();
    const { data: truckTypesData } = useTruckTypeOptions();

    const onSubmit = async (data: z.infer<typeof updateTruckFormSchema>) => {
        const result = await updateTruck({
            id: truck.id,
            truckData: data,
        });

        if (result.status === 'SUCCESS') {
            setOpen(false);
        }
    };

    useEffect(() => {
        updateTruckForm.reset({
            registrationNumber: truck.registrationNumber,
            maxWeight: parseFloat(truck.maxWeight),
            truckTypeId: truck.truckType.id,
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [truck]);

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="max-w-2xl p-0 overflow-hidden max-h-[90vh] overflow-y-auto">
                <DialogHeader className="p-4 bg-muted border-b">
                    <DialogTitle>Modifier le camion</DialogTitle>
                    <DialogDescription>
                        Modifiez les informations de {truck.registrationNumber}.
                    </DialogDescription>
                </DialogHeader>

                <Form {...updateTruckForm}>
                    <form
                        onSubmit={updateTruckForm.handleSubmit(onSubmit)}
                        className="space-y-8"
                    >
                        <div className="p-4 flex flex-col gap-4">
                            <FormField
                                control={updateTruckForm.control}
                                name="registrationNumber"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>
                                            Numéro d&apos;immatriculation *
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="ABC-123-XYZ"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={updateTruckForm.control}
                                name="maxWeight"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>
                                            Poids maximum (tonnes) *
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                type="number"
                                                min="1"
                                                step="0.1"
                                                placeholder="10"
                                                {...field}
                                                onChange={(e) =>
                                                    field.onChange(
                                                        Number(e.target.value)
                                                    )
                                                }
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={updateTruckForm.control}
                                name="truckTypeId"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Type de camion *</FormLabel>
                                        <Select
                                            onValueChange={field.onChange}
                                            value={field.value}
                                        >
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {truckTypesData?.data?.map(
                                                    (truckType) => (
                                                        <SelectItem
                                                            key={truckType.id}
                                                            value={truckType.id}
                                                        >
                                                            <div className="flex items-center gap-2">
                                                                <span>
                                                                    {
                                                                        truckType.icon
                                                                    }
                                                                </span>
                                                                <span>
                                                                    {
                                                                        truckType.name
                                                                    }
                                                                </span>
                                                            </div>
                                                        </SelectItem>
                                                    )
                                                )}
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
                                        <span className="ml-2">
                                            Modification...
                                        </span>
                                    </>
                                ) : (
                                    'Modifier'
                                )}
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}
