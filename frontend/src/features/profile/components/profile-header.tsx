"use client";

import { useState } from "react";
import { UserProfile } from "@/lib/types/user.type";
import { ProfilePictureUpload } from "@/features/media/components/profile-picture-upload";
import { CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Mail, Phone, Calendar } from "lucide-react";
import { RoleDisplay } from "./role-display";

interface ProfileHeaderProps {
  user: UserProfile;
}

export function ProfileHeader({ user }: ProfileHeaderProps) {
  const [currentProfileImage, setCurrentProfileImage] = useState(user.profile);

  const userInitials =
    `${user.firstName?.charAt(0) || ""}${user.lastName?.charAt(0) || ""}`.toUpperCase();


  const handleImageUpdate = (newImagePath: string) => {
    setCurrentProfileImage(newImagePath);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("fr-FR", {
      year: "numeric",
      month: "long",
    });
  };

  return (
    <div>
      <CardContent className="relative p-6">
        <div className="flex flex-col sm:flex-row items-center gap-6">
          {/* Photo de profil */}
          <div className="relative">
            <ProfilePictureUpload
              currentImagePath={currentProfileImage}
              userInitials={userInitials}
              onImageUpdate={handleImageUpdate}
              className="relative"
            />
          </div>

          {/* Informations utilisateur */}
          <div className="flex-1 text-center sm:text-left space-y-3">
            {/* Nom et prénom */}
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white">
                {user.firstName} {user.lastName}
              </h1>
              <div className="h-1 w-24 bg-blue-500 rounded-full mt-2 mx-auto sm:mx-0"></div>
            </div>

            {/* Informations de contact avec icônes */}
            <div className="flex flex-col sm:flex-row gap-4 text-sm">
              <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                <Mail className="h-4 w-4 text-blue-500" />
                <span className="font-medium">{user.email}</span>
              </div>

              {user.phoneNumber && (
                <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                  <Phone className="h-4 w-4 text-green-500" />
                  <span className="font-medium">{user.phoneNumber}</span>
                </div>
              )}
            </div>

            {/* Badges et statut */}
            <div className="flex flex-wrap gap-2 justify-center sm:justify-start">
              <Badge
                variant="secondary"
                className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300 font-medium px-3 py-1"
              >
                {user.status}
              </Badge>

              {user.createdAt && (
                <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-3 py-1 rounded-full">
                  <Calendar className="h-3 w-3" />
                  <span>Membre depuis {formatDate(user.createdAt)}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </CardContent>
      <RoleDisplay role={user?.role} />
    </div>
  );
}
