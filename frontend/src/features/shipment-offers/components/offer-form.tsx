"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { ArrowLeft, Save, MapPin, Package, Calendar, CalendarIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { TimePicker } from "@/components/ui/time-picker";

import { CountryCombobox } from "@/components/ui/country-combobox";
import { CityCombobox } from "@/components/ui/city-combobox";
import { useTruckTypeOptions } from "@/features/admin/truck-types/hooks/use-admin-truck-type";
import { useCreateShipmentOffer, useUpdateShipmentOffer, useShipmentOffer } from "../hooks/use-shipment-offers";

const offerFormSchema = z.object({
    truckTypeId: z.string().min(1, "Le type de camion est requis"),
    departureCountryId: z.string().min(1, "Le pays de départ est requis"),
    departureCityId: z.string().min(1, "La ville de départ est requise"),
    arrivalCountryId: z.string().min(1, "Le pays d'arrivée est requis"),
    arrivalCityId: z.string().min(1, "La ville d'arrivée est requise"),
    commodity: z.string().min(2, "La marchandise doit contenir au moins 2 caractères"),
    weight: z.number().positive("Le poids doit être positif"),
    loadingTime: z.date({ required_error: "La date de chargement est requise" }),
    unloadDate: z.date({ required_error: "La date de déchargement est requise" }),
    specialRequirements: z.string().optional(),
    numberOfParcels: z.number().int().positive("Le nombre de colis doit être positif"),
    nbrTrucks: z.number().int().positive("Le nombre de camions doit être positif"),
    availableTo: z.date({
        required_error: "La date de disponibilité est requise",
    }),
    reservePrice: z.number().positive("Le prix de réserve doit être positif"),
});

type OfferFormData = z.infer<typeof offerFormSchema>;

interface OfferFormProps {
    mode: "create" | "edit";
    offerId?: string;
}

export default function OfferForm({ mode, offerId }: OfferFormProps) {
    const router = useRouter();

    const { data: truckTypes } = useTruckTypeOptions();
    const { data: existingOffer } = useShipmentOffer(offerId || "");
    const { mutateAsync: createOffer, isPending: isCreating } = useCreateShipmentOffer();
    const { mutateAsync: updateOffer, isPending: isUpdating } = useUpdateShipmentOffer();

    const isLoading = isCreating || isUpdating;

    const form = useForm<OfferFormData>({
        resolver: zodResolver(offerFormSchema),
        defaultValues: {
            truckTypeId: "",
            departureCountryId: "",
            departureCityId: "",
            arrivalCountryId: "",
            arrivalCityId: "",
            commodity: "",
            weight: 0,
            loadingTime: new Date(),
            unloadDate: new Date(),
            specialRequirements: "",
            numberOfParcels: 1,
            nbrTrucks: 1,
            availableTo: new Date(),
            reservePrice: 0,
        },
    });

    const departureCountryId = form.watch("departureCountryId");
    const arrivalCountryId = form.watch("arrivalCountryId");

    // DateTimePicker Component
    const DateTimePicker = ({
        date,
        setDate,
        placeholder,
    }: {
        date?: Date;
        setDate: (date: Date | undefined) => void;
        placeholder: string;
    }) => {
        return (
            <Popover>
                <PopoverTrigger asChild>
                    <Button
                        variant="outline"
                        className={cn(
                            "w-full justify-start text-left font-normal h-10",
                            !date && "text-muted-foreground",
                        )}
                    >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {date ? format(date, "PPp", { locale: fr }) : placeholder}
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                    <CalendarComponent mode="single" selected={date} onSelect={setDate} initialFocus />
                    <div className="p-3 border-t border-border">
                        <TimePicker setDate={setDate} date={date} />
                    </div>
                </PopoverContent>
            </Popover>
        );
    };

    useEffect(() => {
        if (mode === "edit" && existingOffer?.data) {
            const offer = existingOffer.data;
            setTimeout(() => {
                form.reset({
                    truckTypeId: offer.truckType?.id || "",
                    departureCountryId: offer.departureCity?.country.id,
                    departureCityId: offer.departureCity?.id || "",
                    arrivalCountryId: offer.arrivalCity?.country.id,
                    arrivalCityId: offer.arrivalCity?.id || "",
                    commodity: offer.commodity,
                    weight: parseFloat(offer.weight),
                    loadingTime: new Date(offer.loadingTime),
                    unloadDate: new Date(offer.unloadDate),
                    specialRequirements: offer.specialRequirements || "",
                    numberOfParcels: offer.numberOfParcels,
                    nbrTrucks: offer.nbrTrucks,
                    availableTo: new Date(offer.availableTo),
                    reservePrice: parseFloat(offer.reservePrice),
                });

                if (offer.truckType?.id) {
                    form.setValue("truckTypeId", offer.truckType.id);
                }
            }, 100);
        }
    }, [mode, existingOffer, form, truckTypes]);

    const onSubmit = async (data: OfferFormData) => {
        try {
            const offerData = {
                truckTypeId: data.truckTypeId,
                departureCityId: data.departureCityId,
                arrivalCityId: data.arrivalCityId,
                commodity: data.commodity,
                weight: data.weight,
                loadingTime: data.loadingTime.toISOString(),
                unloadDate: data.unloadDate.toISOString(),
                specialRequirements: data.specialRequirements || "",
                numberOfParcels: data.numberOfParcels,
                nbrTrucks: data.nbrTrucks,
                availableTo: data.availableTo.toISOString(),
                reservePrice: data.reservePrice,
            };

            if (mode === "create") {
                const result = await createOffer(offerData);
                if (result.status === "SUCCESS") {
                    router.push("/shipment-offers");
                }
            } else if (mode === "edit" && offerId) {
                const result = await updateOffer({ id: offerId, offerData });
                if (result.status === "SUCCESS") {
                    router.push("/shipment-offers");
                }
            }
        } catch (error) {
            console.error("Erreur lors de la soumission:", error);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="container mx-auto py-1 px-1 max-w-[1400px]">
                <div className="flex items-center justify-between py-4 gap-4">
                    <div className="flex items-center gap-4">
                        <Button variant="outline" size="sm" onClick={() => router.back()}>
                            <ArrowLeft className="h-4 w-4 mr-2" />
                            Retour
                        </Button>
                        <div>
                            <h1 className="text-xl font-bold text-gray-900">
                                {mode === "create" ? "Créer une Offre" : "Modifier l'Offre"}
                            </h1>
                            <p className="text-xs text-gray-600">
                                {mode === "create" ? "Nouvelle offre de transport" : "Modification de l'offre"}
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <Button type="button" variant="outline" onClick={() => router.back()} disabled={isLoading}>
                            Annuler
                        </Button>
                        <Button
                            type="submit"
                            form="offer-form"
                            disabled={isLoading}
                            className="flex items-center gap-2"
                        >
                            <Save className="h-4 w-4" />
                            {isLoading ? "Enregistrement..." : mode === "create" ? "Créer" : "Modifier"}
                        </Button>
                    </div>
                </div>

                <Form {...form}>
                    <form id="offer-form" onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        {/* Grille principale - 3 colonnes */}
                        <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 py-4">
                            {/* Colonne 1: Itinéraire */}
                            <Card className="shadow-sm p-0">
                                <CardHeader className="bg-gradient-to-r rounded-t-xl from-blue-50 to-indigo-50 border-b p-5">
                                    <CardTitle className="flex items-center gap-2 text-base">
                                        <MapPin className="h-4 w-4 text-blue-600" />
                                        Itinéraire
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="p-4 space-y-4">
                                    {/* Départ */}
                                    <div>
                                        <div className="flex items-center gap-2 mb-3">
                                            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                            <span className="text-sm font-medium">Départ</span>
                                        </div>
                                        <div className="space-y-3">
                                            <FormField
                                                control={form.control}
                                                name="departureCountryId"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel className="text-xs">Pays</FormLabel>
                                                        <FormControl>
                                                            <CountryCombobox
                                                                value={field.value}
                                                                onValueChange={field.onChange}
                                                                placeholder="Pays de départ"
                                                            />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                            <FormField
                                                control={form.control}
                                                name="departureCityId"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel className="text-xs">Ville</FormLabel>
                                                        <FormControl>
                                                            <CityCombobox
                                                                value={field.value}
                                                                onValueChange={field.onChange}
                                                                countryId={departureCountryId}
                                                                placeholder="Ville de départ"
                                                            />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                        </div>
                                    </div>

                                    {/* Arrivée */}
                                    <div>
                                        <div className="flex items-center gap-2 mb-3">
                                            <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                                            <span className="text-sm font-medium">Arrivée</span>
                                        </div>
                                        <div className="space-y-3">
                                            <FormField
                                                control={form.control}
                                                name="arrivalCountryId"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel className="text-xs">Pays</FormLabel>
                                                        <FormControl>
                                                            <CountryCombobox
                                                                value={field.value}
                                                                onValueChange={field.onChange}
                                                                placeholder="Pays d'arrivée"
                                                            />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                            <FormField
                                                control={form.control}
                                                name="arrivalCityId"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel className="text-xs">Ville</FormLabel>
                                                        <FormControl>
                                                            <CityCombobox
                                                                value={field.value}
                                                                onValueChange={field.onChange}
                                                                countryId={arrivalCountryId}
                                                                placeholder="Ville d'arrivée"
                                                            />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Colonne 2: Marchandise & Transport */}
                            <Card className="shadow-sm p-0">
                                <CardHeader className="bg-gradient-to-r rounded-t-xl from-green-50 to-emerald-50 border-b p-5">
                                    <CardTitle className="flex items-center gap-2 text-base">
                                        <Package className="h-4 w-4 text-green-600" />
                                        Marchandise & Transport
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="p-4 space-y-4">
                                    <FormField
                                        control={form.control}
                                        name="commodity"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="text-xs">Type de Marchandise</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        placeholder="Ex: Électronique..."
                                                        {...field}
                                                        className="h-9"
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <div className="grid grid-cols-2 gap-3">
                                        <FormField
                                            control={form.control}
                                            name="weight"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel className="text-xs">Poids (kg)</FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            type="number"
                                                            placeholder="1000"
                                                            {...field}
                                                            onChange={(e) =>
                                                                field.onChange(parseFloat(e.target.value) || 0)
                                                            }
                                                            className="h-9"
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name="numberOfParcels"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel className="text-xs">Nb Colis</FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            type="number"
                                                            placeholder="10"
                                                            {...field}
                                                            onChange={(e) =>
                                                                field.onChange(parseInt(e.target.value) || 1)
                                                            }
                                                            className="h-9"
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>

                                    <FormField
                                        control={form.control}
                                        name="truckTypeId"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="text-xs">Type de Camion</FormLabel>
                                                <Select onValueChange={field.onChange} value={field.value}>
                                                    <FormControl>
                                                        <SelectTrigger className="h-9">
                                                            <SelectValue placeholder="Type de camion" />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        {truckTypes?.data?.map((type) => (
                                                            <SelectItem key={type.id} value={type.id}>
                                                                {type.name}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="nbrTrucks"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="text-xs">Nombre de Camions</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        type="number"
                                                        placeholder="1"
                                                        {...field}
                                                        onChange={(e) => field.onChange(parseInt(e.target.value) || 1)}
                                                        className="h-9"
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="specialRequirements"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="text-xs">Exigences Spéciales</FormLabel>
                                                <FormControl>
                                                    <Textarea
                                                        placeholder="Produits fragiles..."
                                                        rows={2}
                                                        {...field}
                                                        className="resize-none text-sm"
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </CardContent>
                            </Card>

                            {/* Colonne 3: Planning & Prix */}
                            <Card className="shadow-sm p-0">
                                <CardHeader className="bg-gradient-to-r rounded-t-xl from-purple-50 to-violet-50 border-b p-5">
                                    <CardTitle className="flex items-center gap-2 text-base">
                                        <Calendar className="h-4 w-4 text-purple-600" />
                                        Planning & Prix
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="p-4 space-y-4">
                                    <FormField
                                        control={form.control}
                                        name="loadingTime"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="text-xs">Date de Chargement</FormLabel>
                                                <FormControl>
                                                    <DateTimePicker
                                                        date={field.value}
                                                        setDate={field.onChange}
                                                        placeholder="Sélectionner la date"
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="unloadDate"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="text-xs">Date de Déchargement</FormLabel>
                                                <FormControl>
                                                    <DateTimePicker
                                                        date={field.value}
                                                        setDate={field.onChange}
                                                        placeholder="Sélectionner la date"
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="availableTo"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="text-xs">Disponible Jusqu&apos;au</FormLabel>
                                                <FormControl>
                                                    <DateTimePicker
                                                        date={field.value}
                                                        setDate={field.onChange}
                                                        placeholder="Date limite offres"
                                                    />
                                                </FormControl>
                                                <FormDescription className="text-xs">
                                                    Date limite pour les offres
                                                </FormDescription>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="reservePrice"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="text-xs">Prix de Réserve (MAD)</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        type="number"
                                                        placeholder="5000"
                                                        {...field}
                                                        onChange={(e) =>
                                                            field.onChange(parseFloat(e.target.value) || 0)
                                                        }
                                                        className="h-9 font-medium"
                                                    />
                                                </FormControl>
                                                <FormDescription className="text-xs">Budget maximum</FormDescription>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </CardContent>
                            </Card>
                        </div>
                    </form>
                </Form>
            </div>
        </div>
    );
}
