import { redirect } from "next/navigation";
import { isPatient } from "@/features/auth/dal/role-checks";
import MyVaccinationsList from "@/features/medical-records/components/patient/my-vaccinations-list";

export default async function PatientVaccinationsPage() {
    const isUserPatient = await isPatient();

    if (!isUserPatient) {
        return redirect("/unauthorized");
    }

    return (
        <div className="container mx-auto py-6">
            <MyVaccinationsList />
        </div>
    );
}