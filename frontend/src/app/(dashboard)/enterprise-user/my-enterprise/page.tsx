import { redirect } from "next/navigation";
import { isEnterpriseUser } from "@/features/auth/dal/role-checks";
import MyEnterpriseForm from "@/features/enterprise/my-enterprise/components/my-enterprise-form";
import { isEnterpriseVerified } from "@/features/enterprise/verification/actions/verification-actions";

export default async function MyEnterprisePage() {
  const is_EnterpriseUser = await isEnterpriseUser();
  const isUserVerified = await isEnterpriseVerified();

  if (!is_EnterpriseUser) {
    return redirect("/unauthorized");
  }

  if (!isUserVerified) {
    return redirect("/verification");
  }

  return (
    <div className="py-4">
      <MyEnterpriseForm />
    </div>
  );
}
