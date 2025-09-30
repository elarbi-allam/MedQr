import { redirect, notFound } from "next/navigation";
import { isAdmin } from "@/features/auth/dal/role-checks";
import AdminEnterpriseDetailView from "@/features/admin/enterprises/components/admin-enterprise-detail-view";

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function AdminEnterpriseDetailPage(props: PageProps) {
  const userIsAdmin = await isAdmin();
  if (!userIsAdmin) {
    redirect("/unauthorized");
  }

  const params = await props.params;
  const enterpriseId = params.id;
  if (!enterpriseId) {
    notFound();
  }

  return (
    <div className="py-4">
      <AdminEnterpriseDetailView enterpriseId={enterpriseId} />
    </div>
  );
}
