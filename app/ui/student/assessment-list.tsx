import { lusitana } from "@/app/ui/font";
import AssignmentCards from "@/app/ui/student/practice/assignments/cards";
import ExamCards from "@/app/ui/student/practice/exams/cards";
import AssignmentTable from "@/app/ui/student/practice/assignments/assignment-table";
import ExamTable from "@/app/ui/student/practice/exams/exam-table";
import {
  fetchAssessmentRows,
  fetchStudentClassById,
} from "@/app/lib/data/student/data";
import { auth } from "@/auth";
import { notFound } from "next/navigation";

// Shared list for both static routes (/assessment/assignment, /assessment/exam).
export default async function AssessmentList({
  type,
}: {
  type: "assignment" | "exam";
}) {
  const student = await auth();
  if (!student) notFound();
  const studentId = student.user.id;
  if (!studentId) notFound();

  const studentClass = await fetchStudentClassById(studentId);
  const { tableData, total, totalInProgress, upcoming, completed, totalDued, avgScore } =
    await fetchAssessmentRows(
      type,
      studentClass.grade_level,
      studentClass.class_id,
      studentId,
    );

  return (
    <main>
      <h1 className={`${lusitana.className} mb-4 text-xl md:text-2xl`}>
        {type === "assignment" ? "Assignments" : "Exams"}
      </h1>

      {/* Stats cards — the two types show a different set */}
      {type === "assignment" ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <AssignmentCards
            totalAssignment={total}
            totalInProgress={totalInProgress}
            totalDued={totalDued}
            avgScore={avgScore}
          />
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <ExamCards
            totalExams={total}
            totalInProgress={totalInProgress}
            upcoming={upcoming}
            completed={completed}
            totalDued={totalDued}
            avgScore={avgScore}
          />
        </div>
      )}

      {/* Assessments to do */}
      {type === "assignment" ? (
        <AssignmentTable assignments={tableData} />
      ) : (
        <ExamTable exams={tableData} />
      )}
    </main>
  );
}
