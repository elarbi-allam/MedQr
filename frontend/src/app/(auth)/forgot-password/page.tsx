import { redirect } from "next/navigation";
import { getUserRole } from "@/features/auth/dal/user";
import { UserRole } from "@/lib/types/user.type";
import ForgotPasswordForm from "@/features/auth/components/forgot-password-form";

export default async function ForgotPasswordPage() {
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

    return <ForgotPasswordForm />;
}
