'use client';

import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { PlusIcon } from 'lucide-react';
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
    DialogTrigger,
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
import { useCreateTruck } from '../hooks/use-trucks';
import { useTruckTypeOptions } from '../../admin/truck-types/hooks/use-admin-truck-type';

const addTruckFormSchema = z.object({
    registrationNumber: z
        .string()
        .min(1, "Le numéro d'immatriculation est requis"),
    maxWeight: z.number().min(1, 'Le poids maximum doit être supérieur à 0'),
    truckTypeId: z.string().min(1, 'Le type de camion est requis'),
});

export default function AddTruckDialog() {
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const addTruckForm = useForm<z.infer<typeof addTruckFormSchema>>({
        resolver: zodResolver(addTruckFormSchema),
        defaultValues: {
            registrationNumber: '',
            maxWeight: 0,
            truckTypeId: '',
        },
        mode: 'onChange',
    });

    const { mutateAsync: createTruck, isPending } = useCreateTruck();
    const { data: truckTypesData } = useTruckTypeOptions();

    async function onSubmit(values: z.infer<typeof addTruckFormSchema>) {
        const result = await createTruck(values);
        if (result.status === 'SUCCESS') {
            setIsDialogOpen(false);
            addTruckForm.reset();
        }
    }

    return (
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
                <Button
                    className="flex items-center gap-2 has-[>svg]:px-4 h-auto bg-gradient-to-r from-brand to-primary"
                    onClick={() => {
                        addTruckForm.reset();
                    }}
                >
                    <PlusIcon className="size-4" />
                    Nouveau Camion
                </Button>
            </DialogTrigger>
            <DialogContent className="p-0 overflow-hidden sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
                <DialogHeader className="p-4 bg-muted border-b">
                    <DialogTitle>Ajouter un nouveau camion</DialogTitle>
                    <DialogDescription>
                        Ajoutez un nouveau camion à votre flotte.
                    </DialogDescription>
                </DialogHeader>

                <Form {...addTruckForm}>
                    <form
                        onSubmit={addTruckForm.handleSubmit(onSubmit)}
                        className="space-y-8"
                    >
                        <div className="p-4 flex flex-col gap-4">
                            <FormField
                                control={addTruckForm.control}
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
                                control={addTruckForm.control}
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
                                control={addTruckForm.control}
                                name="truckTypeId"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Type de camion *</FormLabel>
                                        <Select
                                            onValueChange={field.onChange}
                                            defaultValue={field.value}
                                        >
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Sélectionner un type de camion" />
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
                                onClick={() => setIsDialogOpen(false)}
                            >
                                Annuler
                            </Button>
                            <Button type="submit" disabled={isPending}>
                                {isPending ? 'Création...' : 'Créer'}
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}
