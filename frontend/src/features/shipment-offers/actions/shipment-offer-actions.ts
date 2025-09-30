"use server";

import { errorResponse } from "@/lib/helpers/error-response";
import { ActionsResponse } from "@/lib/types/actions.type";
import { MetaType } from "@/lib/types/meta.type";
import { axiosWrapper } from "@/lib/wrappers/axios-wrapper";
import { getSession } from "@/features/auth/dal/session";
import { redirect } from "next/navigation";
import { toast } from "sonner";
import {
    ShipmentOfferDataType,
    ShipmentOfferParams,
    CreateShipmentOfferDTO,
    UpdateShipmentOfferDTO,
    UpdateShipmentOfferStatusDTO,
} from "../types/shipment-offer.type";

// Get my shipment offers (Shipper only)
export async function getMyShipmentOffers(
    params: ShipmentOfferParams = {},
): Promise<ActionsResponse<ShipmentOfferDataType[] | null>> {
    try {
        const session = await getSession();
        if (!session) {
            toast.error("Vous n'êtes pas autorisé à effectuer cette action");
            return redirect("/unauthorized");
        }

        const response = await axiosWrapper.get<{
            data: ShipmentOfferDataType[];
            meta: MetaType;
        }>("/shipment-offers/my-offers", {
            params,
        });

        return {
            status: "SUCCESS",
            statusCode: response.status,
            message: "Vos offres récupérées avec succès",
            data: response.data.data,
            meta: response.data.meta,
        };
    } catch (error) {
        return errorResponse(error, "getMyShipmentOffers");
    }
}

// Get specific shipment offer by ID
export async function getShipmentOffer(id: string): Promise<ActionsResponse<ShipmentOfferDataType | null>> {
    try {
        const session = await getSession();
        if (!session) {
            toast.error("Vous n'êtes pas autorisé à effectuer cette action");
            return redirect("/unauthorized");
        }

        const response = await axiosWrapper.get<ShipmentOfferDataType>(`/shipment-offers/${id}`);

        return {
            status: "SUCCESS",
            statusCode: response.status,
            message: "Offre récupérée avec succès",
            data: response.data,
        };
    } catch (error) {
        return errorResponse(error, "getShipmentOffer");
    }
}

// Create shipment offer (Shipper only)
export async function createShipmentOffer(
    offerDTO: CreateShipmentOfferDTO,
): Promise<ActionsResponse<ShipmentOfferDataType | null>> {
    try {
        const session = await getSession();
        if (!session) {
            toast.error("Vous n'êtes pas autorisé à effectuer cette action");
            return redirect("/unauthorized");
        }

        const response = await axiosWrapper.post<ShipmentOfferDataType>("/shipment-offers", offerDTO);

        return {
            status: "SUCCESS",
            statusCode: response.status,
            message: "Offre créée avec succès",
            data: response.data,
        };
    } catch (error) {
        return errorResponse(error, "createShipmentOffer");
    }
}

// Update shipment offer (Shipper only)
export async function updateShipmentOffer({
    id,
    offerData,
}: {
    id: string;
    offerData: UpdateShipmentOfferDTO;
}): Promise<ActionsResponse<ShipmentOfferDataType | null>> {
    try {
        const session = await getSession();
        if (!session) {
            toast.error("Vous n'êtes pas autorisé à effectuer cette action");
            return redirect("/unauthorized");
        }

        const response = await axiosWrapper.patch<ShipmentOfferDataType>(`/shipment-offers/${id}`, offerData);

        return {
            status: "SUCCESS",
            statusCode: response.status,
            message: "Offre mise à jour avec succès",
            data: response.data,
        };
    } catch (error) {
        return errorResponse(error, "updateShipmentOffer");
    }
}

// Delete shipment offer
export async function deleteShipmentOffer(id: string): Promise<ActionsResponse<null>> {
    try {
        const session = await getSession();
        if (!session) {
            toast.error("Vous n'êtes pas autorisé à effectuer cette action");
            return redirect("/unauthorized");
        }

        await axiosWrapper.delete(`/shipment-offers/${id}`);

        return {
            status: "SUCCESS",
            statusCode: 200,
            message: "Offre supprimée avec succès",
            data: null,
        };
    } catch (error) {
        return errorResponse(error, "deleteShipmentOffer");
    }
}

// Get all shipment offers (Admin only)
export async function getShipmentOffersAdmin(
    params: ShipmentOfferParams = {},
): Promise<ActionsResponse<ShipmentOfferDataType[] | null>> {
    try {
        const session = await getSession();
        if (!session) {
            toast.error("Vous n'êtes pas autorisé à effectuer cette action");
            return redirect("/unauthorized");
        }

        const response = await axiosWrapper.get<{
            data: ShipmentOfferDataType[];
            meta: MetaType;
        }>("/shipment-offers", {
            params,
        });

        return {
            status: "SUCCESS",
            statusCode: response.status,
            message: "Offres d'expédition récupérées avec succès",
            data: response.data.data,
            meta: response.data.meta,
        };
    } catch (error) {
        return errorResponse(error, "getShipmentOffers");
    }
}

// Update shipment offer status (Admin only)
export const updateShipmentOfferStatus = async ({
    id,
    statusData,
}: {
    id: string;
    statusData: UpdateShipmentOfferStatusDTO;
}): Promise<ActionsResponse<ShipmentOfferDataType | null>> => {
    try {
        const session = await getSession();
        if (!session) {
            toast.error("Vous n'êtes pas autorisé à effectuer cette action");
            return redirect("/unauthorized");
        }

        const response = await axiosWrapper.patch(`/shipment-offers/${id}/status`, statusData);

        return {
            status: "SUCCESS",
            statusCode: response.status,
            message: "Statut de l'offre mis à jour avec succès",
            data: response.data,
        };
    } catch (error) {
        return errorResponse(error, "updateShipmentOfferStatus");
    }
};
