interface PaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
  onItemsPerPageChange?: (count: number) => void;
  itemsPerPageOptions?: number[];
  itemLabel?: string;
}

export default function Pagination({
  currentPage,
  totalPages,
  totalItems,
  itemsPerPage,
  onPageChange,
  onItemsPerPageChange,
  itemsPerPageOptions = [9, 18, 36],
  itemLabel = 'properties',
}: PaginationProps) {
  if (totalPages <= 1 && !onItemsPerPageChange) return null;

  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  // Build page number array with ellipsis
  const getPageNumbers = (): (number | 'ellipsis')[] => {
    if (totalPages <= 7) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }
    const pages: (number | 'ellipsis')[] = [1];
    if (currentPage > 3) pages.push('ellipsis');
    const rangeStart = Math.max(2, currentPage - 1);
    const rangeEnd = Math.min(totalPages - 1, currentPage + 1);
    for (let i = rangeStart; i <= rangeEnd; i++) pages.push(i);
    if (currentPage < totalPages - 2) pages.push('ellipsis');
    pages.push(totalPages);
    return pages;
  };

  const pageNumbers = getPageNumbers();

  return (
    <div className="mt-10 pt-8 border-t border-stone-100">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Page controls */}
        {totalPages > 1 && (
          <div className="flex items-center gap-1 order-1 sm:order-2">
            {/* Prev */}
            <button
              onClick={() => onPageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="w-8 h-8 flex items-center justify-center rounded-sm border border-stone-200 text-stone-500 hover:border-primary hover:text-primary disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer"
              aria-label="Previous page"
            >
              <i className="ri-arrow-left-s-line text-sm" />
            </button>

            {pageNumbers.map((p, idx) =>
              p === 'ellipsis' ? (
                <span
                  key={`ellipsis-${idx}`}
                  className="w-8 h-8 flex items-center justify-center text-stone-400 text-xs font-roboto"
                >
                  …
                </span>
              ) : (
                <button
                  key={p}
                  onClick={() => onPageChange(p as number)}
                  className={`w-8 h-8 flex items-center justify-center rounded-sm text-xs font-roboto transition-all cursor-pointer whitespace-nowrap ${
                    currentPage === p
                      ? 'bg-primary text-white border border-primary font-semibold'
                      : 'border border-stone-200 text-stone-600 hover:border-primary hover:text-primary'
                  }`}
                >
                  {p}
                </button>
              )
            )}

            {/* Next */}
            <button
              onClick={() => onPageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="w-8 h-8 flex items-center justify-center rounded-sm border border-stone-200 text-stone-500 hover:border-primary hover:text-primary disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer"
              aria-label="Next page"
            >
              <i className="ri-arrow-right-s-line text-sm" />
            </button>
          </div>
        )}


      </div>
    </div>
  );
}
