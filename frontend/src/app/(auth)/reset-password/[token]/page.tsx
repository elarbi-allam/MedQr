import { redirect } from "next/navigation";
import { getUserRole } from "@/features/auth/dal/user";
import { UserRole } from "@/lib/types/user.type";
import { validateResetToken } from "@/features/auth/actions/validate-reset-token";
import ResetPasswordView from "@/features/auth/components/reset-password-view";

type PageProps = {
    params: Promise<{ token: string }>;
};

export default async function ResetPasswordPage(props: PageProps) {
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
    const params = await props.params;

    const token = params.token;

    const validationResult = await validateResetToken(token);

    return (
        <ResetPasswordView token={token} isTokenValid={validationResult.isValid} message={validationResult.message} />
    );
}
