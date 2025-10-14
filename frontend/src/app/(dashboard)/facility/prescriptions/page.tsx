import { redirect } from "next/navigation";
import { isFacility } from "@/features/auth/dal/role-checks";
import FacilityDashboard from "@/features/facility-prescriptions/components/facility/facility-dashboard";

export default async function FacilityPrescriptionsPage() {
    const isUserFacility = await isFacility();

    if (!isUserFacility) {
        return redirect("/unauthorized");
    }

    return (
        <div className="container mx-auto py-6">
            <FacilityDashboard />
        </div>
    );
}
