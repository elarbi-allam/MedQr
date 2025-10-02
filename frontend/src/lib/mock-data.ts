export const mockPatients = [
  {
    patient_id: "1",
    user_id: "u1",
    first_name: "Sarah",
    last_name: "Johnson",
    date_of_birth: "1985-03-15",
    phone_number: "+1234567890",
    address: "123 Main St, New York, NY 10001",
  },
  {
    patient_id: "2",
    user_id: "u2",
    first_name: "Michael",
    last_name: "Chen",
    date_of_birth: "1990-07-22",
    phone_number: "+1234567891",
    address: "456 Oak Ave, Los Angeles, CA 90001",
  },
]

export const mockProviders = [
  {
    provider_id: "p1",
    user_id: "u3",
    first_name: "Dr. Emily",
    last_name: "Rodriguez",
    specialty: "Cardiology",
    license_number: "MD-12345",
  },
  {
    provider_id: "p2",
    user_id: "u4",
    first_name: "Dr. James",
    last_name: "Williams",
    specialty: "General Practice",
    license_number: "MD-12346",
  },
]

export const mockFacilities = [
  {
    facility_id: "f1",
    user_id: "u5",
    name: "City Medical Center",
    type: "Hospital",
    address: "789 Health Blvd, New York, NY 10002",
  },
  {
    facility_id: "f2",
    user_id: "u6",
    name: "LabCorp Diagnostics",
    type: "Laboratory",
    address: "321 Science Dr, Los Angeles, CA 90002",
  },
]

export const mockDocuments = [
  {
    document_id: "d1",
    record_id: "r1",
    type: "ANALYSIS",
    title: "Complete Blood Count",
    upload_date: "2024-01-15T10:30:00Z",
    file_path: "/documents/cbc-2024-01-15.pdf",
    is_from_Provider: false,
    facility_Or_Provider_id: "f2",
    is_verified: true,
  },
  {
    document_id: "d2",
    record_id: "r1",
    type: "SCAN",
    title: "Chest X-Ray",
    upload_date: "2024-01-20T14:15:00Z",
    file_path: "/documents/xray-chest-2024-01-20.pdf",
    is_from_Provider: false,
    facility_Or_Provider_id: "f1",
    is_verified: true,
  },
  {
    document_id: "d3",
    record_id: "r1",
    type: "PRESCRIPTION",
    title: "Medication Prescription",
    upload_date: "2024-01-25T09:00:00Z",
    file_path: "/documents/prescription-2024-01-25.pdf",
    is_from_Provider: true,
    facility_Or_Provider_id: "p1",
    is_verified: true,
  },
  {
    document_id: "d4",
    record_id: "r1",
    type: "REPORT",
    title: "Annual Physical Examination",
    upload_date: "2024-02-01T11:30:00Z",
    file_path: "/documents/physical-exam-2024-02-01.pdf",
    is_from_Provider: true,
    facility_Or_Provider_id: "p2",
    is_verified: true,
  },
]

export const mockPrescriptions = [
  {
    prescription_id: "pr1",
    patient_id: "1",
    provider_id: "p1",
    prescription_date: "2024-01-25",
    details: "Blood glucose test - Fasting blood sugar measurement",
    related_document_id: "d3",
  },
  {
    prescription_id: "pr2",
    patient_id: "1",
    provider_id: "p2",
    prescription_date: "2024-02-10",
    details: "MRI Scan - Brain imaging for headache evaluation",
    related_document_id: null,
  },
]

export const mockActionItems = [
  {
    action_id: "a1",
    patient_id: "1",
    prescription_id: "pr1",
    request_access_id: null,
    target_facility_id: "f2",
    agreement_status: "COMPLETED",
    completion_date: "2024-01-28T08:00:00Z",
    resulting_document_id: "d1",
  },
  {
    action_id: "a2",
    patient_id: "1",
    prescription_id: "pr2",
    request_access_id: null,
    target_facility_id: "f1",
    agreement_status: "AGREED",
    completion_date: null,
    resulting_document_id: null,
  },
]

export const mockTemporaryAccess = [
  {
    access_id: "ta1",
    patient_id: "1",
    requester_facility_id: null,
    requester_provider_id: "p1",
    qr_code_key: "QR-ABC123XYZ",
    generated_at: "2024-01-15T09:00:00Z",
    expires_at: "2024-01-15T17:00:00Z",
    status: "EXPIRED",
  },
  {
    access_id: "ta2",
    patient_id: "1",
    requester_facility_id: "f1",
    requester_provider_id: null,
    qr_code_key: "QR-DEF456UVW",
    generated_at: "2024-02-01T10:00:00Z",
    expires_at: "2024-02-01T18:00:00Z",
    status: "ACTIVE",
  },
]

export const mockMedications = [
  {
    medication_id: "m1",
    record_id: "r1",
    name: "Lisinopril",
    dosage: "10mg",
    frequency: "Once daily",
    start_date: "2023-06-01",
    end_date: null,
    is_current: true,
  },
  {
    medication_id: "m2",
    record_id: "r1",
    name: "Metformin",
    dosage: "500mg",
    frequency: "Twice daily",
    start_date: "2023-08-15",
    end_date: null,
    is_current: true,
  },
]

export const mockVaccinations = [
  {
    vaccination_id: "v1",
    record_id: "r1",
    vaccine_name: "COVID-19 (Pfizer)",
    vaccination_date: "2023-09-15",
    administering_facility_id: "f1",
  },
  {
    vaccination_id: "v2",
    record_id: "r1",
    vaccine_name: "Influenza",
    vaccination_date: "2023-10-01",
    administering_facility_id: "f1",
  },
]

export const mockMedicalHistory = [
  {
    history_id: "h1",
    record_id: "r1",
    type: "CHRONIC_DISEASE",
    condition: "Hypertension",
    diagnosed_date: "2020-03-15",
    notes: "Well controlled with medication",
  },
  {
    history_id: "h2",
    record_id: "r1",
    type: "ALLERGY",
    condition: "Penicillin",
    diagnosed_date: "1995-05-20",
    notes: "Severe allergic reaction - avoid all penicillin-based antibiotics",
  },
]
