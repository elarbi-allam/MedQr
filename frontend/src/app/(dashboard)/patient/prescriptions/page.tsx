// frontend/src/app/(dashboard)/patient/prescriptions/page.tsx
import { redirect } from "next/navigation";
import { isPatient } from "@/features/auth/dal/role-checks";
import PatientPrescriptionsTab from "@/features/medical-records/components/patient/patient-prescriptions-tab";

export default async function PatientPrescriptionsPage() {
    const isUserPatient = await isPatient();

    if (!isUserPatient) {
        return redirect("/unauthorized");
    }

    return (
        <div className="container mx-auto py-6">
            <PatientPrescriptionsTab />
        </div>
    );
}