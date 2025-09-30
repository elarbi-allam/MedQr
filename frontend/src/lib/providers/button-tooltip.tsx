import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";

export const ButtonTooltip = ({
    children,
    tooltip,
    side = "top",
}: {
    children: React.ReactNode;
    tooltip: string;
    side?: "top" | "right" | "bottom" | "left";
}) => {
    return (
        <TooltipProvider>
            <Tooltip>
                <TooltipTrigger asChild>{children}</TooltipTrigger>
                <TooltipContent side={side}>{tooltip}</TooltipContent>
            </Tooltip>
        </TooltipProvider>
    );
};
