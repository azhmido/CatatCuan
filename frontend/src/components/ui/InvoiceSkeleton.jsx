export function InvoiceSkeleton({ rows = 3, className = '' }) {
  return (
    <div className={`p-5 rounded-base border border-border bg-surface animate-pulse space-y-4 ${className}`}>
      {/* Header Skeleton */}
      <div className="flex items-center justify-between pb-4 border-b border-dashed border-border-dashed">
        <div className="space-y-2">
          <div className="h-4 w-28 bg-secondary rounded-sharp" />
          <div className="h-3 w-40 bg-secondary/70 rounded-sharp" />
        </div>
        <div className="h-6 w-20 bg-secondary rounded-sharp" />
      </div>

      {/* Rows Skeleton */}
      <div className="space-y-3 py-2">
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i} className="flex items-center justify-between">
            <div className="space-y-1.5 flex-1 max-w-sm">
              <div className="h-3 w-3/4 bg-secondary rounded-sharp" />
              <div className="h-2.5 w-1/2 bg-secondary/60 rounded-sharp" />
            </div>
            <div className="h-4 w-24 bg-secondary rounded-sharp" />
          </div>
        ))}
      </div>

      {/* Footer Perforation Skeleton */}
      <div className="pt-3 border-t border-dashed border-border-dashed flex items-center justify-between">
        <div className="h-3 w-20 bg-secondary/60 rounded-sharp" />
        <div className="h-5 w-32 bg-secondary rounded-sharp" />
      </div>
    </div>
  )
}

export default InvoiceSkeleton

