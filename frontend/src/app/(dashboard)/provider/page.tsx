import { redirect } from "next/navigation";
import { isProvider } from "@/features/auth/dal/role-checks";
import ProviderDashboardStats from "@/features/medical-records/components/provider/provider-dashboard-stats";

export default async function ProviderDashboardPage() {
    const isUserProvider = await isProvider();

    if (!isUserProvider) {
        return redirect("/unauthorized");
    }

    return (
        <div className="container mx-auto py-6">
            <ProviderDashboardStats />
        </div>
    );
}