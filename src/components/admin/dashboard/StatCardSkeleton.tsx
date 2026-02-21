export default function StatCardSkeleton() {
  return (
    <div
      className="rounded-xl p-5 relative overflow-hidden animate-pulse"
      style={{ background: "var(--surface)", border: "1px solid var(--border)" }}
    >
      <div className="flex items-start justify-between mb-4">
        <div
          className="w-10 h-10 rounded-xl"
          style={{ background: "oklch(1 0 0 / 0.05)" }}
        />
      </div>
      <div
        className="h-8 w-16 rounded-lg mb-2"
        style={{ background: "oklch(1 0 0 / 0.05)" }}
      />
      <div
        className="h-4 w-24 rounded"
        style={{ background: "oklch(1 0 0 / 0.04)" }}
      />
      <div
        className="h-3 w-20 rounded mt-1.5"
        style={{ background: "oklch(1 0 0 / 0.03)" }}
      />
    </div>
  );
}