import { redirect } from "next/navigation";
import { isProvider } from "@/features/auth/dal/role-checks";
import ProviderVaccinationsOverview from "@/features/medical-records/components/provider/provider-vaccinations-overview";

export default async function ProviderVaccinationsPage() {
    const isUserProvider = await isProvider();

    if (!isUserProvider) {
        return redirect("/unauthorized");
    }

    return (
        <div className="container mx-auto py-6">
            <ProviderVaccinationsOverview />
        </div>
    );
}