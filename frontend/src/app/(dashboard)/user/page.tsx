import { redirect } from "next/navigation";
import { isUser } from "@/features/auth/dal/role-checks";

export default async function UserDashboardPage() {
  const isUserRole = await isUser();

  if (!isUserRole) {
    return redirect("/unauthorized");
  }

  return <p>User Dashboard</p>;
}
