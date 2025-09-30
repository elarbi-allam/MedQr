"use client";

import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { uploadMedia } from "../actions/media-actions";

export function useUploadMedia() {
  return useMutation({
    mutationFn: uploadMedia,
    onSuccess: (data) => {
      if (data?.status === "SUCCESS") {
        toast.success(data.message);
      } else {
        toast.error(data.message);
      }
    },
    onError: (error) => toast.error(error.message),
  });
}
