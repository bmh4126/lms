import { lusitana } from "@/app/ui/font";
import { Metadata } from "next";
import AssignmentCards from "@/app/ui/student/practice/assignments/cards";
import AssignmentTable from "@/app/ui/student/practice/assignments/assignment-table";
import { fetchAssignmentRowsByGrade } from "@/app/lib/data/student/data";
import { auth } from "@/auth";
import { notFound } from "next/navigation";
import Pagination from "@/app/ui/admin/paginations";

export const metadata: Metadata = {
  title: "Assignment",
};

// DRAFT UI — cards + table use mock data. Real data will be linked later
// (e.g. wrap the cards/table in <Suspense> with their own server components).
export default async function Page() {
  const user = await auth();
  const userId = user?.user.id;
  if (!userId) notFound();
  const userGrade = user?.user.grade || 0;
  const { tableData, totalAssignment, totalInProgress, totalDued, avgScore } =
    await fetchAssignmentRowsByGrade(userGrade, userId);
  return (
    <main>
      <h1 className={`${lusitana.className} mb-4 text-xl md:text-2xl`}>
        Assignments
      </h1>
      {/* Part 1: stats cards */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <AssignmentCards
          totalAssignment={totalAssignment}
          totalInProgress={totalInProgress}
          totalDued={totalDued}
          avgScore={avgScore}
        />
      </div>
      <div className="mt-5 flex w-full justify-center">
        <Pagination totalPages={1} />
      </div>
      {/* Part 2: assignments/exams to do */}
      <AssignmentTable assignments={tableData} /> {/*Change later*/}
    </main>
  );
}
