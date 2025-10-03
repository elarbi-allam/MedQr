//frontend\src\app\(auth)\login\page.tsx
import { redirect } from "next/navigation";
import { getUserRole } from "@/features/auth/dal/user";
import { UserRole } from "@/lib/types/user.type";
import LoginForm from "@/features/auth/components/login-form";

export default async function LoginPage() {
  const userRole = await getUserRole();

  if (userRole) {
    switch (userRole) {
      case UserRole.PATIENT:
        return redirect("/patient");
      case UserRole.PROVIDER:
        return redirect("/provider");
      case UserRole.FACILITY:
        return redirect("/facility");
      default:
        return redirect("/");
    }
  }

  return <LoginForm />;
}
