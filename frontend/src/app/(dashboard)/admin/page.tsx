import { redirect } from 'next/navigation';
import { isAdmin } from '@/features/auth/dal/role-checks';


export default async function AdminDashboardPage() {
  const isUserAdmin = await isAdmin();

  if (!isUserAdmin) {
    return redirect('/unauthorized');
  }


  return <p>Welcome to the admin dashboard!</p>;
}