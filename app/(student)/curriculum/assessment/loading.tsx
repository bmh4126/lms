import { lusitana } from "@/app/ui/font";
import { CardsSkeleton, AssignmentTableSkeleton } from "@/app/ui/skeletons";

// Fallback for the list page. Generic (loading.tsx can't read the query), so it
// mirrors the shared list layout: stat cards + a table.
export default function Loading() {
  return (
    <main>
      <h1 className={`${lusitana.className} mb-4 text-xl md:text-2xl`}>
        Assessments
      </h1>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <CardsSkeleton amount={4} />
      </div>
      <AssignmentTableSkeleton />
    </main>
  );
}
