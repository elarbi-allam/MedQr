import { redirect } from "next/navigation";
import { isAdmin } from "@/features/auth/dal/role-checks";
import AdminCityDataTable from "@/features/cities/components/admin-city-data-table";

export default async function AdminCitiesPage() {
  const userIsAdmin = await isAdmin();
  if (!userIsAdmin) {
    redirect("/unauthorized");
  }

  return (
    <div className="py-4">
      <AdminCityDataTable />
    </div>
  );
}
