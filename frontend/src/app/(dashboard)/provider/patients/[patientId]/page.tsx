import { redirect } from "next/navigation";
import { isProvider } from "@/features/auth/dal/role-checks";
import { getProviderPatients } from "@/features/medical-records/actions/provider-actions";
import PatientDetailView from "@/features/medical-records/components/provider/patient-detail-view";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

type Props = {
    params: {
        patientId: string;
    };
};

export default async function ProviderPatientDetailPage({ params }: Props) {
    const isUserProvider = await isProvider();

    if (!isUserProvider) {
        return redirect("/unauthorized");
    }

    const patientsData = await getProviderPatients();
    const patients = patientsData?.data || [];
    const patient = patients.find((p: any) => p.patientId === params.patientId);

    if (!patient) {
        return redirect("/dashboard/provider/patients");
    }

    return (
        <div className="container mx-auto py-6">
            <div className="mb-6">
                <Link href="/dashboard/provider/patients">
                    <Button variant="ghost" className="gap-2">
                        <ArrowLeft className="h-4 w-4" />
                        Retour aux patients
                    </Button>
                </Link>
            </div>
            <PatientDetailView patient={patient} />
        </div>
    );
}
