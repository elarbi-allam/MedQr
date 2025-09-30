"use client";

import { FileSearchIcon } from "lucide-react";

export function TableEmptyState({
    title = "No data available",
    description = "There are no entries to display at this time.",
}) {
    return (
        <div className="flex flex-col items-center justify-center py-12 px-4">
            <div className="h-24 w-24 rounded-full bg-brand/10 flex items-center justify-center mb-6">
                <FileSearchIcon className="text-brand size-12" />
            </div>
            <h3 className="text-xl font-medium text-brand-2 mb-1">{title}</h3>
            <p className="text-gray-500 text-center max-w-sm">{description}</p>
        </div>
    );
}
