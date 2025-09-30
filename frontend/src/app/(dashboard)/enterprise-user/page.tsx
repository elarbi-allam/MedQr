import { redirect } from "next/navigation";
import { isEnterpriseUser } from "@/features/auth/dal/role-checks";
import { isEnterpriseVerified } from "@/features/enterprise/verification/actions/verification-actions";

export default async function EnterpriseUserDashboardPage() {
  const is_EnterpriseUser = await isEnterpriseUser();
  const isUserVerified = await isEnterpriseVerified();

  if (!is_EnterpriseUser) {
    return redirect("/unauthorized");
  }

  if (!isUserVerified) {
    return redirect("/verification");
  }

  return <p>C&apos;est le tableau de bord de l&apos;utilisateur entreprise.</p>;
}
