import {
  fetchExamRowsByStudentId,
  fetchStudentClassById,
} from "@/app/lib/data/student/data";
import { lusitana } from "@/app/ui/font";
import ExamCards from "@/app/ui/student/practice/exams/cards";
import ExamTable from "@/app/ui/student/practice/exams/exam-table";
import { auth } from "@/auth";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import Pagination from "@/app/ui/paginations";

export const metadata: Metadata = {
  title: "Exams",
};

// DRAFT UI — cards + table use mock data. Real data will be linked later
// (e.g. wrap the cards/table in <Suspense> with their own server components).
export default async function Page() {
  const student = await auth();
  if (!student) notFound();
  const studentId = student.user.id;
  if (!studentId) notFound();
  const studentClass = await fetchStudentClassById(studentId);
  const {
    tableData,
    totalExams,
    totalInProgress,
    upcoming,
    completed,
    totalDued,
    avgScore,
  } = await fetchExamRowsByStudentId(
    studentClass.grade_level,
    studentClass.class_id,
    studentId,
  );
  return (
    <main>
      <h1 className={`${lusitana.className} mb-4 text-xl md:text-2xl`}>
        Exams
      </h1>

      {/* Part 1: stats cards */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <ExamCards
          totalExams={totalExams}
          totalInProgress={totalInProgress}
          upcoming={upcoming}
          completed={completed}
          totalDued={totalDued}
          avgScore={avgScore}
        />
      </div>
      {/* <div className="mt-5 flex w-full justify-center">
        <Pagination totalPages={1} />
      </div> */}
      {/* Part 2: assignments/exams to do */}
      <ExamTable exams={tableData} />
    </main>
  );
}
