import { z } from "zod";
import { ORDER_OPTIONS } from "@/lib/enums/order";

// Enums pour les documents
export enum DocumentStatus {
  PENDING = "PENDING",
  ACCEPTED = "ACCEPTED",
  REJECTED = "REJECTED",
  EXPIRED = "EXPIRED",
}

export enum AppliesTo {
  ENTERPRISE = "ENTERPRISE",
  TRUCK = "TRUCK",
}

export enum EnterpriseType {
  CARRIER = "CARRIER",
  SHIPPER = "SHIPPER",
}

export type DocumentParams = {
  order?: z.infer<typeof ORDER_OPTIONS>;
  page?: number;
  take?: number;
  search?: string;
  status?: DocumentStatus;
};

export type DocumentTemplateType = {
  id: string;
  createdAt: string;
  updatedAt: string;
  name: string;
  fieldname: string;
  description: string;
  appliesTo: AppliesTo;
  enterpriseType: EnterpriseType | null;
  status: string;
};

export type EnterpriseDataType = {
  id: string;
  createdAt: string;
  updatedAt: string;
  name: string;
  description: string;
  ice: string;
  rc: string;
  enterpriseType: EnterpriseType;
  logo: string | null;
  status: string;
  verifiedAt: string;
};

export type TruckType = {
  id: string;
  createdAt: string;
  updatedAt: string;
  registrationNumber: string;
  maxWeight: string;
  truckType: {
    id: string;
    name: string;
    description: string;
    slug: string;
    icon: string;
    status: string;
  };
};

export type DocumentDataType = {
  id: string;
  createdAt: string;
  updatedAt: string;
  docName: string;
  mimeType?: string;
  path: string;
  status: DocumentStatus;
  expireAt: string | null;
  documentTemplate: DocumentTemplateType;
  enterprise: EnterpriseDataType;
  truck: TruckType | null;
  document_template_id?: string;
  enterprise_id?: string;
  truck_id?: string | null;
};

export type UpdateDocumentStatusDTO = {
  status: DocumentStatus;
};
