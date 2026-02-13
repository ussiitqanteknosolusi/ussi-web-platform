// ✅ PERFORMANCE: Loading skeleton for layanan pages
export default function Loading() {
  return (
    <div className="min-h-screen bg-background pt-32 pb-20">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
          <div className="space-y-6">
            <div className="h-12 w-3/4 bg-muted rounded-lg animate-pulse" />
            <div className="h-6 w-full bg-muted rounded animate-pulse" />
            <div className="h-6 w-2/3 bg-muted rounded animate-pulse" />
          </div>
          <div className="aspect-square bg-muted rounded-2xl animate-pulse" />
        </div>
        <div className="mb-20">
          <div className="h-10 w-48 bg-muted rounded-lg animate-pulse mx-auto mb-8" />
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-card border rounded-xl overflow-hidden">
                <div className="aspect-video bg-muted animate-pulse" />
                <div className="p-6 space-y-3">
                  <div className="h-5 w-32 bg-muted rounded animate-pulse" />
                  <div className="h-4 w-full bg-muted rounded animate-pulse" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
