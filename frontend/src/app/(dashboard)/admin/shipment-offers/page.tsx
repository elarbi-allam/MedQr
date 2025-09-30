import { redirect } from "next/navigation";
import { isAdmin } from "@/features/auth/dal/role-checks";
import ShipmentOfferDataTable from "@/features/shipment-offers/components/admin/shipment-offer-data-table";

export default async function AdminShipmentOffersPage() {
    const userIsAdmin = await isAdmin();
    if (!userIsAdmin) {
        redirect("/unauthorized");
    }

    return (
        <div className="py-4">
            <ShipmentOfferDataTable />
        </div>
    );
}
