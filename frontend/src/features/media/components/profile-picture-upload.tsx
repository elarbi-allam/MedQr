"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Camera, Upload, X } from "lucide-react";
import { toast } from "sonner";
import { useUploadMedia } from "../hooks/use-media";
import { getMediaUrl } from "../utils/media-utils";
import { useUpdateProfile } from "@/features/profile/hooks/use-profile";

interface ProfilePictureUploadProps {
  currentImagePath?: string;
  userInitials: string;
  onImageUpdate?: (newImagePath: string) => void;
  className?: string;
}

export function ProfilePictureUpload({
  currentImagePath,
  userInitials,
  onImageUpdate,
  className = "",
}: ProfilePictureUploadProps) {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { mutate: uploadMedia, isPending: isUploading } = useUploadMedia();
  const { mutate: updateProfile, isPending: isUpdatingProfile } =
    useUpdateProfile();

  const isLoading = isUploading || isUpdatingProfile;

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Vérifier le type de fichier
      if (!file.type.startsWith("image/")) {
        toast.error("Veuillez sélectionner un fichier image valide");
        return;
      }

      // Vérifier la taille (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error("La taille de l'image ne doit pas dépasser 5MB");
        return;
      }

      setSelectedFile(file);

      // Créer un aperçu
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreviewUrl(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpload = () => {
    if (!selectedFile) return;

    const formData = new FormData();
    formData.append("media", selectedFile);
    formData.append("title", `Photo de profil - ${userInitials}`);
    formData.append("altText", `Photo de profil de l'utilisateur`);
    formData.append("caption", "Photo de profil");

    // 1. Upload du media
    uploadMedia(formData, {
      onSuccess: (response) => {
        if (response.status === "SUCCESS" && response.data) {
          const newFilePath = response.data.filePath;

          // 2. Update du profile avec le filePath retourné
          updateProfile(
            {
              profile: newFilePath,
            },
            {
              onSuccess: () => {
                // 3. Mettre à jour l'image localement pour éviter le refresh
                if (onImageUpdate) {
                  onImageUpdate(newFilePath);
                }

                // 4. Cleanup après succès
                setPreviewUrl(null);
                setSelectedFile(null);
                if (fileInputRef.current) {
                  fileInputRef.current.value = "";
                }
              },
            }
          );
        }
      },
    });
  };

  const handleCancel = () => {
    setPreviewUrl(null);
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className={`relative flex flex-col items-center ${className}`}>
      {/* Avatar principal */}
      <div className="relative">
        <Avatar className="h-20 w-20 border-4 border-white dark:border-gray-800 shadow-lg">
          <AvatarImage
            src={
              previewUrl ||
              (currentImagePath ? getMediaUrl(currentImagePath) : undefined)
            }
            alt="Photo de profil"
            className="object-cover"
          />
          <AvatarFallback className="text-lg font-bold bg-gray-300 text-gray-700">
            {userInitials}
          </AvatarFallback>
        </Avatar>

        {/* Overlay hover avec icône */}
        <div
          className="absolute inset-0 bg-black/40 rounded-full opacity-0 hover:opacity-100 transition-opacity duration-200 cursor-pointer flex items-center justify-center"
          onClick={() => fileInputRef.current?.click()}
        >
          <Camera className="h-6 w-6 text-white" />
        </div>

        {/* Badge de statut upload */}
        {isLoading && (
          <div className="absolute -bottom-1 -right-1 h-6 w-6 bg-blue-500 rounded-full flex items-center justify-center">
            <div className="h-3 w-3 bg-white rounded-full"></div>
          </div>
        )}
      </div>

      {/* Input file caché */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
      />

      {/* Actions avec positionnement relatif et marge */}
      {selectedFile && (
        <div className="mt-4 flex space-x-2 justify-center w-full">
          <Button
            onClick={handleUpload}
            disabled={isLoading}
            size="sm"
            className="h-9 px-4 bg-green-500 hover:bg-green-600 text-white border-0 font-medium"
          >
            <Upload className="h-4 w-4" />
            {isLoading ? "Chargement..." : "✓"}
          </Button>
          <Button
            onClick={handleCancel}
            variant="outline"
            size="sm"
            className="h-9 px-4 bg-white hover:bg-gray-100 border-gray-300 font-medium"
            disabled={isLoading}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
}
