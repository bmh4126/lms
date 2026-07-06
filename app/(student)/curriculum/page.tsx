import { lusitana } from "@/app/ui/font";
import { Suspense } from "react";
import CardWrapper from "@/app/ui/cards";
import { CardsSkeleton, StudentTableSkeleton } from "@/app/ui/skeletons";
import Table from "@/app/ui/curriculum/table";
import { treeWrapper } from "@/app/ui/curriculum/shared";
import {
  fetchChaptersByGrade,
  fetchGradeByUserId,
} from "@/app/lib/data/student/data";
import { Grade } from "@/app/lib/definition";
import { auth } from "@/auth";
import { notFound } from "next/navigation";

// Async server loader: does the slow initial chapter fetch INSIDE the Suspense
// boundary (so the skeleton streams), then hands the data to the client tree.
async function ChapterLoader({ grade }: { grade: number }) {
  const chapters = await fetchChaptersByGrade(grade);
  return (
    <div className={`${lusitana.className} ${treeWrapper}`}>
      <Table chapters={chapters} />
    </div>
  );
}

export default async function Page() {
  const student = await auth();
  const studentId = student?.user.id;
  if (!studentId) notFound();
  const studentGrade: Grade = await fetchGradeByUserId(studentId);
  const chapterCount = studentGrade.chapter_count;
  return (
    <main>
      <h1 className={`${lusitana.className} mb-4 text-xl md:text-2xl`}>
        Curriculum
      </h1>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <Suspense fallback={<CardsSkeleton type="student" />}>
          <CardWrapper type="student" userId={studentId} />
        </Suspense>
      </div>
      <div>
        <Suspense fallback={<StudentTableSkeleton amount={chapterCount} />}>
          <ChapterLoader grade={studentGrade.position} />
        </Suspense>
      </div>
    </main>
  );
}
