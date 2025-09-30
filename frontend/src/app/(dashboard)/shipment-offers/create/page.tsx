import { redirect } from "next/navigation";
import { checkEnterpriseType } from "@/features/trucks/dal/enterpriseType-check";
import { EnterpriseType } from "@/features/admin/enterprises/types/enterprise.type";
import OfferForm from "@/features/shipment-offers/components/offer-form";

export default async function CreateShipmentOfferPage() {
    const isUserShipper = await checkEnterpriseType(EnterpriseType.SHIPPER);
    if (!isUserShipper) {
        redirect("/unauthorized");
    }

    return <OfferForm mode="create" />;
}
