import { redirect } from "next/navigation";
import { isAdmin } from "@/features/auth/dal/role-checks";
import AdminTrucksDataTable from "@/features/trucks/components/admin-trucks-data-table";

export default async function AdminTrucksPage() {
  const userIsAdmin = await isAdmin();
  if (!userIsAdmin) {
    redirect("/unauthorized");
  }

  return (
    <div className="py-4">
      <AdminTrucksDataTable />
    </div>
  );
}