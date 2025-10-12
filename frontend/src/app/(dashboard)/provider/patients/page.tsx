//frontend\src\app\(dashboard)\provider\patients\page.tsx
import { redirect } from "next/navigation";
import { isProvider } from "@/features/auth/dal/role-checks";
import ProviderPatientsList from "@/features/medical-records/components/provider/provider-patients-list";

export default async function ProviderPatientsPage() {
    const isUserProvider = await isProvider();

    if (!isUserProvider) {
        return redirect("/unauthorized");
    }

    return (
        <div className="container mx-auto py-6">
            <ProviderPatientsList />
        </div>
    );
}
