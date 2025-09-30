import { z } from "zod";
import { ORDER_OPTIONS } from "@/lib/enums/order";

// Enums pour les document templates
export enum AppliesTo {
  ENTERPRISE = "ENTERPRISE",
  TRUCK = "TRUCK",
}

export enum EnterpriseType {
  CARRIER = "CARRIER",
  SHIPPER = "SHIPPER",
}

export enum DocumentTemplateStatus {
  ACTIVE = "active",
  INACTIVE = "inactive",
}

export type DocumentTemplateParams = {
  order: z.infer<typeof ORDER_OPTIONS>;
  page: number;
  take: number;
  search: string;
  appliesTo?: AppliesTo;
  enterpriseType?: EnterpriseType;
  status?: DocumentTemplateStatus;
};

export type DocumentTemplateDataType = {
  id: string;
  createdAt: string;
  updatedAt: string;
  name: string;
  fieldname: string;
  description: string;
  appliesTo: AppliesTo;
  enterpriseType: EnterpriseType | null;
  status: DocumentTemplateStatus;
  documents?: unknown[];
};

export type CreateDocumentTemplateDTO = {
  name: string;
  fieldname: string;
  description: string;
  appliesTo: AppliesTo;
  enterpriseType: EnterpriseType | null;
};

export type UpdateDocumentTemplateDTO = {
  id: string;
  name?: string;
  fieldname?: string;
  description?: string;
  appliesTo?: AppliesTo;
  enterpriseType?: EnterpriseType | null;
  status?: DocumentTemplateStatus;
};
