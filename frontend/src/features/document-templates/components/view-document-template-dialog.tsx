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
import { DocumentTemplateDataType, AppliesTo, EnterpriseType, DocumentTemplateStatus } from "../types/document-template.type";
import {
  FileText,
  Building2,
  Truck,
  Calendar,
  CheckCircle,
  XCircle,
  Tag,
  Hash
} from "lucide-react";

interface ViewDocumentTemplateDialogProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  template: DocumentTemplateDataType;
}

const getStatusBadge = (status: DocumentTemplateStatus) => {
  switch (status) {
    case DocumentTemplateStatus.ACTIVE:
      return (
        <Badge variant="default" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300 flex items-center gap-1">
          <CheckCircle className="h-3 w-3" />
          ACTIF
        </Badge>
      );
    case DocumentTemplateStatus.INACTIVE:
      return (
        <Badge variant="destructive" className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300 flex items-center gap-1">
          <XCircle className="h-3 w-3" />
          INACTIF
        </Badge>
      );
    default:
      return <Badge variant="secondary">INCONNU</Badge>;
  }
};

const getAppliesToBadge = (appliesTo: AppliesTo) => {
  switch (appliesTo) {
    case AppliesTo.ENTERPRISE:
      return (
        <Badge variant="secondary" className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300 flex items-center gap-1">
          <Building2 className="h-3 w-3" />
          ENTREPRISE
        </Badge>
      );
    case AppliesTo.TRUCK:
      return (
        <Badge variant="secondary" className="bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300 flex items-center gap-1">
          <Truck className="h-3 w-3" />
          CAMION
        </Badge>
      );
    default:
      return <Badge variant="secondary">INCONNU</Badge>;
  }
};

const getEnterpriseTypeBadge = (enterpriseType: EnterpriseType | null) => {
  if (!enterpriseType) {
    return (
      <Badge variant="outline" className="text-muted-foreground">
        TOUS LES TYPES
      </Badge>
    );
  }

  switch (enterpriseType) {
    case EnterpriseType.CARRIER:
      return (
        <Badge variant="secondary" className="bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300">
          TRANSPORTEUR
        </Badge>
      );
    case EnterpriseType.SHIPPER:
      return (
        <Badge variant="secondary" className="bg-teal-100 text-teal-800 dark:bg-teal-900 dark:text-teal-300">
          EXPÉDITEUR
        </Badge>
      );
    default:
      return <Badge variant="secondary">INCONNU</Badge>;
  }
};

export default function ViewDocumentTemplateDialog({ 
  open, 
  setOpen, 
  template 
}: ViewDocumentTemplateDialogProps) {
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[500px] max-h-[80vh] overflow-y-auto p-0">
        <DialogHeader className="p-4 bg-muted border-b">
          <DialogTitle>Détails du modèle de document</DialogTitle>
          <DialogDescription>
            Informations complètes sur le modèle de document sélectionné.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 p-4">
          <Card className="glass">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <FileText className="h-5 w-5" />
                Informations générales
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <span className="font-medium">Nom:</span>
                <span>{template.name}</span>
              </div>

              <div className="flex justify-between items-center">
                <span className="font-medium flex items-center gap-2">
                  <Hash className="h-4 w-4" />
                  Nom du champ:
                </span>
                <code className="px-2 py-1 bg-muted rounded text-sm">{template.fieldname}</code>
              </div>

              <div className="flex justify-between items-start">
                <span className="font-medium">Description:</span>
                <span className="text-right max-w-[250px]">{template.description}</span>
              </div>

              <div className="flex justify-between items-center">
                <span className="font-medium">Statut:</span>
                {getStatusBadge(template.status)}
              </div>
            </CardContent>
          </Card>

          <Card className="glass">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Tag className="h-5 w-5" />
                Configuration
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="font-medium">S&apos;applique à:</span>
                {getAppliesToBadge(template.appliesTo)}
              </div>

              <div className="flex justify-between items-center">
                <span className="font-medium">Type d&apos;entreprise:</span>
                {getEnterpriseTypeBadge(template.enterpriseType)}
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
                <span>{new Date(template.createdAt).toLocaleDateString("fr-FR", {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Dernière modification:</span>
                <span>{new Date(template.updatedAt).toLocaleDateString("fr-FR", {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
}