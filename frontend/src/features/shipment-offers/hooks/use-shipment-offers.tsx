"use client";

import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import {
    getMyShipmentOffers,
    getShipmentOffer,
    createShipmentOffer,
    updateShipmentOffer,
    deleteShipmentOffer,
    getShipmentOffersAdmin,
    updateShipmentOfferStatus,
} from "../actions/shipment-offer-actions";
import { ShipmentOfferParams } from "../types/shipment-offer.type";

// Get my shipment offers (Shipper)
export function useMyShipmentOffers(params: ShipmentOfferParams) {
    return useQuery({
        queryKey: ["my-shipment-offers", params],
        queryFn: () => getMyShipmentOffers(params),
        placeholderData: keepPreviousData,
        staleTime: 0,
    });
}

// Get single shipment offer
export function useShipmentOffer(id: string) {
    return useQuery({
        queryKey: ["shipment-offers", id],
        queryFn: () => getShipmentOffer(id),
        enabled: !!id,
        staleTime: 1000 * 60 * 5,
    });
}

// Create shipment offer
export function useCreateShipmentOffer() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: createShipmentOffer,
        onSuccess: (data) => {
            if (data.status === "SUCCESS") {
                toast.success(data.message);
                queryClient.invalidateQueries({
                    predicate: (query) => query.queryKey[0] === "my-shipment-offers",
                });
            } else {
                toast.error(data.message);
            }
        },
    });
}

// Update shipment offer
export function useUpdateShipmentOffer() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: updateShipmentOffer,
        onSuccess: (data) => {
            if (data.status === "SUCCESS") {
                toast.success(data.message);
                queryClient.invalidateQueries({
                    predicate: (query) =>
                        query.queryKey[0] === "my-shipment-offers" || query.queryKey[0] === "shipment-offers",
                });
            } else {
                toast.error(data.message);
            }
        },
    });
}

// Delete shipment offer
export function useDeleteShipmentOffer() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: deleteShipmentOffer,
        onSuccess: (data) => {
            if (data.status === "SUCCESS") {
                toast.success(data.message);
                queryClient.invalidateQueries({
                    predicate: (query) => query.queryKey[0] === "my-shipment-offers",
                });
            } else {
                toast.error(data.message);
            }
        },
    });
}

// Get all shipment offers (Admin only)
export function useShipmentOffers(params: ShipmentOfferParams) {
    return useQuery({
        queryKey: ["shipment-offers", params],
        queryFn: () => getShipmentOffersAdmin(params),
        placeholderData: keepPreviousData,
        staleTime: 0,
    });
}

// Update shipment offer status (Admin only)
export function useUpdateShipmentOfferStatus() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: updateShipmentOfferStatus,
        onSuccess: (data) => {
            if (data.status === "SUCCESS") {
                toast.success(data.message);
                queryClient.invalidateQueries({
                    predicate: (query) => query.queryKey[0] === "shipment-offers",
                });
            } else {
                toast.error(data.message);
            }
        },
    });
}
