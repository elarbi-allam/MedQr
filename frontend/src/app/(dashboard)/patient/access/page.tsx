import { redirect } from "next/navigation";
import { isPatient } from "@/features/auth/dal/role-checks";
import AccessManagement from "@/features/medical-records/components/patient/access-management";

export default async function PatientAccessPage() {
    const isUserPatient = await isPatient();

    if (!isUserPatient) {
        return redirect("/unauthorized");
    }

    return (
        <div className="container mx-auto py-6">
            <AccessManagement />
        </div>
    );
}
