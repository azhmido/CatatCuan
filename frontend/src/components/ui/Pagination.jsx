/**
 * Pagination — Reusable page navigation control for paginated lists.
 *
 * Props:
 *  - currentPage    : number  – zero-based current page index (Spring Data style)
 *  - totalPages     : number  – total page count returned by backend
 *  - totalElements  : number  – total record count (for "Menampilkan X dari Y" label)
 *  - pageSize       : number  – currently selected rows-per-page
 *  - onPageChange   : (page: number) => void  – callback with zero-based page index
 *  - onPageSizeChange: (size: number) => void – callback when page size changes
 */
export function Pagination({
  currentPage = 0,
  totalPages = 1,
  totalElements = 0,
  pageSize = 10,
  onPageChange,
  onPageSizeChange,
}) {
  if (totalPages <= 1 && totalElements <= pageSize) return null

  const isFirst = currentPage === 0
  const isLast = currentPage >= totalPages - 1

  // Show at most 5 page buttons centred around current page
  const buildPageRange = () => {
    if (totalPages <= 5) return Array.from({ length: totalPages }, (_, i) => i)
    const start = Math.max(0, Math.min(currentPage - 2, totalPages - 5))
    return Array.from({ length: Math.min(5, totalPages) }, (_, i) => start + i)
  }

  const from = currentPage * pageSize + 1
  const to = Math.min((currentPage + 1) * pageSize, totalElements)

  return (
    <div
      className="flex flex-col sm:flex-row items-center justify-between gap-3 px-4 py-3 border-t border-border"
      role="navigation"
      aria-label="Navigasi halaman"
    >
      {/* Info label */}
      <p className="text-xs text-text-muted font-mono order-2 sm:order-1">
        Menampilkan{' '}
        <span className="font-semibold text-text">{totalElements === 0 ? 0 : from}–{to}</span>{' '}
        dari <span className="font-semibold text-text">{totalElements}</span> data
      </p>

      {/* Page buttons + size picker */}
      <div className="flex items-center gap-2 order-1 sm:order-2 flex-wrap justify-center">
        {/* Previous */}
        <button
          type="button"
          onClick={() => onPageChange?.(currentPage - 1)}
          disabled={isFirst}
          aria-label="Halaman sebelumnya"
          className="px-2.5 py-1.5 text-xs font-mono border border-border rounded-base bg-surface text-text hover:bg-secondary transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        >
          ‹ Sebelumnya
        </button>

        {/* Numbered pages */}
        <div className="flex items-center gap-1">
          {buildPageRange().map((pageIdx) => (
            <button
              key={pageIdx}
              type="button"
              onClick={() => onPageChange?.(pageIdx)}
              aria-label={`Halaman ${pageIdx + 1}`}
              aria-current={pageIdx === currentPage ? 'page' : undefined}
              className={`w-8 h-8 text-xs font-mono border rounded-base transition-colors ${
                pageIdx === currentPage
                  ? 'bg-primary text-white border-primary font-bold'
                  : 'border-border bg-surface text-text hover:bg-secondary'
              }`}
            >
              {pageIdx + 1}
            </button>
          ))}
        </div>

        {/* Next */}
        <button
          type="button"
          onClick={() => onPageChange?.(currentPage + 1)}
          disabled={isLast}
          aria-label="Halaman berikutnya"
          className="px-2.5 py-1.5 text-xs font-mono border border-border rounded-base bg-surface text-text hover:bg-secondary transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        >
          Berikutnya ›
        </button>

        {/* Page-size picker */}
        {onPageSizeChange && (
          <select
            aria-label="Jumlah baris per halaman"
            value={pageSize}
            onChange={(e) => {
              onPageChange?.(0) // reset to page 0 on size change
              onPageSizeChange?.(Number(e.target.value))
            }}
            className="text-xs font-mono px-2 py-1.5 border border-border rounded-base bg-surface text-text hover:bg-secondary transition-colors cursor-pointer focus:outline-none focus:border-primary appearance-none pl-2 pr-6"
          >
            {[5, 10, 20, 50].map((n) => (
              <option key={n} value={n}>
                {n} / hal
              </option>
            ))}
          </select>
        )}
      </div>
    </div>
  )
}

export default Pagination

