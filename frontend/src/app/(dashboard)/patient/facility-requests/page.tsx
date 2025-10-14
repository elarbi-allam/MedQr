import { redirect } from "next/navigation";
import { isPatient } from "@/features/auth/dal/role-checks";
import FacilityRequestsManagement from "@/features/facility-prescriptions/components/patient/facility-requests-management";

export default async function PatientFacilityRequestsPage() {
    const isUserPatient = await isPatient();

    if (!isUserPatient) {
        return redirect("/unauthorized");
    }

    return (
        <div className="container mx-auto py-6">
            <FacilityRequestsManagement />
        </div>
    );
}