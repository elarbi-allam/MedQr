import { redirect } from "next/navigation";
import { isAdmin } from "@/features/auth/dal/role-checks";
import DocumentTemplateDataTable from "@/features/document-templates/components/document-template-data-table";

export default async function AdminDocumentTemplatesPage() {
  const userIsAdmin = await isAdmin();
  if (!userIsAdmin) {
    redirect("/unauthorized");
  }

  return (
    <div className="py-4">
      <DocumentTemplateDataTable />
    </div>
  );
}