import { getUserRole } from "@/features/auth/dal/user";
import UnauthorizedClientPage from "@/features/auth/components/unauthorized-client-page";


export default async function UnauthorizedPage() {
  const userRole = await getUserRole();

  return <UnauthorizedClientPage userRole={userRole} />;
}