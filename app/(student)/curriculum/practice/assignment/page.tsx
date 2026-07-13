import { lusitana } from "@/app/ui/font";
import { Metadata } from "next";
import CardWrapper from "@/app/ui/cards";
import AssignmentTable from "@/app/ui/student/practice/assignments/assignment-table";
import {
  fetchAssignmentRowsByGrade,
  fetchGradeByUserId,
} from "@/app/lib/data/student/data";
import { auth } from "@/auth";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { CardsSkeleton } from "@/app/ui/skeletons";

export const metadata: Metadata = {
  title: "Assignment",
};

// DRAFT UI — cards + table use mock data. Real data will be linked later
// (e.g. wrap the cards/table in <Suspense> with their own server components).
export default async function Page() {
  const user = await auth();
  const userId = user?.user.id;
  if (!userId) notFound();
  const userGrade = await fetchGradeByUserId(userId);
  const tableData = await fetchAssignmentRowsByGrade(
    userGrade.position,
    userId,
  );
  return (
    <main>
      <h1 className={`${lusitana.className} mb-4 text-xl md:text-2xl`}>
        Assignments
      </h1>

      {/* Part 1: stats cards */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <Suspense fallback={<CardsSkeleton type="assignment" />}>
          <CardWrapper type="assignment" userId={userId} />
        </Suspense>
      </div>

      {/* Part 2: assignments/exams to do */}
      <AssignmentTable assignments={tableData} />
    </main>
  );
}
