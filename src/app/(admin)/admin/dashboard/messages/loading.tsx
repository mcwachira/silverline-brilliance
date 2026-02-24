
export default function MessagesLoading() {
  return (
    <div className="flex flex-col h-full gap-5 p-5 md:p-6 overflow-hidden">

      {/* Header skeleton */}
      <div className="space-y-2 flex-shrink-0">
        <div className="h-7 w-36 rounded-lg bg-white/[0.06] animate-pulse" />
        <div className="h-4 w-48 rounded bg-white/[0.04] animate-pulse" />
      </div>

      {/* Split view skeleton */}
      <div className="flex gap-4 flex-1 overflow-hidden">

        {/* List pane */}
        <div className="w-[340px] lg:w-[380px] flex-shrink-0 card rounded-xl overflow-hidden flex flex-col">
          {/* Header */}
          <div className="px-4 pt-4 pb-3 border-b border-[var(--border)] space-y-3">
            <div className="flex justify-between items-center">
              <div className="h-4 w-20 rounded bg-white/[0.06] animate-pulse" />
              <div className="h-5 w-5 rounded bg-white/[0.05] animate-pulse" />
            </div>
            <div className="h-8 w-full rounded-lg bg-white/[0.05] animate-pulse" />
            <div className="flex gap-1">
              {[56, 64, 48, 64, 72].map((w, i) => (
                <div
                  key={i}
                  className="h-6 rounded-full bg-white/[0.05] animate-pulse"
                  style={{ width: w }}
                />
              ))}
            </div>
          </div>

          {/* Rows */}
          <div className="flex-1 divide-y divide-white/[0.04]">
            {Array.from({ length: 7 }).map((_, i) => (
              <div key={i} className="flex items-start gap-3 px-4 py-3.5">
                <div className="w-9 h-9 rounded-full bg-white/[0.06] animate-pulse flex-shrink-0" />
                <div className="flex-1 space-y-1.5">
                  <div className="flex justify-between">
                    <div className="h-3 w-28 rounded bg-white/[0.06] animate-pulse" />
                    <div className="h-3 w-10 rounded bg-white/[0.04] animate-pulse" />
                  </div>
                  <div className="h-3 w-40 rounded bg-white/[0.05] animate-pulse" />
                  <div className="h-2.5 w-full rounded bg-white/[0.03] animate-pulse" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Detail pane — empty placeholder */}
        <div className="flex-1 card rounded-xl border-dashed
          border-[var(--border)] hidden md:flex items-center justify-center">
          <div className="space-y-3 text-center">
            <div className="w-12 h-12 rounded-2xl bg-white/[0.04] animate-pulse mx-auto" />
            <div className="h-4 w-32 rounded bg-white/[0.04] animate-pulse mx-auto" />
            <div className="h-3 w-44 rounded bg-white/[0.03] animate-pulse mx-auto" />
          </div>
        </div>
      </div>
    </div>
  );
}