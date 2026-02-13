// ✅ PERFORMANCE: Loading skeleton for klien page
export default function Loading() {
  return (
    <div className="pt-24 pb-12">
      <div className="container px-4">
        <div className="text-center mb-12">
          <div className="h-10 w-48 bg-muted rounded-lg animate-pulse mx-auto mb-4" />
          <div className="h-6 w-80 bg-muted rounded animate-pulse mx-auto" />
        </div>
        <div className="max-w-4xl mx-auto bg-card rounded-xl border overflow-hidden">
          <div className="p-4 space-y-3">
            {[...Array(10)].map((_, i) => (
              <div key={i} className="flex items-center gap-4 py-3 border-b border-border/50 last:border-0">
                <div className="h-5 w-10 bg-muted rounded animate-pulse" />
                <div className="h-5 w-48 bg-muted rounded animate-pulse flex-1" />
                <div className="h-6 w-20 bg-muted rounded-full animate-pulse" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
