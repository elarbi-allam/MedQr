export interface CountryComboboxProps {
  value: string;
  onValueChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  error?: string;
  className?: string;
}

export interface CityComboboxProps {
  value: string;
  onValueChange: (value: string) => void;
  countryId?: string;
  placeholder?: string;
  disabled?: boolean;
  error?: string;
  className?: string;
}
