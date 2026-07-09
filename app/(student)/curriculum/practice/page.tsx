import { lusitana } from "@/app/ui/font";
import { Metadata } from "next";
import AssignmentCards from "@/app/ui/student/practice/assignment-cards";
import AssignmentTable from "@/app/ui/student/practice/assignment-table";

export const metadata: Metadata = {
  title: "Practice",
};

// DRAFT UI — cards + table use mock data. Real data will be linked later
// (e.g. wrap the cards/table in <Suspense> with their own server components).
export default function Page() {
  return (
    <main>
      <h1 className={`${lusitana.className} mb-4 text-xl md:text-2xl`}>
        Assignments
      </h1>

      {/* Part 1: stats cards */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <AssignmentCards />
      </div>

      {/* Part 2: assignments/exams to do */}
      <AssignmentTable />
    </main>
  );
}
