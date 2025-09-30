import { redirect } from "next/navigation";
import { checkEnterpriseType } from "@/features/trucks/dal/enterpriseType-check";
import { EnterpriseType } from "@/features/admin/enterprises/types/enterprise.type";
import OfferForm from "@/features/shipment-offers/components/offer-form";

type EditShipmentOfferPageProps = {
    params: Promise<{ id: string }>;
};

export default async function EditShipmentOfferPage(props: EditShipmentOfferPageProps) {
    const isUserShipper = await checkEnterpriseType(EnterpriseType.SHIPPER);
    if (!isUserShipper) {
        redirect("/unauthorized");
    }
    const params = await props.params;

    return <OfferForm mode="edit" offerId={params.id} />;
}
