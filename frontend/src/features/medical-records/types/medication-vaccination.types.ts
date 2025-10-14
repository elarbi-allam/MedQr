export type MedicationType = {
    medicationId: string;
    name: string;
    dosage: string;
    frequency: string;
    startDate: string;
    endDate: string;
    isCurrent: boolean;
    prescribedByName: string;
};

export type VaccinationType = {
    vaccinationId: string;
    vaccineName: string;
    vaccinationDate: string;
    administeredByName: string;
    facilityName: string | null;
};

export type MedicationFormData = {
    name: string;
    dosage: string;
    frequency: string;
    startDate: string;
    endDate: string;
    isCurrent: boolean;
};

export type VaccinationFormData = {
    vaccineName: string;
    vaccinationDate: string;
};