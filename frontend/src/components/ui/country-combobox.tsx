"use client";

import { useState, useEffect } from "react";
import { Check, ChevronsUpDown, Globe, Loader2 } from "lucide-react";

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

import { useActiveCountries } from "@/features/countries/hooks/use-countries";
import { CountryDataType } from "@/features/countries/types/country.type";
import { CountryComboboxProps } from "@/lib/types/location.types";

const DEBOUNCE_DELAY = 500; // 500ms

export function CountryCombobox({
  value,
  onValueChange,
  placeholder = "Sélectionner un pays",
  disabled = false,
  error,
  className,
}: CountryComboboxProps) {
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

  // Hook pour récupérer les données
  const { data: countriesResponse, isLoading } =
    useActiveCountries(debouncedSearchTerm);
  const countries: CountryDataType[] = countriesResponse?.data?.data || [];

  // Trouver le pays sélectionné
  const selectedCountry = countries.find(
    (country: CountryDataType) => country.id === value
  );

  const handleSelect = (countryId: string) => {
    onValueChange(countryId);
    setOpen(false);
    setSearchTerm(""); // Réinitialiser la recherche
  };

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
    if (!newOpen) {
      setSearchTerm(""); // Réinitialiser la recherche à la fermeture
    }
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
              disabled && "opacity-50 cursor-not-allowed"
            )}
            disabled={disabled || isLoading}
          >
            {selectedCountry ? (
              <div className="flex items-center gap-2 truncate">
                <Globe className="h-4 w-4 shrink-0" />
                <span className="truncate">
                  {selectedCountry.name} ({selectedCountry.en_name})
                </span>
              </div>
            ) : (
              <span className="text-muted-foreground">
                {isLoading ? "Chargement..." : placeholder}
              </span>
            )}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>

        <PopoverContent className="w-full p-0" align="start">
          <Command>
            <CommandInput
              placeholder="Rechercher un pays..."
              value={searchTerm}
              onValueChange={setSearchTerm}
              disabled={isLoading}
            />

            <CommandList>
              <CommandEmpty>
                {isLoading ? (
                  <div className="flex items-center justify-center p-4">
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    Recherche en cours...
                  </div>
                ) : (
                  <div className="p-4 text-sm text-muted-foreground">
                    Aucun pays trouvé.
                  </div>
                )}
              </CommandEmpty>

              <CommandGroup>
                {countries.map((country: CountryDataType) => (
                  <CommandItem
                    key={country.id}
                    value={`${country.name} ${country.en_name}`}
                    onSelect={() => handleSelect(country.id)}
                    className="cursor-pointer"
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        value === country.id ? "opacity-100" : "opacity-0"
                      )}
                    />
                    <div className="flex items-center gap-2 truncate">
                      <Globe className="h-4 w-4 shrink-0" />
                      <span className="truncate">
                        {country.name} ({country.en_name})
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
