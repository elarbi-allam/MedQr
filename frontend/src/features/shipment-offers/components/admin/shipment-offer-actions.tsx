import { useState } from "react";
import dynamic from "next/dynamic";
import { Eye, EllipsisVertical, Edit } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ShipmentOfferDataType } from "../../types/shipment-offer.type";

const ViewShipmentOfferDialog = dynamic(() => import("./view-shipment-offer-dialog"));
const UpdateStatusDialog = dynamic(() => import("./update-status-dialog"));

interface ShipmentOfferActionsProps {
    offer: ShipmentOfferDataType;
}

export const ShipmentOfferActions: React.FC<ShipmentOfferActionsProps> = ({ offer }) => {
    const [viewModalOpen, setViewModalOpen] = useState(false);
    const [updateStatusModalOpen, setUpdateStatusModalOpen] = useState(false);

    return (
        <div className="flex items-center justify-end">
            <DropdownMenu modal={false}>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Ouvrir le menu</span>
                        <EllipsisVertical className="h-4 w-4" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="rounded-lg">
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => setViewModalOpen(true)}>
                        <Eye className="mr-2 h-4 w-4" />
                        Voir les détails
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => setUpdateStatusModalOpen(true)}>
                        <Edit className="mr-2 h-4 w-4" />
                        Modifier le statut
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>

            <ViewShipmentOfferDialog offer={offer} open={viewModalOpen} setOpen={setViewModalOpen} />
            <UpdateStatusDialog offer={offer} open={updateStatusModalOpen} setOpen={setUpdateStatusModalOpen} />
        </div>
    );
};
