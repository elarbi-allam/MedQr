"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { CalendarIcon } from "lucide-react";
import {
    Popover,
    PopoverTrigger,
    PopoverContent,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { DateRange } from "react-day-picker";
import { fr } from "date-fns/locale";
import { useQueryState, createParser } from "nuqs";
import { cn } from "@/lib/utils";

// Define the internal date range type
type InternalDateRange = {
    from: Date;
    to: Date;
};

// Custom parser for date ranges
export const dateRangeParser = createParser({
    parse: (value: string): InternalDateRange | null => {
        if (!value) return null;

        // Expected format: "fromDate-toDate" where dates are ISO strings
        const [fromStr, toStr] = value.split(",");
        if (!fromStr || !toStr) return null;

        try {
            const from = new Date(fromStr);
            const to = new Date(toStr);

            // Validate dates
            if (isNaN(from.getTime()) || isNaN(to.getTime())) {
                return null;
            }

            return { from, to };
        } catch {
            return null;
        }
    },
    serialize: (value: InternalDateRange | undefined): string => {
        if (!value?.from || !value?.to) return "";
        return `${format(value.from, "yyyy-MM-dd")},${format(
            value.to,
            "yyyy-MM-dd"
        )}`;
    },
    eq: (
        a: InternalDateRange | undefined,
        b: InternalDateRange | undefined
    ) => {
        if (!a && !b) return true;
        if (!a || !b) return false;
        return (
            a.from?.getTime() === b.from?.getTime() &&
            a.to?.getTime() === b.to?.getTime()
        );
    },
});

export default function DateFilter({ className }: { className?: string }) {
    const [dateRange, setDateRange] = useQueryState(
        "dateRange",
        dateRangeParser.withDefault({
            from: new Date(),
            to: new Date(),
        })
    );
    const [, setVisitId] = useQueryState("visitId");
    const [, setPage] = useQueryState("page");

    return (
        <div>
            <Popover>
                <PopoverTrigger asChild>
                    <Button
                        variant="outline"
                        data-empty={!dateRange}
                        className={cn(
                            "data-[empty=true]:text-muted-foreground w-[280px] justify-start text-left font-normal",
                            className
                        )}
                    >
                        <CalendarIcon />
                        {dateRange && dateRange.from && dateRange.to ? (
                            format(dateRange.from, "PPP", { locale: fr }) +
                            " - " +
                            format(dateRange.to, "PPP", { locale: fr })
                        ) : (
                            <span>Sélectionner une période</span>
                        )}
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                    <Calendar
                        locale={fr}
                        mode="range"
                        selected={dateRange as DateRange}
                        onSelect={(newDateRange: DateRange | undefined) => {
                            if (newDateRange?.from && newDateRange?.to) {
                                setDateRange({
                                    from: newDateRange.from,
                                    to: newDateRange.to,
                                });
                                setVisitId(null);
                                setPage(null);
                            }
                        }}
                        defaultMonth={dateRange?.from}
                        numberOfMonths={2}
                    />
                </PopoverContent>
            </Popover>
        </div>
    );
}
