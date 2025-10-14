"use client";

import { useQuery } from "@tanstack/react-query";
import { getMyMedications } from "../actions/patient-medication-actions";

export function useMyMedications(currentOnly: boolean = false, page: number = 0, size: number = 10) {
    return useQuery({
        queryKey: ["my-medications", currentOnly, page, size],
        queryFn: () => getMyMedications(currentOnly, page, size),
        staleTime: 1000 * 60 * 2,
    });
}