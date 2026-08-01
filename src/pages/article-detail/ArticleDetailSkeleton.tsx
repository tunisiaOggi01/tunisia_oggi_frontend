/** Shimmer skeleton that mirrors the ArticleDetailPage layout while data is loading. */
export function ArticleDetailSkeleton() {
  return (
    <div className="mx-auto max-w-4xl px-6 py-8 animate-pulse">
      <div className="h-3 w-40 rounded bg-gray-200" />
      <div className="mt-4 h-3 w-24 rounded bg-gray-200" />
      <div className="mt-2 h-10 w-3/4 rounded bg-gray-200" />
      <div className="mt-4 h-3 w-60 rounded bg-gray-200" />
      <div className="mt-6 aspect-[16/9] w-full rounded bg-gray-200" />
      <div className="mt-6 space-y-3">
        <div className="h-4 w-full rounded bg-gray-200" />
        <div className="h-4 w-11/12 rounded bg-gray-200" />
        <div className="h-4 w-5/6 rounded bg-gray-200" />
        <div className="h-4 w-full rounded bg-gray-200" />
        <div className="h-4 w-3/4 rounded bg-gray-200" />
      </div>
      <div className="mt-6 flex gap-2">
        <div className="h-6 w-16 rounded bg-gray-200" />
        <div className="h-6 w-20 rounded bg-gray-200" />
        <div className="h-6 w-14 rounded bg-gray-200" />
      </div>
    </div>
  );
}
