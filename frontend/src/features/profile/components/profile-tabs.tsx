"use client";

import { z } from "zod";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProfileDetailsForm } from "./profile-details-form";
import { ChangePasswordForm } from "./change-password-form";
import { updateProfileSchema } from "../schemas/profile-schemas";
import { UserRole } from "@/lib/types/user.type";

type ProfileTabsProps = {
  profileData: z.infer<typeof updateProfileSchema> & {
    email: string;
    enterpriseName: string;
    role: UserRole;
  };
};

export function ProfileTabs({ profileData }: ProfileTabsProps) {
  return (
    <Tabs defaultValue="details" className="w-full">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="details">Détails du profil</TabsTrigger>
        <TabsTrigger value="password">Sécurité</TabsTrigger>
      </TabsList>
      <TabsContent value="details">
        <ProfileDetailsForm defaultValues={profileData} />
      </TabsContent>
      <TabsContent value="password">
        <ChangePasswordForm />
      </TabsContent>
    </Tabs>
  );
}
