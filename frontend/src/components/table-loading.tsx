import { Workflow } from "lucide-react";

import { Skeleton } from "@/components/ui/skeleton";

export default function TableLoading() {
    return (
        <div className="space-y-4 w-full">
            {/* Table section */}
            <div className="rounded-md border">
                {/* Table header */}
                <div className="border-b bg-muted/50">
                    <div className="flex items-center h-10 px-4">
                        {/* Expander column */}
                        <div className="w-[30px] flex justify-center">
                            <Workflow className="size-4 text-muted-foreground/30" />
                        </div>
                        {/* Select column */}
                        <div className="w-[40px] flex justify-center">
                            <Skeleton className="h-4 w-4 rounded" />
                        </div>
                        {/* Flow ID */}
                        <div className="w-[200px]">
                            <Skeleton className="h-4 w-[80%]" />
                        </div>
                        {/* Flow Name */}
                        <div className="w-[120px]">
                            <Skeleton className="h-4 w-[90%]" />
                        </div>
                        {/* Flow Start */}
                        <div className="w-[160px]">
                            <Skeleton className="h-4 w-[80%]" />
                        </div>
                        {/* Flow End */}
                        <div className="w-[160px]">
                            <Skeleton className="h-4 w-[80%]" />
                        </div>
                        {/* Time */}
                        <div className="w-[80px]">
                            <Skeleton className="h-4 w-[60%]" />
                        </div>
                        {/* File Name */}
                        <div className="w-[200px]">
                            <Skeleton className="h-4 w-[80%]" />
                        </div>
                        {/* Facture Number */}
                        <div className="w-[140px]">
                            <Skeleton className="h-4 w-[80%]" />
                        </div>
                        {/* Flow Status */}
                        <div className="w-[70px] flex justify-center">
                            <Skeleton className="h-4 w-[80%]" />
                        </div>
                    </div>
                </div>

                {/* Table body */}
                <div>
                    {[...Array(5)].map((_, i) => (
                        <div key={i} className="flex items-center h-16 px-4 border-b last:border-0 hover:bg-muted/50">
                            {/* Expander column */}
                            <div className="w-[30px] flex justify-center">
                                <Skeleton className="h-7 w-7 rounded" />
                            </div>
                            {/* Select column */}
                            <div className="w-[40px] flex justify-center">
                                <Skeleton className="h-4 w-4 rounded" />
                            </div>
                            {/* Flow ID */}
                            <div className="w-[200px]">
                                <Skeleton className="h-4 w-[90%]" />
                            </div>
                            {/* Flow Name */}
                            <div className="w-[120px]">
                                <div className="space-y-2">
                                    <Skeleton className="h-4 w-[85%]" />
                                </div>
                            </div>
                            {/* Flow Start */}
                            <div className="w-[160px]">
                                <Skeleton className="h-4 w-[80%]" />
                            </div>
                            {/* Flow End */}
                            <div className="w-[160px]">
                                <Skeleton className="h-4 w-[80%]" />
                            </div>
                            {/* Time */}
                            <div className="w-[80px]">
                                <Skeleton className="h-4 w-[60%]" />
                            </div>
                            {/* File Name */}
                            <div className="w-[200px]">
                                <Skeleton className="h-4 w-[85%]" />
                            </div>
                            {/* Facture Number */}
                            <div className="w-[140px]">
                                <Skeleton className="h-4 w-[80%]" />
                            </div>
                            {/* Flow Status */}
                            <div className="w-[70px] flex justify-center">
                                <Skeleton className="h-6 w-6 rounded-full" />
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-between px-2">
                <Skeleton className="h-8 w-[100px]" />
                <div className="flex gap-1">
                    {[...Array(3)].map((_, i) => (
                        <Skeleton key={i} className="h-8 w-8" />
                    ))}
                </div>
                <Skeleton className="h-8 w-[100px]" />
            </div>
        </div>
    );
}
