"use client";

import { useCallback, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
    Search,
    Filter,
    X,
    Plus,
    Truck,
    MapPin,
    Calendar,
    Weight,
    Package,
    DollarSign,
    Edit,
    Trash2,
    MoreHorizontal,
    RefreshCw,
} from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";
import { MetaType } from "@/lib/types/meta.type";
import { PaginationParams } from "@/lib/types/pagination.type";

import { useMyShipmentOffers, useDeleteShipmentOffer } from "../hooks/use-shipment-offers";
import { ShipmentOfferDataType, ShipmentOfferStatus } from "../types/shipment-offer.type";
import { useTruckTypeOptions } from "@/features/admin/truck-types/hooks/use-admin-truck-type";
import { CountryCombobox } from "@/components/ui/country-combobox";
import { CityCombobox } from "@/components/ui/city-combobox";
import RenderPagination from "@/components/render-pagination";

const statusOptions = [
    {
        value: ShipmentOfferStatus.PENDING,
        label: "En attente",
        color: "bg-yellow-100 text-yellow-800",
    },
    {
        value: ShipmentOfferStatus.ACCEPTED,
        label: "Acceptée",
        color: "bg-green-100 text-green-800",
    },
    {
        value: ShipmentOfferStatus.REJECTED,
        label: "Rejetée",
        color: "bg-red-100 text-red-800",
    },
    {
        value: ShipmentOfferStatus.EXPIRED,
        label: "Expirée",
        color: "bg-gray-100 text-gray-800",
    },
    {
        value: ShipmentOfferStatus.CANCELLED,
        label: "Annulée",
        color: "bg-red-100 text-red-800",
    },
];

const getStatusBadge = (status: ShipmentOfferStatus) => {
    const statusConfig = statusOptions.find((s) => s.value === status);
    return (
        <Badge className={statusConfig?.color || "bg-gray-100 text-gray-800"}>{statusConfig?.label || status}</Badge>
    );
};

export default function MyOffersList() {
    const router = useRouter();

    // États pour les filtres
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

    // État pour la pagination
    const [pagination, setPagination] = useState<PaginationParams>({
        order: "DESC",
        page: 0,
        take: 9,
    });

    // Hooks pour les données
    const { data: truckTypes } = useTruckTypeOptions();
    const { mutate: deleteOffer } = useDeleteShipmentOffer();

    // Paramètres de requête
    const queryParams = useMemo(
        () => ({
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
        }),
        [
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
        ],
    );

    const { data: offersResponse, isLoading, isError, refetch } = useMyShipmentOffers(queryParams);

    const offers = offersResponse?.data || [];
    const meta = offersResponse?.meta as MetaType;

    // Handlers
    const resetToFirstPage = useCallback(() => {
        setPagination((prev) => ({ ...prev, page: 0 }));
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
        setPagination({ order: "DESC", page: 0, take: 9 });
    }, []);

    const handleDelete = useCallback(
        (id: string) => {
            deleteOffer(id);
        },
        [deleteOffer],
    );

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

    // Gestion des erreurs
    if (isError) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="text-center space-y-4">
                    <div className="text-red-500">Une erreur est survenue lors du chargement</div>
                    <Button onClick={() => refetch()}>
                        <RefreshCw className="h-4 w-4 mr-2" />
                        Réessayer
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            {/* En-tête */}
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-foreground">Mes Offres de Transport</h1>
                    <p className="text-muted-foreground">Gérez vos offres de transport et suivez leur statut</p>
                </div>
                <Button
                    onClick={() => router.push("/shipment-offers/create")}
                    className="flex items-center gap-2 bg-gradient-to-r from-brand to-primary"
                >
                    <Plus className="h-4 w-4" />
                    Nouvelle Offre
                </Button>
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

            {/* Liste des offres */}
            {isLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {Array.from({ length: 6 }).map((_, i) => (
                        <Card key={i} className="p-6">
                            <Skeleton className="h-6 w-3/4 mb-4" />
                            <Skeleton className="h-4 w-full mb-2" />
                            <Skeleton className="h-4 w-2/3 mb-4" />
                            <Skeleton className="h-10 w-full" />
                        </Card>
                    ))}
                </div>
            ) : offers.length === 0 ? (
                <Card className="p-12 text-center">
                    <Package className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                    <h3 className="text-lg font-semibold mb-2">Aucune offre trouvée</h3>
                    <p className="text-muted-foreground mb-6">
                        {hasActiveFilters
                            ? "Aucune offre ne correspond à vos critères de recherche."
                            : "Vous n'avez pas encore créé d'offre de transport."}
                    </p>
                    <Button onClick={() => router.push("/shipment-offers/create")}>
                        <Plus className="h-4 w-4 mr-2" />
                        Créer ma première offre
                    </Button>
                </Card>
            ) : (
                <>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {offers.map((offer: ShipmentOfferDataType) => (
                            <Card key={offer.id} className="hover:shadow-lg transition-shadow duration-200">
                                <CardHeader className="pb-3">
                                    <div className="flex items-start justify-between">
                                        <div className="space-y-2">
                                            <div className="flex items-center gap-2">
                                                <Package className="h-5 w-5 text-brand" />
                                                <h3 className="font-semibold text-lg truncate">{offer.commodity}</h3>
                                            </div>
                                            {getStatusBadge(offer.status)}
                                        </div>
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="sm">
                                                    <MoreHorizontal className="h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuItem
                                                    onClick={() => router.push(`/shipment-offers/${offer.id}/edit`)}
                                                >
                                                    <Edit className="h-4 w-4 mr-2" />
                                                    Modifier
                                                </DropdownMenuItem>
                                                <DropdownMenuItem
                                                    onClick={() => handleDelete(offer.id)}
                                                    className="text-red-600 focus:text-red-600"
                                                >
                                                    <Trash2 className="h-4 w-4 mr-2" />
                                                    Supprimer
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </div>
                                </CardHeader>

                                <CardContent className="space-y-4">
                                    {/* Route */}
                                    <div className="flex items-center justify-between text-sm">
                                        <div className="flex items-center gap-1">
                                            <MapPin className="h-4 w-4 text-green-600" />
                                            <span className="font-medium">{offer.departureCity?.name || "N/A"}</span>
                                        </div>
                                        <div className="flex-1 border-t border-dashed mx-2"></div>
                                        <div className="flex items-center gap-1">
                                            <MapPin className="h-4 w-4 text-red-600" />
                                            <span className="font-medium">{offer.arrivalCity?.name || "N/A"}</span>
                                        </div>
                                    </div>

                                    {/* Informations principales */}
                                    <div className="grid grid-cols-2 gap-4 text-sm">
                                        <div className="flex items-center gap-2">
                                            <Truck className="h-4 w-4 text-muted-foreground" />
                                            <span>{offer.truckType?.name || "N/A"}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Weight className="h-4 w-4 text-muted-foreground" />
                                            <span>{offer.weight} kg</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Package className="h-4 w-4 text-muted-foreground" />
                                            <span>{offer.numberOfParcels} colis</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <DollarSign className="h-4 w-4 text-muted-foreground" />
                                            <span>{parseFloat(offer.reservePrice).toLocaleString()} €</span>
                                        </div>
                                    </div>

                                    {/* Dates */}
                                    <div className="space-y-2 text-sm">
                                        <div className="flex items-center gap-2">
                                            <Calendar className="h-4 w-4 text-muted-foreground" />
                                            <span>
                                                Chargement:{" "}
                                                {format(new Date(offer.loadingTime), "dd MMM yyyy HH:mm", {
                                                    locale: fr,
                                                })}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Calendar className="h-4 w-4 text-muted-foreground" />
                                            <span>
                                                Livraison:{" "}
                                                {format(new Date(offer.unloadDate), "dd MMM yyyy HH:mm", {
                                                    locale: fr,
                                                })}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Exigences spéciales */}
                                    {offer.specialRequirements && (
                                        <div className="text-sm">
                                            <p className="text-muted-foreground">Exigences spéciales:</p>
                                            <p className="text-foreground truncate" title={offer.specialRequirements}>
                                                {offer.specialRequirements}
                                            </p>
                                        </div>
                                    )}

                                    {/* Catégorie et nombre de camions */}
                                    <div className="flex items-center justify-between pt-2 border-t">
                                        <span className="text-xs text-muted-foreground">
                                            {offer.nbrTrucks} camion{offer.nbrTrucks > 1 ? "s" : ""}
                                        </span>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>

                    {/* Pagination */}
                    {meta && (
                        <RenderPagination
                            currentPage={pagination.page}
                            totalPages={Math.ceil(meta.total / pagination.take)}
                            onPageChange={(page) => setPagination((prev) => ({ ...prev, page }))}
                            hasNextPage={meta.hasNextPage}
                            hasPreviousPage={meta.hasPreviousPage}
                        />
                    )}
                </>
            )}
        </div>
    );
}
