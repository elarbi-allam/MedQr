import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination";

interface RenderPaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
}

export default function RenderPagination({
    currentPage,
    totalPages,
    onPageChange,
    hasNextPage,
    hasPreviousPage,
}: RenderPaginationProps) {
    // Generate an array of page numbers to display
    const getPageNumbers = () => {
        const pageNumbers = [];
        const maxPagesToShow = 5; // Adjust as needed
        const startPage = Math.max(0, currentPage - Math.floor(maxPagesToShow / 2));
        const endPage = Math.min(totalPages - 1, startPage + maxPagesToShow - 1);

        for (let i = startPage; i <= endPage; i++) {
            pageNumbers.push(i);
        }

        return pageNumbers;
    };

    const pageNumbers = getPageNumbers();

    if (totalPages <= 1) return null; // Don't render pagination if there's only one page

    return (
        <Pagination>
            <PaginationContent>
                <PaginationItem>
                    <PaginationPrevious
                        onClick={() => onPageChange(currentPage - 1)}
                        isActive={hasPreviousPage} // Use hasPreviousPage for active state
                        className={!hasPreviousPage ? "pointer-events-none opacity-50" : ""}
                    />
                </PaginationItem>

                {pageNumbers[0] > 0 && (
                    <PaginationItem>
                        <PaginationLink onClick={() => onPageChange(0)}>1</PaginationLink>
                    </PaginationItem>
                )}
                {pageNumbers[0] > 1 && (
                    <PaginationItem>
                        <PaginationEllipsis />
                    </PaginationItem>
                )}

                {pageNumbers.map((page) => (
                    <PaginationItem key={page}>
                        <PaginationLink onClick={() => onPageChange(page)} isActive={page === currentPage}>
                            {page + 1}
                        </PaginationLink>
                    </PaginationItem>
                ))}

                {pageNumbers[pageNumbers.length - 1] < totalPages - 2 && ( // Check if there's more than one page after the last displayed
                    <PaginationItem>
                        <PaginationEllipsis />
                    </PaginationItem>
                )}
                {pageNumbers[pageNumbers.length - 1] < totalPages - 1 && (
                    <PaginationItem>
                        <PaginationLink onClick={() => onPageChange(totalPages - 1)}>{totalPages}</PaginationLink>
                    </PaginationItem>
                )}

                <PaginationItem>
                    <PaginationNext
                        onClick={() => onPageChange(currentPage + 1)}
                        isActive={hasNextPage} // Use hasNextPage for active state
                        className={!hasNextPage ? "pointer-events-none opacity-50" : ""}
                    />
                </PaginationItem>
            </PaginationContent>
        </Pagination>
    );
}
