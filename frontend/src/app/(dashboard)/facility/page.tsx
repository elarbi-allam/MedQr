import { redirect } from 'next/navigation';
import { isFacility } from '@/features/auth/dal/role-checks';
export default  async function FacilityDashboard() {
  const isUserFacility = await isFacility();

  if (!isUserFacility) {
    return redirect('/unauthorized');
  }
    return <p>Facility dashboard</p>;
}
