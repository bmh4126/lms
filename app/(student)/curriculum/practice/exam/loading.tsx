import { lusitana } from "@/app/ui/font";
import { CardsSkeleton, ExamTableSkeleton } from "@/app/ui/skeletons";

// Route-level fallback: shown while the page's own server work resolves (grade
// lookup + chapter count) — before the page can render its inner Suspense
// boundaries. Mirrors the page layout so the transition is seamless.
// `amount` is a guess here (the real chapter_count isn't known yet at this point).
export default function Loading() {
  return (
    <main>
      <h1 className={`${lusitana.className} mb-4 text-xl md:text-2xl`}>
        Exams
      </h1>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <CardsSkeleton amount={6} />
      </div>
      <ExamTableSkeleton />
    </main>
  );
}
