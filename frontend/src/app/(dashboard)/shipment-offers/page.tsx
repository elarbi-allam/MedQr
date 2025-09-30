import { redirect } from "next/navigation";
import { checkEnterpriseType } from "@/features/trucks/dal/enterpriseType-check";
import { EnterpriseType } from "@/features/admin/enterprises/types/enterprise.type";
import MyOffersList from "@/features/shipment-offers/components/my-offers-list";

export default async function ShipmentOffersPage() {
    const isUserShipper = await checkEnterpriseType(EnterpriseType.SHIPPER);
    if (!isUserShipper) {
        redirect("/unauthorized");
    }

    return (
        <div className="py-4">
            <MyOffersList />
        </div>
    );
}
