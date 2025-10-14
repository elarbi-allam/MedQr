"use client";

import { useQuery } from "@tanstack/react-query";
import { getMyVaccinations } from "../actions/patient-vaccination-actions";

export function useMyVaccinations(page: number = 0, size: number = 10) {
    return useQuery({
        queryKey: ["my-vaccinations", page, size],
        queryFn: () => getMyVaccinations(page, size),
        staleTime: 1000 * 60 * 2,
    });
}