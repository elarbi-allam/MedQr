"use client";

import { useState, useEffect } from "react";
import { Check, ChevronsUpDown, MapPin, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

import { useActiveCities } from "@/features/cities/hooks/use-cities";
import { CityDataType } from "@/features/cities/types/city.type";
import { CityComboboxProps } from "@/lib/types/location.types";

const DEBOUNCE_DELAY = 500; // 500ms

export function CityCombobox({
  value,
  onValueChange,
  countryId,
  placeholder = "Sélectionner une ville",
  disabled = false,
  error,
  className,
}: CityComboboxProps) {
  // États locaux pour la gestion de l'interface
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");

  // Debounce pour éviter trop d'appels API
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, DEBOUNCE_DELAY);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Reset de la ville sélectionnée quand le pays change
  useEffect(() => {
    if (value && countryId) {
      // Si une ville est sélectionnée, vérifier qu'elle appartient toujours au pays actuel
      // Cette logique pourrait être améliorée selon vos besoins
      setSearchTerm("");
    }
  }, [countryId, value]);

  // Hook pour récupérer les données
  const { data: citiesResponse, isLoading } = useActiveCities(
    countryId,
    debouncedSearchTerm
  );
  const cities: CityDataType[] = citiesResponse?.data?.data || [];

  // Trouver la ville sélectionnée
  const selectedCity = cities.find((city: CityDataType) => city.id === value);

  const handleSelect = (cityId: string) => {
    onValueChange(cityId);
    setOpen(false);
    setSearchTerm(""); // Réinitialiser la recherche
  };

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
    if (!newOpen) {
      setSearchTerm(""); // Réinitialiser la recherche à la fermeture
    }
  };

  // Déterminer l'état du composant
  const isDisabled = disabled || !countryId;
  const isCurrentlyLoading = isLoading && !!countryId;

  const getPlaceholderText = () => {
    if (!countryId) return "Sélectionnez d'abord un pays";
    if (isCurrentlyLoading) return "Chargement...";
    return placeholder;
  };

  return (
    <div className={cn("w-full", className)}>
      <Popover open={open} onOpenChange={handleOpenChange}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className={cn(
              "w-full justify-between",
              error && "border-red-500 focus:border-red-500",
              isDisabled && "opacity-50 cursor-not-allowed"
            )}
            disabled={isDisabled}
          >
            {selectedCity ? (
              <div className="flex items-center gap-2 truncate">
                <MapPin className="h-4 w-4 shrink-0" />
                <span className="truncate">
                  {selectedCity.name} ({selectedCity.en_name})
                </span>
              </div>
            ) : (
              <span className="text-muted-foreground">
                {getPlaceholderText()}
              </span>
            )}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>

        <PopoverContent className="w-full p-0" align="start">
          <Command>
            <CommandInput
              placeholder="Rechercher une ville..."
              value={searchTerm}
              onValueChange={setSearchTerm}
              disabled={isCurrentlyLoading}
            />

            <CommandList>
              <CommandEmpty>
                {isCurrentlyLoading ? (
                  <div className="flex items-center justify-center p-4">
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    Recherche en cours...
                  </div>
                ) : (
                  <div className="p-4 text-sm text-muted-foreground">
                    Aucune ville trouvée.
                  </div>
                )}
              </CommandEmpty>

              <CommandGroup>
                {cities.map((city: CityDataType) => (
                  <CommandItem
                    key={city.id}
                    value={`${city.name} ${city.en_name}`}
                    onSelect={() => handleSelect(city.id)}
                    className="cursor-pointer"
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        value === city.id ? "opacity-100" : "opacity-0"
                      )}
                    />
                    <div className="flex items-center gap-2 truncate">
                      <MapPin className="h-4 w-4 shrink-0" />
                      <span className="truncate">
                        {city.name} ({city.en_name})
                      </span>
                    </div>
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>

      {error && <p className="text-sm text-red-500 mt-1">{error}</p>}
    </div>
  );
}
