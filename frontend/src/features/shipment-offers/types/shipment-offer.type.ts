import { z } from "zod";
import { ORDER_OPTIONS } from "@/lib/enums/order";

export enum ShipmentOfferStatus {
    PENDING = "PENDING",
    ACCEPTED = "ACCEPTED",
    REJECTED = "REJECTED",
    EXPIRED = "EXPIRED",
    CANCELLED = "CANCELLED",
}

export type ShipmentOfferParams = {
    order?: z.infer<typeof ORDER_OPTIONS>;
    page?: number;
    take?: number;
    search?: string;
    status?: ShipmentOfferStatus;
    departureCityId?: string;
    arrivalCityId?: string;
    truckTypeId?: string;
    minWeight?: number;
    maxWeight?: number;
};

export type UpdateShipmentOfferStatusDTO = {
    status: ShipmentOfferStatus;
};

export type ShipmentOfferDataType = {
    id: string;
    createdAt: string;
    updatedAt: string;
    enterprise?: {
        id: string;
        name: string;
    };
    truckType?: {
        id: string;
        name: string;
        description: string;
    };
    departureCity?: {
        id: string;
        name: string;
        country: {
            id: string;
        };
    };
    arrivalCity?: {
        id: string;
        name: string;
        country: {
            id: string;
        };
    };
    commodity: string;
    weight: string;
    loadingTime: string;
    unloadDate: string;
    specialRequirements?: string;
    numberOfParcels: number;
    nbrTrucks: number;
    availableTo: string;
    reservePrice: string;
    status: ShipmentOfferStatus;
    winningBidId?: string | null;
    showLowestBid?: boolean;
};

export type CreateShipmentOfferDTO = {
    truckTypeId: string;
    departureCityId: string;
    arrivalCityId: string;
    commodity: string;
    weight: number;
    loadingTime: string;
    unloadDate: string;
    specialRequirements?: string;
    numberOfParcels: number;
    nbrTrucks: number;
    availableTo: string;
    reservePrice: number;
    showLowestBid?: boolean;
};

export type UpdateShipmentOfferDTO = Partial<CreateShipmentOfferDTO>;
