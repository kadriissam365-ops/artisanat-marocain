export default function BoutiqueLoading() {
  return (
    <div className="container mx-auto px-4 py-8 animate-pulse">
      <div className="h-10 bg-muted rounded-md w-48 mb-2" />
      <div className="h-5 bg-muted rounded-md w-96 max-w-full mb-8" />

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar skeleton */}
        <aside className="w-full lg:w-64 shrink-0 space-y-4">
          <div className="h-5 bg-muted rounded w-32" />
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-4 bg-muted rounded w-full" />
          ))}
        </aside>

        {/* Grid skeleton */}
        <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 9 }).map((_, i) => (
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
    </div>
  );
}
