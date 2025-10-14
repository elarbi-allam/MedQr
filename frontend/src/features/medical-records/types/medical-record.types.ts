export enum DocumentType {
    ANALYSIS = "ANALYSIS",
    SCAN = "SCAN",
    REPORT = "REPORT",
    PRESCRIPTION = "PRESCRIPTION",
    OTHER = "OTHER",
}

export enum DocumentSource {
    PATIENT = "PATIENT",
    PROVIDER = "PROVIDER",
    FACILITY = "FACILITY",
}

export enum AccessRequestStatus {
    PENDING = "PENDING",
    APPROVED = "APPROVED",
    REJECTED = "REJECTED",
    EXPIRED = "EXPIRED",
}

export type DocumentDataType = {
    documentId: string;
    title: string;
    type: DocumentType;
    uploadDate: string;
    source: DocumentSource;
    uploaderId: string;
    details: string;
    uploaderName?: string;
    mimeType?: string;
};

export type AccessRequestType = {
    requestId: string;
    providerName: string;
    providerSpecialty?: string;
    status: AccessRequestStatus;
    requestedAt: string;
    expiresAt: string;
};

export type QRCodeDataType = {
    accessCode: string;
    expiresAt: string;
    qrCodeImage: string | null;
};

export type PatientType = {
    patientId: string;
    firstName: string;
    lastName: string;
    dateOfBirth: string;
    phoneNumber?: string;
};

export type PrescriptionType = {
    prescriptionId: string;
    patientId: string;
    providerId: string;
    details: string;
    prescriptionDate: string;
    relatedDocumentId: string;
    isCompleted?: boolean | null;
    completedAt?: string;
};

// Nouveaux types pour la pagination
export type PageableType = {
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

export type PaginatedResponse<T> = {
    content: T[];
    pageable: PageableType;
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