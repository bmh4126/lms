"use client";

// Segment error boundary. Catches errors thrown while rendering this route,
// including failed server fetches (chapters/topics/lessons). `reset()` re-renders
// the segment so the user can retry without a full page reload.
import { useEffect } from "react";

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
      <h2 className="text-xl font-semibold">
        Couldn&apos;t load the curriculum.
      </h2>
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
