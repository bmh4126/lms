import { lusitana } from "../../ui/font";
import { Metadata } from "next";
import { Suspense } from "react";
import CardWrapper from "@/app/ui/cards";
import { CardsSkeleton } from "@/app/ui/skeletons";
import { auth } from "@/auth";
import { Grade } from "@/app/lib/definition";
import { fetchGradeByUserId } from "@/app/lib/data/teacher/data";

export const metadata: Metadata = {
  title: "Dashboard",
};

export default async function Page() {
  const teacher = await auth();
  const teacherId = teacher?.user.id;
  if (!teacherId) return null;
  const teacherGrade: Grade = await fetchGradeByUserId(teacherId);
  const chapterCount = teacherGrade.chapter_count;
  return (
    <main>
      <h1 className={`${lusitana.className} mb-4 text-xl md:text-2xl`}>
        Dashboard
      </h1>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <Suspense fallback={<CardsSkeleton type="teacher" />}>
          <CardWrapper type="teacher" userId={teacherId} />
        </Suspense>
      </div>
    </main>
  );
}
