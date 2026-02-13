// ✅ PERFORMANCE: Loading skeleton for portofolio page
export default function Loading() {
  return (
    <div className="min-h-screen pt-24 pb-12">
      <div className="bg-primary text-primary-foreground py-16 md:py-24 mb-12">
        <div className="container mx-auto px-4 text-center">
          <div className="h-12 w-64 bg-white/20 rounded-lg animate-pulse mx-auto mb-6" />
          <div className="h-6 w-96 bg-white/10 rounded animate-pulse mx-auto" />
        </div>
      </div>
      <div className="container mx-auto px-4">
        <div className="flex gap-3 mb-12 justify-center">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-10 w-28 bg-muted rounded-full animate-pulse" />
          ))}
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-card border rounded-2xl overflow-hidden">
              <div className="h-64 bg-muted animate-pulse" />
              <div className="p-6 space-y-3">
                <div className="h-4 w-24 bg-muted rounded animate-pulse" />
                <div className="h-6 w-3/4 bg-muted rounded animate-pulse" />
                <div className="h-4 w-full bg-muted rounded animate-pulse" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
