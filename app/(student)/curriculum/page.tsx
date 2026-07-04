import { lusitana } from "@/app/ui/font";
import { Suspense } from "react";
import CardWrapper from "@/app/ui/cards";
import { CardsSkeleton, StudentTableSkeleton } from "@/app/ui/skeletons";
import Table from "@/app/ui/curriculum/table";

export default function Page() {
  return (
    <main>
      <h1 className={`${lusitana.className} mb-4 text-xl md:text-2xl`}>
        Curriculum
      </h1>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <Suspense fallback={<CardsSkeleton type="student" />}>
          <CardWrapper type="student" />
        </Suspense>
      </div>
      <div>
        <Suspense fallback={<StudentTableSkeleton />}>
          <Table />
        </Suspense>
      </div>
    </main>
  );
}
