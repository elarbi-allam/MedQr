import { redirect } from "next/navigation";
import RequiredDocuments from "@/features/documents/components/enterprise/required-documents";
import { isEnterpriseUser } from "@/features/auth/dal/role-checks";
import { isEnterpriseVerified } from "@/features/enterprise/verification/actions/verification-actions";

export default async function DocumentsPage() {
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
      <RequiredDocuments />
    </div>
  );
}
