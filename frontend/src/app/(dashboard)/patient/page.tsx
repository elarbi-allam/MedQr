import { redirect } from 'next/navigation';
import { isPatient } from '@/features/auth/dal/role-checks';
export default  async function PatientDashboard() {
  const isUserPatient = await isPatient();

  if (!isUserPatient) {
    return redirect('/unauthorized');
  }
    return <p>patient dashboard</p>;
}
