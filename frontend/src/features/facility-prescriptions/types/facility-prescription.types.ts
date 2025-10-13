// frontend/src/features/facility-prescriptions/types/facility-prescription.types.ts
export enum FacilityRequestStatus {
    PENDING = "PENDING",
    APPROVED = "APPROVED",
    REJECTED = "REJECTED",
}
export type FacilityAccessRequest = {
    estimatedDelay: string;
    estimatedPrice: number;
    prescriptionDetails?: string;
};

export type FacilityAccessCodeResponse = {
    accessCode: string;
    expiresAt: string;
    prescriptionDetails: string;
};

export type FacilityPrescriptionRequestResponse = {
    requestId: string;
    facilityName: string;
    prescriptionDetails: string;
    status: FacilityRequestStatus;
    requestedAt: string;
    estimatedDelay: string;
    estimatedPrice: number;
};

export type PrescriptionDetailResponse = {
    prescriptionId: string;
    details: string;
    prescriptionDate: string;
    isCompleted: boolean;
    completedAt: string | null;
    patientId: string;
    patientFirstName: string;
    patientLastName: string;
    patientDateOfBirth: string;
    providerId: string;
    providerFirstName: string;
    providerLastName: string;
    providerSpecialty: string;
    relatedDocumentId: string;
    documentTitle: string;
    documentType: string;
    documentUploadDate: string;
};

export type FacilityPrescriptionRequestRequest = {
    estimatedDelay: string;
    estimatedPrice: number;
};

export type PaginatedResponse<T> = {
    content: T[];
    pageable: {
        pageNumber: number;
        pageSize: number;
        sort: {
            empty: boolean;
            sorted: boolean;
            unsorted: boolean;
        };
        offset: number;
        paged: boolean;
        unpaged: boolean;
    };
    last: boolean;
    totalPages: number;
    totalElements: number;
    size: number;
    number: number;
    sort: {
        empty: boolean;
        sorted: boolean;
        unsorted: boolean;
    };
    first: boolean;
    numberOfElements: number;
    empty: boolean;
};