"use client";

import { UserProfile } from "@/lib/types/profile.type";
import { ProfileTabs } from "./profile-tabs";
import { ProfileHeader } from "./profile-header";
import { useCurrentUser } from "../hooks/use-profile";

type ProfileClientUIProps = {
  initialData: UserProfile;
};

export function ProfileClientUI({ initialData }: ProfileClientUIProps) {
  const { data: currentUser, isLoading } = useCurrentUser();
  const user = currentUser || initialData;

  if (isLoading && !initialData) {
    return <div>Chargement...</div>;
  }

  return (
    <div className="space-y-6">
      <ProfileHeader user={user} />
      <ProfileTabs profile={user} />
    </div>
  );
}