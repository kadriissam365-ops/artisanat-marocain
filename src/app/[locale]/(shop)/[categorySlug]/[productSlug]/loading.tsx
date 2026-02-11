export default function ProductLoading() {
  return (
    <div className="container mx-auto px-4 py-8 animate-pulse">
      {/* Breadcrumb skeleton */}
      <div className="flex items-center gap-2 mb-6">
        <div className="h-4 bg-muted rounded w-16" />
        <div className="h-4 bg-muted rounded w-4" />
        <div className="h-4 bg-muted rounded w-32" />
        <div className="h-4 bg-muted rounded w-4" />
        <div className="h-4 bg-muted rounded w-48" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Image skeleton */}
        <div className="aspect-square bg-muted rounded-md" />

        {/* Info skeleton */}
        <div className="space-y-6">
          <div className="h-10 bg-muted rounded w-3/4" />
          <div className="h-4 bg-muted rounded w-48" />
          <div className="flex gap-3">
            <div className="h-8 bg-muted rounded w-28" />
            <div className="h-8 bg-muted rounded w-24" />
          </div>
          <div className="h-5 bg-muted rounded w-24" />
          <div className="h-16 bg-muted rounded w-full" />
          <div className="h-12 bg-muted rounded w-full" />
          <div className="border-t pt-6 space-y-3">
            <div className="h-4 bg-muted rounded w-full" />
            <div className="h-4 bg-muted rounded w-full" />
            <div className="h-4 bg-muted rounded w-full" />
          </div>
        </div>
      </div>
    </div>
  );
}
