import { redirect } from "next/navigation";
import { isAdmin } from "@/features/auth/dal/role-checks";
import AdminCountryDataTable from "@/features/countries/components/admin-country-data-table";

export default async function AdminCountriesPage() {
  const userIsAdmin = await isAdmin();
  if (!userIsAdmin) {
    redirect("/unauthorized");
  }

  return (
    <div className="py-4">
      <AdminCountryDataTable />
    </div>
  );
}
