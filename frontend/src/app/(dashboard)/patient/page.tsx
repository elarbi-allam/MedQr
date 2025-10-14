import { redirect } from "next/navigation";
import { isPatient } from "@/features/auth/dal/role-checks";
import PatientMedicalSummary from "@/features/medical-records/components/patient/patient-medical-summary";

export default async function PatientDashboardPage() {
    const isUserPatient = await isPatient();

    if (!isUserPatient) {
        return redirect("/unauthorized");
    }

    return (
        <div className="container mx-auto py-6">
            <PatientMedicalSummary />
        </div>
    );
}