"use client";

import { useCallback, useMemo, useState } from "react";
import { Search, Filter, X } from "lucide-react";

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
import { useAdminTrucks } from "../hooks/use-trucks";
import { useTrucksTable } from "../hooks/use-trucks-table";
import { TruckDataType } from "../types/truck.type";
import { Loader2Icon, RotateCcwIcon, XIcon } from "lucide-react";
import { AdminTrucksColumns } from "./truck-columns";
import { useTruckTypeOptions } from "../../admin/truck-types/hooks/use-admin-truck-type";

export default function AdminTrucksDataTable() {
  const [search, setSearch] = useState<string>("");
  const [truckTypeFilter, setTruckTypeFilter] = useState<string | undefined>(
    undefined
  );
  const [enterpriseFilter, setEnterpriseFilter] = useState<string | undefined>(
    undefined
  );
  const [order, setOrder] = useState<"ASC" | "DESC">("DESC");

  const [pagination, setPagination] = useState<PaginationParams>({
    order: "DESC",
    page: 0,
    take: 10,
  });

  const queryParams = useMemo(() => {
    return {
      order: order,
      page: pagination.page + 1,
      take: pagination.take,
      search: search,
      truckTypeId: truckTypeFilter,
      enterpriseId: enterpriseFilter,
    };
  }, [order, pagination.page, pagination.take, search, truckTypeFilter, enterpriseFilter]);

  const {
    data: trucks,
    isLoading,
    isPending,
    isRefetching,
    refetch,
  } = useAdminTrucks(queryParams);

  const { data: truckTypesData } = useTruckTypeOptions();

  const tableData = useMemo(
    () => ({
      data: trucks?.data as unknown as TruckDataType[],
      meta: trucks?.meta as MetaType,
      isLoading,
      isPending,
      paginationParams: pagination,
      setPaginationParams: setPagination,
      columns: AdminTrucksColumns,
    }),
    [trucks?.data, trucks?.meta, isLoading, isPending, pagination]
  );

  const table = useTrucksTable(tableData);

  const resetToFirstPage = useCallback(() => {
    setPagination((prev) => ({
      ...prev,
      page: 0,
    }));
  }, []);

  const handleSearchChange = useCallback(
    (value: string) => {
      setSearch(value);
      resetToFirstPage();
    },
    [resetToFirstPage]
  );

  const handleTruckTypeFilterChange = useCallback(
    (value: string) => {
      setTruckTypeFilter(value === "all" ? undefined : value);
      resetToFirstPage();
    },
    [resetToFirstPage]
  );

  const handleEnterpriseFilterChange = useCallback(
    (value: string) => {
      setEnterpriseFilter(value === "all" ? undefined : value);
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
    setTruckTypeFilter(undefined);
    setEnterpriseFilter(undefined);
    setOrder("DESC");
    setPagination({
      order: "DESC",
      page: 0,
      take: 10,
    });
  }, []);

  const hasActiveFilters = useMemo(() => {
    return search !== "" || truckTypeFilter !== undefined || enterpriseFilter !== undefined || order !== "DESC";
  }, [search, truckTypeFilter, enterpriseFilter, order]);

  if (trucks?.status === "ERROR") {
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
            Gestion des Camions
          </h1>
          <p className="text-muted-foreground">
            Gérez tous les camions de la plateforme
          </p>
        </div>
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
                placeholder="Rechercher par immatriculation..."
                value={search}
                onChange={(e) => handleSearchChange(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>

          <div className="flex-1 lg:max-w-[150px]">
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

          {/* Filtre par type de camion */}
          <div className="flex-1 lg:max-w-[200px]">
            <label className="text-sm font-medium text-foreground">
              Type de camion
            </label>
            <Select
              value={truckTypeFilter || "all"}
              onValueChange={handleTruckTypeFilterChange}
            >
              <SelectTrigger className="mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les types</SelectItem>
                {truckTypesData?.data?.map((truckType) => (
                  <SelectItem key={truckType.id} value={truckType.id}>
                    <div className="flex items-center gap-2">
                      <span>{truckType.icon}</span>
                      <span>{truckType.name}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Filtre par entreprise */}
          <div className="flex-1 lg:max-w-[200px]">
            <label className="text-sm font-medium text-foreground">
              Entreprise
            </label>
            <Select
              value={enterpriseFilter || "all"}
              onValueChange={handleEnterpriseFilterChange}
            >
              <SelectTrigger className="mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Toutes les entreprises</SelectItem>
                {/* Vous pouvez ajouter ici une liste d'entreprises si nécessaire */}
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