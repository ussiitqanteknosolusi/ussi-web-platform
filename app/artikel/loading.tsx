// ✅ PERFORMANCE: Loading skeleton for artikel page
export default function Loading() {
  return (
    <div className="container mx-auto px-4 pt-24 md:pt-32 pb-12 md:pb-20">
      <div className="text-center max-w-3xl mx-auto mb-16">
        <div className="h-12 w-56 bg-muted rounded-lg animate-pulse mx-auto mb-6" />
        <div className="h-6 w-96 bg-muted rounded animate-pulse mx-auto" />
      </div>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="bg-card border rounded-2xl overflow-hidden">
            <div className="aspect-[16/9] bg-muted animate-pulse" />
            <div className="p-6 space-y-3">
              <div className="h-4 w-32 bg-muted rounded animate-pulse" />
              <div className="h-6 w-3/4 bg-muted rounded animate-pulse" />
              <div className="h-4 w-full bg-muted rounded animate-pulse" />
              <div className="h-4 w-2/3 bg-muted rounded animate-pulse" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
