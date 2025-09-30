import { redirect } from "next/navigation";
import { checkEnterpriseType } from "@/features/trucks/dal/enterpriseType-check";
import MyTrucksDataTable from "@/features/trucks/components/my-trucks-data-table";
import { EnterpriseType } from "@/features/admin/enterprises/types/enterprise.type";

export default async function TrucksPage() {
  const isUserCarrier = await checkEnterpriseType(EnterpriseType.CARRIER);
  if (!isUserCarrier) {
    redirect("/unauthorized");
  }

  return (
    <div className="py-4">
      <MyTrucksDataTable />
    </div>
  );
}
