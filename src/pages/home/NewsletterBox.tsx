/** Presentational-only newsletter signup card — not wired to a backend (Sprint 2 scope). */
export function NewsletterBox() {
  return (
    <div className="border border-gray-200 p-4">
      <p className="text-xs font-semibold uppercase text-brand">Newsletter</p>
      <p className="mt-1 text-sm text-gray-600">
        The most important stories from Tunisia, delivered daily to your inbox.
      </p>
      <input
        type="email"
        placeholder="Email address"
        disabled
        className="mt-3 w-full rounded border border-gray-300 px-3 py-2 text-sm"
      />
      <button
        type="button"
        disabled
        title="Newsletter signup is not available yet"
        className="mt-2 w-full cursor-not-allowed rounded bg-brand py-2 text-sm text-white opacity-60"
      >
        SUBSCRIBE
      </button>
    </div>
  );
}
