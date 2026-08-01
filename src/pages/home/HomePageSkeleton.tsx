import { Shimmer } from '../../components/common/Shimmer';

/** Skeleton layout matching HomePage structure — shown during loading / empty state. */
export function HomePageSkeleton() {
  return (
    <main className="mx-auto max-w-7xl px-4 py-8 md:px-6">
      <div className="mb-8 grid grid-cols-1 md:grid-cols-3">
        <Shimmer className="h-[300px] md:col-span-2" />
        <div className="hidden space-y-3 p-6 md:block">
          <Shimmer className="h-4 w-16" />
          <Shimmer className="h-6 w-full" />
          <Shimmer className="h-6 w-3/4" />
          <Shimmer className="h-4 w-full" />
          <Shimmer className="h-4 w-5/6" />
          <Shimmer className="h-4 w-24" />
        </div>
      </div>

      <Shimmer className="mb-8 h-32" />

      <div className="mb-4 grid grid-cols-1 md:grid-cols-3">
        <Shimmer className="h-4 w-32 md:col-span-2" />
        <Shimmer className="hidden h-4 w-24 md:block" />
      </div>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-12">
        <div className="md:col-span-8">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="space-y-3">
                <Shimmer className="aspect-[16/10]" />
                <Shimmer className="h-3 w-20" />
                <Shimmer className="h-5 w-full" />
                <Shimmer className="h-5 w-3/4" />
                <Shimmer className="h-3 w-32" />
              </div>
            ))}
          </div>
        </div>

        <aside className="space-y-8 md:col-span-4">
          <div className="space-y-3 rounded border border-gray-200 p-6">
            <Shimmer className="h-5 w-40" />
            <Shimmer className="h-4 w-full" />
            <Shimmer className="h-10 w-full" />
          </div>
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="flex items-start gap-4">
              <Shimmer className="h-8 w-8 shrink-0" />
              <div className="flex-1 space-y-2">
                <Shimmer className="h-4 w-full" />
                <Shimmer className="h-4 w-2/3" />
              </div>
            </div>
          ))}
          <Shimmer className="aspect-square rounded border border-dashed border-gray-300 bg-gray-100" />
        </aside>
      </div>
    </main>
  );
}
