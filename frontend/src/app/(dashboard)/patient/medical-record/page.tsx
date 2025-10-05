import { redirect } from "next/navigation";
import { isPatient } from "@/features/auth/dal/role-checks";
import PatientDocumentsList from "@/features/medical-records/components/patient/patient-documents-list";

export default async function PatientMedicalRecordPage() {
    const isUserPatient = await isPatient();

    if (!isUserPatient) {
        return redirect("/unauthorized");
    }

    return (
        <div className="container mx-auto py-6">
            <PatientDocumentsList />
        </div>
    );
}
