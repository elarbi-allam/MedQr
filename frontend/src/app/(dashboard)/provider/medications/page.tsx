import { redirect } from "next/navigation";
import { isProvider } from "@/features/auth/dal/role-checks";
import ProviderMedicationsOverview from "@/features/medical-records/components/provider/provider-medications-overview";

export default async function ProviderMedicationsPage() {
    const isUserProvider = await isProvider();

    if (!isUserProvider) {
        return redirect("/unauthorized");
    }

    return (
        <div className="container mx-auto py-6">
            <ProviderMedicationsOverview />
        </div>
    );
}