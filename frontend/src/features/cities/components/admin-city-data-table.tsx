"use client";

import { useCallback, useMemo, useState } from "react";
import {
  Search,
  Filter,
  X,
  Loader2Icon,
  RotateCcwIcon,
  XIcon,
} from "lucide-react";

import RenderTable from "@/components/render-table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MetaType } from "@/lib/types/meta.type";
import { PaginationParams } from "@/lib/types/pagination.type";
import { useAdminCities } from "../hooks/use-cities";
import { useCountriesForCities } from "@/features/countries/hooks/use-countries";
import { useAdminCityTable } from "../hooks/use-admin-city-table";
import { CityDataType, CityStatus } from "../types/city.type";
import AddAdminCity from "./add-admin-city";

const statusOptions = [
  { value: CityStatus.ACTIVE, label: "Actif" },
  { value: CityStatus.INACTIVE, label: "Inactif" },
];

export default function AdminCityDataTable() {
  const [search, setSearch] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<CityStatus | undefined>(
    undefined
  );
  const [countryFilter, setCountryFilter] = useState<string | undefined>(
    undefined
  );
  const [order, setOrder] = useState<"ASC" | "DESC">("DESC");

  // Charger les pays pour le filtre
  const { data: countriesResponse } = useCountriesForCities();
  const countries = countriesResponse?.data || [];

  // État séparé pour la pagination du tableau
  const [pagination, setPagination] = useState<PaginationParams>({
    order: "DESC",
    page: 0,
    take: 10,
  });

  // Paramètres de requête pour l'API
  const queryParams = useMemo(() => {
    return {
      order: order,
      page: pagination.page + 1,
      take: pagination.take,
      search: search,
      status: statusFilter,
      countryId: countryFilter,
    };
  }, [
    order,
    pagination.page,
    pagination.take,
    search,
    statusFilter,
    countryFilter,
  ]);

  const {
    data: cities,
    isLoading,
    isPending,
    isRefetching,
    refetch,
  } = useAdminCities(queryParams);

  const tableData = useMemo(
    () => ({
      data: cities?.data as unknown as CityDataType[],
      meta: cities?.meta as MetaType,
      isLoading,
      isPending,
      paginationParams: pagination,
      setPaginationParams: setPagination,
    }),
    [cities?.data, cities?.meta, isLoading, isPending, pagination]
  );

  const table = useAdminCityTable(tableData);

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
    [resetToFirstPage]
  );

  const handleStatusFilterChange = useCallback(
    (value: string) => {
      setStatusFilter(value === "all" ? undefined : (value as CityStatus));
      resetToFirstPage();
    },
    [resetToFirstPage]
  );

  const handleCountryFilterChange = useCallback(
    (value: string) => {
      setCountryFilter(value === "all" ? undefined : value);
      resetToFirstPage();
    },
    [resetToFirstPage]
  );

  const handleOrderChange = useCallback(
    (value: "ASC" | "DESC") => {
      setOrder(value);
      resetToFirstPage();
    },
    [resetToFirstPage]
  );

  const handleResetFilters = useCallback(() => {
    setSearch("");
    setStatusFilter(undefined);
    setCountryFilter(undefined);
    setOrder("DESC");
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
      countryFilter !== undefined ||
      order !== "DESC"
    );
  }, [search, statusFilter, countryFilter, order]);

  // Error handling
  if (cities?.status === "ERROR") {
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
          <h1 className="text-3xl font-bold text-foreground">
            Gestion des Villes
          </h1>
          <p className="text-muted-foreground">
            Gérez toutes les villes de la plateforme
          </p>
        </div>
        <AddAdminCity />
      </div>

      {/* Filtres de recherche */}
      <div className="flex flex-col gap-4 p-4 bg-muted/50 rounded-lg border">
        <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
          <Filter className="h-4 w-4" />
          Filtres de recherche
        </div>

        <div className="flex flex-col gap-4 lg:flex-row lg:items-end">
          {/* Barre de recherche */}
          <div className="flex-1">
            <label className="text-sm font-medium text-foreground">
              Rechercher
            </label>
            <div className="relative mt-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Rechercher par nom de ville..."
                value={search}
                onChange={(e) => handleSearchChange(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>

          <div className="flex-1 lg:max-w-[200px]">
            <label className="text-sm font-medium text-foreground">Ordre</label>
            <Select value={order} onValueChange={handleOrderChange}>
              <SelectTrigger className="mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="DESC">Décroissant</SelectItem>
                <SelectItem value="ASC">Croissant</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Filtre par pays */}
          <div className="flex-1 lg:max-w-[200px]">
            <label className="text-sm font-medium text-foreground">Pays</label>
            <Select
              value={countryFilter || "all"}
              onValueChange={handleCountryFilterChange}
            >
              <SelectTrigger className="mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les pays</SelectItem>
                {countries.map((country) => (
                  <SelectItem key={country.id} value={country.id}>
                    {country.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Filtre par statut */}
          <div className="flex-1 lg:max-w-[200px]">
            <label className="text-sm font-medium text-foreground">
              Statut
            </label>
            <Select
              value={statusFilter || "all"}
              onValueChange={handleStatusFilterChange}
            >
              <SelectTrigger className="mt-1">
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

          {/* Bouton reset */}
          {hasActiveFilters && (
            <Button
              variant="outline"
              onClick={handleResetFilters}
              className="flex items-center gap-2"
            >
              <X className="h-4 w-4" />
              Réinitialiser
            </Button>
          )}
        </div>
      </div>

      <div className="w-full">
        <RenderTable table={table} isLoading={isPending} />
      </div>
    </div>
  );
}
