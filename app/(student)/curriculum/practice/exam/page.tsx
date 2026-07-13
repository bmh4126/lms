import { lusitana } from "@/app/ui/font";
import ExamCards from "@/app/ui/student/practice/exams/exam-cards";
import ExamTable from "@/app/ui/student/practice/exams/exam-table";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Exams",
};

// DRAFT UI — cards + table use mock data. Real data will be linked later
// (e.g. wrap the cards/table in <Suspense> with their own server components).
export default function Page() {
  return (
    <main>
      <h1 className={`${lusitana.className} mb-4 text-xl md:text-2xl`}>
        Exams
      </h1>

      {/* Part 1: stats cards */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <ExamCards />
      </div>

      {/* Part 2: assignments/exams to do */}
      <ExamTable />
    </main>
  );
}
