import { redirect } from "next/navigation";
import { isAdmin } from "@/features/auth/dal/role-checks";
import AdminUserDataTable from "@/features/admin/users/components/admin-user-data-table";

export default async function AdminUsersPage() {
  const userIsAdmin = await isAdmin();
  if (!userIsAdmin) {
    redirect("/unauthorized");
  }

  return (
    <div className="py-4">
      <AdminUserDataTable />
    </div>
  );
}