import { redirect } from "next/navigation";
import { User } from "lucide-react";
import PageHeader from "@/components/page-header";
import { hasNoValidRole } from "@/features/auth/dal/role-checks";
import { getMyProfile } from "@/features/profile/actions/profile-actions";
import { ProfileClientUI } from "@/features/profile/components/profile-client-ui";
export default async function ProfilePage() {
  const isUserNotValid = await hasNoValidRole();
  if (!isUserNotValid) {
    redirect("/unauthorized");
  }
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
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <PageHeader icon={<User />} title="Mon Profil" />

      </div>

      <ProfileClientUI initialData={user} />
    </div>
  );
}
