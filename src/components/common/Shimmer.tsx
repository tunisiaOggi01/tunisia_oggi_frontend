/** A shimmer placeholder for skeleton loading states. Animated pulse via Tailwind. */
export function Shimmer({ className }: { className?: string }) {
  return <div className={`animate-pulse rounded bg-gray-200 ${className ?? ''}`} />;
}
