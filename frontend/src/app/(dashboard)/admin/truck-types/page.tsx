import { redirect } from "next/navigation";
import { isAdmin } from "@/features/auth/dal/role-checks";
import AdminTruckTypeDataTable from "@/features/admin/truck-types/components/admin-truck-type-data-table";

export default async function AdminTruckTypesPage() {
  const userIsAdmin = await isAdmin();
  if (!userIsAdmin) {
    redirect("/unauthorized");
  }

  return (
    <div className="py-4">
      <AdminTruckTypeDataTable />
    </div>
  );
}
