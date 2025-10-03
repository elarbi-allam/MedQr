import { redirect } from 'next/navigation';
import { isProvider } from '@/features/auth/dal/role-checks';
export default  async function ProviderDashboard() {
  const isUserProvider = await isProvider();

  if (!isUserProvider) {
    return redirect('/unauthorized');
  }
    return <p>Provider dashboard</p>;
}
