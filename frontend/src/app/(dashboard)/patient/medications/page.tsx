import { redirect } from "next/navigation";
import { isPatient } from "@/features/auth/dal/role-checks";
import MyMedicationsList from "@/features/medical-records/components/patient/my-medications-list";

export default async function PatientMedicationsPage() {
    const isUserPatient = await isPatient();

    if (!isUserPatient) {
        return redirect("/unauthorized");
    }

    return (
        <div className="container mx-auto py-6">
            <MyMedicationsList />
        </div>
    );
}