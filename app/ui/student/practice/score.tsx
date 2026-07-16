import clsx from "clsx";

// Score banner shown at the top of a review. Tone shifts with the percentage
// so a child gets an at-a-glance sense of how they did. `flex-1` lets it fill
// the remaining width when placed next to the Back button.
export function ReviewScore({ score, total }: { score: number; total: number }) {
  const pct = total > 0 ? Math.round((score / total) * 100) : 0;
  const tone = pct >= 80 ? "high" : pct >= 50 ? "mid" : "low";
  return (
    <div
      className={clsx(
        "flex flex-1 items-center justify-between rounded-lg border-2 p-4 shadow-md/30",
        {
          "border-green-500 bg-green-50": tone === "high",
          "border-amber-500 bg-amber-50": tone === "mid",
          "border-red-500 bg-red-50": tone === "low",
        },
      )}
    >
      <div>
        <p className="text-sm font-medium text-gray-600">Your score</p>
        <p className="text-2xl font-bold text-gray-900">
          {score} <span className="text-gray-400">/ {total}</span>
        </p>
      </div>
      <div
        className={clsx("text-3xl font-bold", {
          "text-green-600": tone === "high",
          "text-amber-600": tone === "mid",
          "text-red-600": tone === "low",
        })}
      >
        {pct}%
      </div>
    </div>
  );
}
