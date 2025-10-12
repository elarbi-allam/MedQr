"use client";

import { UserProfile, UserType } from "@/lib/types/profile.type";
import { CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Mail, Phone, Building, Stethoscope, User } from "lucide-react";

interface ProfileHeaderProps {
  user: UserProfile;
}

export function ProfileHeader({ user }: ProfileHeaderProps) {
  const getDisplayName = () => {
    if (user.userType === UserType.FACILITY) {
      return user.name;
    }
    return `${user.firstName} ${user.lastName}`;
  };

  const getIcon = () => {
    switch (user.userType) {
      case UserType.PATIENT:
        return <User className="h-16 w-16 text-blue-500" />;
      case UserType.PROVIDER:
        return <Stethoscope className="h-16 w-16 text-green-500" />;
      case UserType.FACILITY:
        return <Building className="h-16 w-16 text-purple-500" />;
    }
  };

  const getUserTypeLabel = () => {
    switch (user.userType) {
      case UserType.PATIENT:
        return "Patient";
      case UserType.PROVIDER:
        return "Professionnel de santé";
      case UserType.FACILITY:
        return "Établissement";
    }
  };

  return (
    <CardContent className="p-6">
      <div className="flex flex-col sm:flex-row items-center gap-6">
        {/* Icône de profil */}
        <div className="flex-shrink-0 bg-gray-100 dark:bg-gray-800 rounded-full p-6">
          {getIcon()}
        </div>

        {/* Informations utilisateur */}
        <div className="flex-1 text-center sm:text-left space-y-3">
          {/* Nom */}
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white">
              {getDisplayName()}
            </h1>
            <div className="h-1 w-24 bg-blue-500 rounded-full mt-2 mx-auto sm:mx-0"></div>
          </div>

          {/* Badge du type d'utilisateur */}
          <Badge
            variant="secondary"
            className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300 font-medium px-3 py-1"
          >
            {getUserTypeLabel()}
          </Badge>

          {/* Informations de contact */}
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

          {/* Informations spécifiques */}
          {user.userType === UserType.PROVIDER && user.specialty && (
            <p className="text-sm text-gray-500">
              Spécialité: <span className="font-medium">{user.specialty}</span>
            </p>
          )}
          {user.userType === UserType.FACILITY && (
            <p className="text-sm text-gray-500">
              Type: <span className="font-medium">{user.type}</span>
            </p>
          )}
        </div>
      </div>
    </CardContent>
  );
}