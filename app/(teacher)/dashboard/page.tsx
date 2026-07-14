import { lusitana } from "../../ui/font";
import { Metadata } from "next";
import { Suspense } from "react";
import CardWrapper from "@/app/ui/teacher/dashboard/cards";
import { CardsSkeleton } from "@/app/ui/skeletons";
import { auth } from "@/auth";
import { sql } from "@/app/lib/db";

export const metadata: Metadata = {
  title: "Dashboard",
};

export default async function Page() {
  const teacher = await auth();
  const teacherId = teacher?.user.id;
  if (!teacherId) return null;
  const teacherClassId = "62b73a97-a31e-41e7-9438-692e46438b22"; //Change later
  const teacherSubjectId = "25547b83-fadf-4e14-a751-809cf3dfedb2"; //Change later
  const subject_id_promise = await sql`
    SELECT chapter_count
    FROM subjects
    WHERE id = ${teacherSubjectId}
  `;
  const chapterCount = subject_id_promise[0].chapter_count;
  return (
    <main>
      <h1 className={`${lusitana.className} mb-4 text-xl md:text-2xl`}>
        Dashboard
      </h1>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <Suspense fallback={<CardsSkeleton amount={4} />}>
          <CardWrapper
            class_id={teacherClassId}
            subject_id={teacherSubjectId}
          />
        </Suspense>
      </div>
    </main>
  );
}
