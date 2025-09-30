import { cn } from "@/lib/utils";

interface RenderTHProps {
    header: string;
    className?: string;
    isSearchable?: boolean;
}

export default function RenderTH({ header, className }: RenderTHProps) {
    // const [showSearch, setShowSearch] = useState(false);
    // TODO: think about the search feature later
    return (
        <div className={cn("text-primary font-medium text-nowrap", className)}>
            <div className="flex items-center gap-2 justify-between">
                {header.slice(0, 1).toUpperCase() + header.slice(1)}
                {/* {isSearchable && (
                    <Button variant="ghost" size="icon" onClick={() => setShowSearch(!showSearch)}>
                        <Search className="size-4" />
                    </Button>
                )} */}
            </div>
            {/* {showSearch && <Input className="w-full" />} */}
        </div>
    );
}
