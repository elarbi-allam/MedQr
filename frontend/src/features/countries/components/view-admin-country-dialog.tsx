"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { CountryDataType, CountryStatus } from "../types/country.type";
import {
  Flag,
  Globe,
  Hash,
  Phone,
  Calendar,
  CheckCircle,
  XCircle,
} from "lucide-react";

interface ViewAdminCountryDialogProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  country: CountryDataType;
}

const getStatusBadge = (status: CountryStatus) => {
  switch (status) {
    case CountryStatus.ACTIVE:
      return (
        <Badge
          variant="default"
          className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300 flex items-center gap-1"
        >
          <CheckCircle className="h-3 w-3" />
          ACTIF
        </Badge>
      );
    case CountryStatus.INACTIVE:
      return (
        <Badge
          variant="destructive"
          className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300 flex items-center gap-1"
        >
          <XCircle className="h-3 w-3" />
          INACTIF
        </Badge>
      );
    default:
      return <Badge variant="secondary">INCONNU</Badge>;
  }
};

export default function ViewAdminCountryDialog({
  open,
  setOpen,
  country,
}: ViewAdminCountryDialogProps) {
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto p-0">
        <DialogHeader className="p-4 bg-muted border-b">
          <div className="flex items-center gap-3">
            <Avatar className="h-12 w-12">
              <AvatarImage src={country.flag} alt={country.name} />
              <AvatarFallback className="bg-gradient-to-br from-brand to-primary text-brand-foreground">
                <Flag className="h-6 w-6" />
              </AvatarFallback>
            </Avatar>
            <div>
              <DialogTitle className="text-xl">{country.name}</DialogTitle>
              <DialogDescription>Détails complets du pays</DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-4 p-4">
          <Card className="glass">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Globe className="h-5 w-5" />
                Informations générales
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="font-medium">Nom français:</span>
                  <p className="text-muted-foreground">{country.name}</p>
                </div>
                <div>
                  <span className="font-medium">Nom anglais:</span>
                  <p className="text-muted-foreground">{country.en_name}</p>
                </div>
              </div>

              <div>
                <span className="font-medium">Nom arabe:</span>
                <p className="text-muted-foreground text-right" dir="rtl">
                  {country.ar_name}
                </p>
              </div>

              <div>
                <span className="font-medium">Statut:</span>
                <div className="mt-1">{getStatusBadge(country.status)}</div>
              </div>
            </CardContent>
          </Card>

          <Card className="glass">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Hash className="h-5 w-5" />
                Codes et identifiants
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <span className="font-medium">Code ISO A3:</span>
                <span className="font-mono bg-muted px-2 py-1 rounded text-sm">
                  {country.isoA3}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Numéro ISO:</span>
                <span className="font-mono bg-muted px-2 py-1 rounded text-sm">
                  {country.isoNum}
                </span>
              </div>
            </CardContent>
          </Card>

          <Card className="glass">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Phone className="h-5 w-5" />
                Communication
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <span className="font-medium">Indicatif téléphonique:</span>
                <span className="font-mono bg-muted px-2 py-1 rounded text-sm">
                  {country.dialCode}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Drapeau:</span>
                <Avatar className="h-8 w-8">
                  <AvatarImage
                    src={country.flag}
                    alt={`Drapeau ${country.name}`}
                  />
                  <AvatarFallback>
                    <Flag className="h-4 w-4" />
                  </AvatarFallback>
                </Avatar>
              </div>
            </CardContent>
          </Card>

          <Card className="glass">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Calendar className="h-5 w-5" />
                Dates importantes
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <span className="font-medium">Créé le:</span>
                <span>
                  {new Date(country.createdAt).toLocaleDateString("fr-FR", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Dernière modification:</span>
                <span>
                  {new Date(country.updatedAt).toLocaleDateString("fr-FR", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
}
