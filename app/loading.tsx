// ✅ PERFORMANCE: Loading skeleton prevents blocking render on homepage
// Shows instant UI while server fetches data (streaming SSR)
export default function Loading() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between w-full max-w-full overflow-x-hidden">
      {/* Hero Skeleton */}
      <section className="relative min-h-screen w-full flex items-center justify-center bg-background pt-20 pb-16 lg:pt-32">
        <div className="container px-4 md:px-6 grid lg:grid-cols-2 gap-12 items-center">
          <div className="max-w-3xl space-y-6">
            <div className="h-6 w-64 bg-muted rounded-full animate-pulse" />
            <div className="space-y-3">
              <div className="h-12 w-full bg-muted rounded-lg animate-pulse" />
              <div className="h-12 w-3/4 bg-muted rounded-lg animate-pulse" />
            </div>
            <div className="h-6 w-full bg-muted rounded animate-pulse" />
            <div className="h-6 w-2/3 bg-muted rounded animate-pulse" />
            <div className="flex gap-4 pt-4">
              <div className="h-12 w-40 bg-muted rounded-lg animate-pulse" />
              <div className="h-12 w-36 bg-muted rounded-lg animate-pulse" />
            </div>
          </div>
          <div className="hidden lg:block">
            <div className="aspect-video w-full bg-muted rounded-xl animate-pulse" />
          </div>
        </div>
      </section>

      {/* Products Skeleton */}
      <section className="py-24 bg-muted/30 w-full">
        <div className="container px-4 md:px-6">
          <div className="text-center mb-16">
            <div className="h-10 w-72 bg-muted rounded-lg animate-pulse mx-auto mb-4" />
            <div className="h-6 w-96 bg-muted rounded animate-pulse mx-auto" />
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-card border rounded-xl overflow-hidden">
                <div className="aspect-video bg-muted animate-pulse" />
                <div className="p-6 space-y-3">
                  <div className="h-5 w-32 bg-muted rounded animate-pulse" />
                  <div className="h-4 w-full bg-muted rounded animate-pulse" />
                  <div className="h-4 w-2/3 bg-muted rounded animate-pulse" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Skeleton */}
      <section className="py-20 bg-background w-full">
        <div className="container px-4 md:px-6">
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 max-w-6xl mx-auto">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="p-6 bg-muted/50 rounded-xl animate-pulse">
                <div className="h-10 w-20 bg-muted rounded mx-auto mb-2" />
                <div className="h-4 w-16 bg-muted rounded mx-auto" />
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
