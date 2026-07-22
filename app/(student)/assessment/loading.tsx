"use client";

import { lusitana } from "@/app/ui/font";
import { CardsSkeleton, AssignmentTableSkeleton } from "@/app/ui/skeletons";
import clsx from "clsx";
import { usePathname } from "next/navigation";

// Fallback for the list page. Generic (loading.tsx can't read the query), so it
// mirrors the shared list layout: stat cards + a table.
export default function Loading() {
  const pathname = usePathname();
  const type = pathname.split("/")[pathname.split("/").length - 1];
  const amount = type === "exam" ? 6 : 4;
  return (
    <main>
      <h1 className={`${lusitana.className} mb-4 text-xl md:text-2xl`}>
        Assessments
      </h1>
      <div
        className={clsx([
          "grid gap-6 sm:grid-cols-2",
          type === 'exam' ? "lg:grid-cols-3" : "lg:grid-cols-4",
        ])}
      >
        <CardsSkeleton amount={amount} />
      </div>
      <AssignmentTableSkeleton />
    </main>
  );
}
