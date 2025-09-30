import { redirect } from "next/navigation";
import { checkEnterpriseType } from "@/features/trucks/dal/enterpriseType-check";
import { EnterpriseType } from "@/features/admin/enterprises/types/enterprise.type";
import TruckDocuments from "@/features/documents/components/enterprise/truck-documents";
import { isEnterpriseVerified } from "@/features/enterprise/verification/actions/verification-actions";

export default async function TruckDocumentsPage() {
  const isUserCarrier = await checkEnterpriseType(EnterpriseType.CARRIER);
  const isUserVerified = await isEnterpriseVerified();

  if (!isUserVerified) {
    return redirect("/verification");
  }
  if (!isUserCarrier) {
    redirect("/unauthorized");
  }

  return (
    <div className="py-4">
      <TruckDocuments />
    </div>
  );
}
