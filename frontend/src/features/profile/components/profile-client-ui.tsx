"use client";

import { UserProfile } from "@/lib/types/user.type";
import { ProfileTabs } from "./profile-tabs";
import { ProfileHeader } from "./profile-header";
import { useCurrentUser } from "../hooks/use-profile";

type ProfileClientUIProps = {
  initialData: UserProfile;
};

export function ProfileClientUI({ initialData }: ProfileClientUIProps) {
  // Utiliser useCurrentUser pour récupérer les données à jour
  const { data: currentUser, isLoading } = useCurrentUser();

  // Utiliser les données actuelles si disponibles, sinon les données initiales
  const user = currentUser || initialData;

  const profileData = {
    firstName: user.firstName || "",
    lastName: user.lastName || "",
    enterpriseName: user.enterprise?.name || "",
    phoneNumber: user.phoneNumber || "",
    email: user.email || "",
    role: user.role,
  };

  // Afficher un loader pendant le chargement (optionnel)
  if (isLoading && !initialData) {
    return <div>Chargement...</div>;
  }

  return (
    <div className="space-y-6">
      <ProfileHeader user={user} />
      <ProfileTabs profileData={profileData} />
    </div>
  );
}
