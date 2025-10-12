"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProfileDetailsForm } from "./profile-details-form";
import { ChangePasswordForm } from "./change-password-form";
import { UserProfile } from "@/lib/types/profile.type";

type ProfileTabsProps = {
  profile: UserProfile;
};

export function ProfileTabs({ profile }: ProfileTabsProps) {
  return (
    <Tabs defaultValue="details" className="w-full">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="details">Détails du profil</TabsTrigger>
        <TabsTrigger value="password">Sécurité</TabsTrigger>
      </TabsList>
      <TabsContent value="details">
        <ProfileDetailsForm profile={profile} />
      </TabsContent>
      <TabsContent value="password">
        <ChangePasswordForm />
      </TabsContent>
    </Tabs>
  );
}