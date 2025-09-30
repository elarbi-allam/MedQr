export enum VerificationPhase {
  ACCOUNT_SETUP = 1,
  ENTERPRISE_CREATION = 2,
  DOCUMENT_UPLOAD = 3,
  VERIFICATION_PENDING = 4,
  VERIFIED = 5,
}

export interface VerificationStatus {
  phase: VerificationPhase;
  hasEnterprise: boolean;
  enterpriseStatus?: string;
  documentsUploaded: boolean;
  canAccessDashboard: boolean;
}
