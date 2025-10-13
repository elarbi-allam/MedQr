import { redirect } from "next/navigation";
import { User } from "lucide-react";
import PageHeader from "@/components/page-header";
import { getMyProfile } from "@/features/profile/actions/profile-actions";
import { ProfileClientUI } from "@/features/profile/components/profile-client-ui";

export const dynamic = "force-dynamic";
export default async function ProfilePage() {
    const userResponse = await getMyProfile();

    if (userResponse.status === "ERROR") {
        redirect("/error");
    }

    const user = userResponse.data;
    if (!user) {
        redirect("/login");
    }

    return (
        <div className="flex flex-col gap-8 py-4">
            <PageHeader icon={<User />} title="Mon Profil" />
            <ProfileClientUI initialData={user} />
        </div>
    );
}
