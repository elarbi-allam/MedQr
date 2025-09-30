import { redirect } from "next/navigation";
import { isAdmin } from "@/features/auth/dal/role-checks";
import AdminEnterpriseDataTable from "@/features/admin/enterprises/components/admin-enterprise-data-table";

export default async function AdminEnterprisesPage() {
  const userIsAdmin = await isAdmin();
  if (!userIsAdmin) {
    redirect("/unauthorized");
  }

  return (
    <div className="py-4">
      <AdminEnterpriseDataTable />
    </div>
  );
}