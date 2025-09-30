import { redirect } from "next/navigation";
import { getUserRole } from "@/features/auth/dal/user";
import { UserRole } from "@/lib/types/user.type";
import ForgotPasswordForm from "@/features/auth/components/forgot-password-form";

export default async function ForgotPasswordPage() {
  const userRole = await getUserRole();

  if (userRole) {
    switch (userRole) {
      case UserRole.ADMIN:
        return redirect("/admin");
      case UserRole.ENTERPRISE_USER:
        return redirect("/enterprise-user");
      case UserRole.USER:
        return redirect("/user");
      default:
        return redirect("/");
    }
  }

  return <ForgotPasswordForm />;
}
