"use client";

import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

import { login } from "../actions/login";
import { register } from "../actions/register";

import { resetPassword } from '../actions/reset-password';
import { requestPasswordReset } from '../actions/request-password-reset';


export function useLogin() {
  const router = useRouter();

  return useMutation({
    mutationFn: login,
    onSuccess: (data) => {
      if (data?.status === "SUCCESS" && data.data?.redirectPath) {
        toast.success(data.message);
        router.push(data.data.redirectPath);
        router.refresh();
      } else if (data?.status === "ERROR") {
        toast.error(data.message);
      }
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
}

export function useRegister() {
  const router = useRouter();

  return useMutation({
    mutationFn: register,
    onSuccess: (data) => {
      if (data?.status === "SUCCESS") {
        toast.success(data.message);
        router.push("/login");
      } else if (data?.status === "ERROR") {
        toast.error(data.message);
      }
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
}

export function useResetPassword() {
  const router = useRouter();
  return useMutation({
    mutationFn: resetPassword,
    onSuccess: (data) => {
      if (data?.status === 'SUCCESS') {
        toast.success(data.message);
        router.push('/login');
      } else {
        toast.error(data.message);
      }
    },
    onError: (error) => toast.error(error.message),
  });
}

export function useRequestPasswordReset() {
  return useMutation({
    mutationFn: requestPasswordReset,
    onSuccess: (data) => {
      if (data?.message) {
        toast.info(data.message);
      }
    },
    onError: (error) => {
      toast.error("Une erreur de communication est survenue.", {
        description: error instanceof Error ? error.message : "Veuillez réessayer.",
      });
    },
  });
}