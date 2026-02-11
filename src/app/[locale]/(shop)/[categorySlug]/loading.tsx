export default function CategoryLoading() {
  return (
    <div className="container mx-auto px-4 py-8 animate-pulse">
      {/* Title skeleton */}
      <div className="h-10 bg-muted rounded-md w-64 mb-4" />
      <div className="h-5 bg-muted rounded-md w-96 max-w-full mb-8" />

      {/* Product grid skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="rounded-xl border bg-card overflow-hidden">
            <div className="aspect-square bg-muted" />
            <div className="p-4 space-y-3">
              <div className="h-3 bg-muted rounded w-24" />
              <div className="h-4 bg-muted rounded w-full" />
              <div className="h-6 bg-muted rounded w-20" />
              <div className="h-9 bg-muted rounded w-full" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
