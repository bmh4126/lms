"use client";

// Segment error boundary for the do/review flow. `reset()` re-renders the
// segment so the user can retry without a full reload.
import { useEffect } from "react";
import Back from "@/app/ui/back";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="flex h-full flex-col items-center justify-center gap-4 p-8 text-center">
      <div className="absolute md:top-10 md:left-70 left-5 top-45">
        <Back href="/curriculum/assessment" />
      </div>
      <h2 className="text-xl font-semibold">Couldn&apos;t load this assessment.</h2>
      <p className="text-gray-500">Something went wrong while fetching data.</p>
      <button
        onClick={reset}
        className="rounded-md bg-blue-500 px-4 py-2 text-white transition-colors hover:bg-blue-400"
      >
        Try again
      </button>
    </main>
  );
}
