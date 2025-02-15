export default function DashboardLoading() {
  return (
    <div className="space-y-8">
      {/* Stats loading skeleton */}
      <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="h-32 animate-pulse rounded-lg bg-white/10" />
        ))}
      </div>

      {/* URL list loading skeleton */}
      <div>
        <div className="mb-4 h-8 w-32 animate-pulse rounded bg-white/10" />
        <div className="overflow-x-auto rounded-lg bg-white/10">
          <div className="h-64 animate-pulse" />
        </div>
      </div>
    </div>
  );
}
