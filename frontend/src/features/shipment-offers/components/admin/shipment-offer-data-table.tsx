"use client";

import { useCallback, useMemo, useState } from "react";
import { Search, Filter, X, RotateCcwIcon, Loader2Icon, XIcon } from "lucide-react";

import RenderTable from "@/components/render-table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CountryCombobox } from "@/components/ui/country-combobox";
import { CityCombobox } from "@/components/ui/city-combobox";
import { MetaType } from "@/lib/types/meta.type";
import { PaginationParams } from "@/lib/types/pagination.type";
import { useShipmentOffers } from "../../hooks/use-shipment-offers";
import { useShipmentOfferTable } from "../../hooks/use-shipment-offer-table";
import { ShipmentOfferDataType, ShipmentOfferStatus } from "../../types/shipment-offer.type";
import { useTruckTypeOptions } from "@/features/admin/truck-types/hooks/use-admin-truck-type";

const statusOptions = [
    { value: ShipmentOfferStatus.PENDING, label: "En attente" },
    { value: ShipmentOfferStatus.ACCEPTED, label: "Accepté" },
    { value: ShipmentOfferStatus.REJECTED, label: "Rejeté" },
    { value: ShipmentOfferStatus.EXPIRED, label: "Expiré" },
    { value: ShipmentOfferStatus.CANCELLED, label: "Annulé" },
];

export default function ShipmentOfferDataTable() {
    const [search, setSearch] = useState<string>("");
    const [statusFilter, setStatusFilter] = useState<ShipmentOfferStatus | undefined>(undefined);
    const [minWeight, setMinWeight] = useState<string>("");
    const [maxWeight, setMaxWeight] = useState<string>("");
    const [order, setOrder] = useState<"ASC" | "DESC">("DESC");
    const [truckTypeFilter, setTruckTypeFilter] = useState<string | undefined>(undefined);
    const [departureCountryId, setDepartureCountryId] = useState<string>("");
    const [departureCityFilter, setDepartureCityFilter] = useState<string | undefined>(undefined);
    const [arrivalCountryId, setArrivalCountryId] = useState<string>("");
    const [arrivalCityFilter, setArrivalCityFilter] = useState<string | undefined>(undefined);

    // État séparé pour la pagination du tableau
    const [pagination, setPagination] = useState<PaginationParams>({
        order: "DESC",
        page: 0,
        take: 10,
    });

    // Hook pour récupérer les types de camions
    const { data: truckTypes } = useTruckTypeOptions();

    // Paramètres de requête pour l'API
    const queryParams = useMemo(() => {
        return {
            order: order,
            page: pagination.page + 1,
            take: pagination.take,
            search: search,
            status: statusFilter,
            truckTypeId: truckTypeFilter,
            minWeight: minWeight ? parseFloat(minWeight) : undefined,
            maxWeight: maxWeight ? parseFloat(maxWeight) : undefined,
            departureCityId: departureCityFilter,
            arrivalCityId: arrivalCityFilter,
        };
    }, [
        order,
        pagination.page,
        pagination.take,
        search,
        statusFilter,
        truckTypeFilter,
        minWeight,
        maxWeight,
        departureCityFilter,
        arrivalCityFilter,
    ]);

    const { data: offers, isLoading, isPending, isRefetching, refetch } = useShipmentOffers(queryParams);

    const tableData = useMemo(
        () => ({
            data: offers?.data as unknown as ShipmentOfferDataType[],
            meta: offers?.meta as MetaType,
            isLoading,
            isPending,
            paginationParams: pagination,
            setPaginationParams: setPagination,
        }),
        [offers?.data, offers?.meta, isLoading, isPending, pagination],
    );

    const table = useShipmentOfferTable(tableData);

    const resetToFirstPage = useCallback(() => {
        setPagination((prev) => ({
            ...prev,
            page: 0,
        }));
    }, []);

    // Gestionnaires de changement avec reset de pagination
    const handleSearchChange = useCallback(
        (value: string) => {
            setSearch(value);
            resetToFirstPage();
        },
        [resetToFirstPage],
    );

    const handleStatusFilterChange = useCallback(
        (value: string) => {
            setStatusFilter(value === "all" ? undefined : (value as ShipmentOfferStatus));
            resetToFirstPage();
        },
        [resetToFirstPage],
    );

    const handleTruckTypeFilterChange = useCallback(
        (value: string) => {
            setTruckTypeFilter(value === "all" ? undefined : value);
            resetToFirstPage();
        },
        [resetToFirstPage],
    );

    const handleDepartureCityChange = useCallback(
        (value: string) => {
            setDepartureCityFilter(value || undefined);
            resetToFirstPage();
        },
        [resetToFirstPage],
    );

    const handleArrivalCityChange = useCallback(
        (value: string) => {
            setArrivalCityFilter(value || undefined);
            resetToFirstPage();
        },
        [resetToFirstPage],
    );

    const handleMinWeightChange = useCallback(
        (value: string) => {
            setMinWeight(value);
            resetToFirstPage();
        },
        [resetToFirstPage],
    );

    const handleMaxWeightChange = useCallback(
        (value: string) => {
            setMaxWeight(value);
            resetToFirstPage();
        },
        [resetToFirstPage],
    );

    const handleOrderChange = useCallback(
        (value: "ASC" | "DESC") => {
            setOrder(value);
            resetToFirstPage();
        },
        [resetToFirstPage],
    );

    const handleResetFilters = useCallback(() => {
        setSearch("");
        setStatusFilter(undefined);
        setTruckTypeFilter(undefined);
        setMinWeight("");
        setMaxWeight("");
        setOrder("DESC");
        setDepartureCountryId("");
        setDepartureCityFilter(undefined);
        setArrivalCountryId("");
        setArrivalCityFilter(undefined);
        setPagination({
            order: "DESC",
            page: 0,
            take: 10,
        });
    }, []);

    const hasActiveFilters = useMemo(() => {
        return (
            search !== "" ||
            statusFilter !== undefined ||
            truckTypeFilter !== undefined ||
            minWeight !== "" ||
            maxWeight !== "" ||
            order !== "DESC" ||
            departureCityFilter !== undefined ||
            arrivalCityFilter !== undefined
        );
    }, [search, statusFilter, truckTypeFilter, minWeight, maxWeight, order, departureCityFilter, arrivalCityFilter]);

    // Error handling
    if (offers?.status === "ERROR") {
        return (
            <div className="flex items-center justify-between border border-brand/60 bg-brand/10 rounded-lg p-4 text-brand">
                <div className="flex items-center justify-center gap-1">
                    {isRefetching ? (
                        <>
                            <Loader2Icon className="size-5 animate-spin" />
                            Chargement ...
                        </>
                    ) : (
                        <>
                            <XIcon className="size-5" />
                            Une erreur est survenue, veuillez réessayer plus tard
                        </>
                    )}
                </div>

                <Button
                    variant="outline"
                    className="border-brand bg-brand/20 text-brand hover:bg-brand/30 hover:text-brand has-[>svg]:px-4"
                    onClick={() => refetch()}
                >
                    <RotateCcwIcon className="size-4" /> Réessayer
                </Button>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-foreground">Gestion des Offres d&apos;Expédition</h1>
                    <p className="text-muted-foreground">
                        Gérez et supervisez toutes les offres d&apos;expédition de la plateforme
                    </p>
                </div>
            </div>

            {/* Filtres de recherche */}
            <div className="flex flex-col gap-4 p-4 bg-muted/50 rounded-lg border">
                <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                    <Filter className="h-4 w-4" />
                    Filtres de recherche
                </div>

                {/* Première ligne - Search, Truck Type, Status, Order */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3">
                    {/* Barre de recherche */}
                    <div className="sm:col-span-2 lg:col-span-3">
                        <label className="text-sm font-medium text-foreground">Rechercher</label>
                        <div className="relative mt-1">
                            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                            <Input
                                placeholder="Rechercher par marchandise, exigences spéciales..."
                                value={search}
                                onChange={(e) => handleSearchChange(e.target.value)}
                                className="pl-9 bg-white min-w-0"
                            />
                        </div>
                    </div>

                    {/* Type de camion */}
                    <div>
                        <label className="text-sm font-medium text-foreground">Type de camion</label>
                        <Select value={truckTypeFilter || "all"} onValueChange={handleTruckTypeFilterChange}>
                            <SelectTrigger className="mt-1 bg-white min-w-0">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Tous les types</SelectItem>
                                {truckTypes?.data?.map((type) => (
                                    <SelectItem key={type.id} value={type.id}>
                                        {type.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Filtre par statut */}
                    <div>
                        <label className="text-sm font-medium text-foreground">Statut</label>
                        <Select value={statusFilter || "all"} onValueChange={handleStatusFilterChange}>
                            <SelectTrigger className="mt-1 bg-white min-w-0">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Tous les statuts</SelectItem>
                                {statusOptions.map((option) => (
                                    <SelectItem key={option.value} value={option.value}>
                                        {option.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Ordre */}
                    <div>
                        <label className="text-sm font-medium text-foreground">Ordre</label>
                        <Select value={order} onValueChange={handleOrderChange}>
                            <SelectTrigger className="mt-1 bg-white min-w-0">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="DESC">Décroissant</SelectItem>
                                <SelectItem value="ASC">Croissant</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                {/* Deuxième ligne - Locations et Poids */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {/* Ville de départ */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-foreground">Ville de départ</label>
                        <div className="space-y-2">
                            <div className="bg-white rounded-md border">
                                <CountryCombobox
                                    value={departureCountryId}
                                    onValueChange={setDepartureCountryId}
                                    placeholder="Pays de départ"
                                    className="border-0 bg-transparent min-w-0"
                                />
                            </div>
                            <div className="bg-white rounded-md border">
                                <CityCombobox
                                    value={departureCityFilter || ""}
                                    onValueChange={handleDepartureCityChange}
                                    countryId={departureCountryId}
                                    placeholder="Ville de départ"
                                    className="border-0 bg-transparent min-w-0"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Ville d'arrivée */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-foreground">Ville d&apos;arrivée</label>
                        <div className="space-y-2">
                            <div className="bg-white rounded-md border">
                                <CountryCombobox
                                    value={arrivalCountryId}
                                    onValueChange={setArrivalCountryId}
                                    placeholder="Pays d'arrivée"
                                    className="border-0 bg-transparent min-w-0"
                                />
                            </div>
                            <div className="bg-white rounded-md border">
                                <CityCombobox
                                    value={arrivalCityFilter || ""}
                                    onValueChange={handleArrivalCityChange}
                                    countryId={arrivalCountryId}
                                    placeholder="Ville d'arrivée"
                                    className="border-0 bg-transparent min-w-0"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Poids */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-foreground">Poids</label>
                        <div className="space-y-2">
                            <Input
                                type="number"
                                placeholder="Poids min (kg)"
                                value={minWeight}
                                onChange={(e) => handleMinWeightChange(e.target.value)}
                                className="bg-white min-w-0"
                                min="0"
                                step="0.01"
                            />
                            <Input
                                type="number"
                                placeholder="Poids max (kg)"
                                value={maxWeight}
                                onChange={(e) => handleMaxWeightChange(e.target.value)}
                                className="bg-white min-w-0"
                                min="0"
                                step="0.01"
                            />
                        </div>
                    </div>
                </div>

                {/* Bouton reset */}
                {hasActiveFilters && (
                    <div className="flex justify-end">
                        <Button variant="outline" onClick={handleResetFilters} className="flex items-center gap-2">
                            <X className="h-4 w-4" />
                            Réinitialiser tous les filtres
                        </Button>
                    </div>
                )}
            </div>

            <div className="w-full">
                <RenderTable table={table} isLoading={isPending} />
            </div>
        </div>
    );
}
