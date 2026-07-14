import { lusitana } from "@/app/ui/font";
import { Suspense } from "react";
import CardWrapper from "@/app/ui/student/curriculum/cards";
import { CardsSkeleton, StudentTableSkeleton } from "@/app/ui/skeletons";
import Table from "@/app/ui/student/curriculum/table";
import { treeWrapper } from "@/app/ui/student/shared";
import {
  fetchChaptersBySubject,
  fetchStudentClassById,
} from "@/app/lib/data/student/data";
import { auth } from "@/auth";
import { notFound } from "next/navigation";
import { sql } from "@/app/lib/db";

// Async server loader: does the slow initial chapter fetch INSIDE the Suspense
// boundary (so the skeleton streams), then hands the data to the client tree.
async function ChapterLoader({ subject_id }: { subject_id: string }) {
  const chapters = await fetchChaptersBySubject(subject_id);
  return (
    <div className={`${lusitana.className} ${treeWrapper}`}>
      <Table chapters={chapters} />
    </div>
  );
}

export default async function Page() {
  const student = await auth();
  if (!student) notFound();
  const studentId = student.user.id;
  if (!studentId) notFound();
  const studentClass = await fetchStudentClassById(studentId);
  const subject_id_promise = await sql`
  SELECT id, chapter_count
  FROM subjects
  WHERE grade = ${studentClass.grade} AND
    name = 'Mathematics'
  `
  const subject_id = subject_id_promise[0].id
  const chapterCount = subject_id_promise[0].chapter_count;
  return (
    <main>
      <h1 className={`${lusitana.className} mb-4 text-xl md:text-2xl`}>
        Curriculum
      </h1>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <CardWrapper subject_id={ subject_id} />
      </div>
      <div>
        <Suspense fallback={<StudentTableSkeleton amount={chapterCount} />}>
          <ChapterLoader subject_id={subject_id} />
        </Suspense>
      </div>
    </main>
  );
}
