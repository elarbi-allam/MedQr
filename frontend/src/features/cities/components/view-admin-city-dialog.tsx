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
import { CityDataType, CityStatus } from "../types/city.type";
import {
  MapPin,
  Globe,
  Flag,
  Calendar,
  CheckCircle,
  XCircle,
} from "lucide-react";

interface ViewAdminCityDialogProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  city: CityDataType;
}

const getStatusBadge = (status: CityStatus) => {
  switch (status) {
    case CityStatus.ACTIVE:
      return (
        <Badge
          variant="default"
          className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300 flex items-center gap-1"
        >
          <CheckCircle className="h-3 w-3" />
          ACTIF
        </Badge>
      );
    case CityStatus.INACTIVE:
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

export default function ViewAdminCityDialog({
  open,
  setOpen,
  city,
}: ViewAdminCityDialogProps) {
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto p-0">
        <DialogHeader className="p-4 bg-muted border-b">
          <div className="flex items-center gap-3">
            <Avatar className="h-12 w-12">
              <AvatarImage src={city.country.flag} alt={city.country.name} />
              <AvatarFallback className="bg-gradient-to-br from-brand to-primary text-brand-foreground">
                <MapPin className="h-6 w-6" />
              </AvatarFallback>
            </Avatar>
            <div>
              <DialogTitle className="text-xl">{city.name}</DialogTitle>
              <DialogDescription>
                Détails complets de la ville
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-4 p-4">
          <Card className="glass">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <MapPin className="h-5 w-5" />
                Informations de la ville
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="font-medium">Nom français:</span>
                  <p className="text-muted-foreground">{city.name}</p>
                </div>
                <div>
                  <span className="font-medium">Nom anglais:</span>
                  <p className="text-muted-foreground">{city.en_name}</p>
                </div>
              </div>

              <div>
                <span className="font-medium">Nom arabe:</span>
                <p className="text-muted-foreground text-right" dir="rtl">
                  {city.ar_name}
                </p>
              </div>

              <div>
                <span className="font-medium">Statut:</span>
                <div className="mt-1">{getStatusBadge(city.status)}</div>
              </div>
            </CardContent>
          </Card>

          <Card className="glass">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Globe className="h-5 w-5" />
                Informations du pays
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                <Avatar className="h-10 w-10">
                  <AvatarImage
                    src={city.country.flag}
                    alt={city.country.name}
                  />
                  <AvatarFallback>
                    <Flag className="h-5 w-5" />
                  </AvatarFallback>
                </Avatar>
                <div>
                  <div className="font-medium">{city.country.name}</div>
                  <div className="text-sm text-muted-foreground">
                    {city.country.en_name}
                  </div>
                </div>
                <div className="ml-auto">
                  <Badge variant="outline" className="font-mono">
                    {city.country.isoA3}
                  </Badge>
                </div>
              </div>

              <div>
                <span className="font-medium">Nom arabe du pays:</span>
                <p className="text-muted-foreground text-right" dir="rtl">
                  {city.country.ar_name}
                </p>
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
                <span className="font-medium">Créée le:</span>
                <span>
                  {new Date(city.createdAt).toLocaleDateString("fr-FR", {
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
                  {new Date(city.updatedAt).toLocaleDateString("fr-FR", {
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
