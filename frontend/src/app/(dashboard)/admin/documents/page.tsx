import { redirect } from "next/navigation";
import { isAdmin } from "@/features/auth/dal/role-checks";
import AdminDocumentsDataTable from "@/features/documents/components/admin/documents-data-table";

export default async function AdminDocumentsPage() {
  const userIsAdmin = await isAdmin();
  if (!userIsAdmin) {
    redirect("/unauthorized");
  }

  return (
    <div className="py-4">
      <AdminDocumentsDataTable />
    </div>
  );
}
