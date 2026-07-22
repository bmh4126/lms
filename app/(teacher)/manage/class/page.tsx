import { lusitana } from "@/app/ui/font";
import { Metadata } from "next";
import Selector from "@/app/ui/selector/grade";
import { CreateObj } from "@/app/ui/admin/buttons";
import TeacherClassTable from "@/app/ui/teacher/manage/table";
import Pagination from "@/app/ui/paginations";
import { fetchAllGrades, fetchClassesPage, fetchFilteredClassesByTeacherId } from "@/app/lib/data/teacher/data";
import { auth } from "@/auth";
import { notFound } from "next/navigation";
import { CreateClass } from "@/app/ui/teacher/button";

export const metadata: Metadata = {
  title: "Manage class",
};

export default async function Page(props: {
  searchParams?: Promise<{
    grade?: string;
    class_id?: string;
    type?: string;
    page?: string;
  }>;
}) {
  const user = await auth();
  const userId = user?.user.id;
  if (!userId) notFound();
  
  // Params from the Selector. Grade/class default to "all" (show everything);
  // "all" → "" so the query treats it as no filter on that dimension.
  const searchParams = await props.searchParams;
  const gradeParam = searchParams?.grade ?? "all";
  const currentPage = Math.max(1, Number(searchParams?.page) || 1);
  
  const grade = gradeParam === "all" ? null : gradeParam;
  
  const [classes, totalPages, grades] = await Promise.all([
    fetchFilteredClassesByTeacherId(userId, grade, currentPage),
    fetchClassesPage(userId, grade),
    fetchAllGrades(userId),
  ]);

  return (
    <div className="w-full">
      <h1 className={`${lusitana.className} mb-4 text-xl md:text-2xl`}>
        Manage Class Page
      </h1>
      <div className="mt-4 flex items-end justify-between gap-4 md:mt-8">
        <Selector grades={grades}/>
        <CreateClass />
      </div>

      {totalPages > 1 && (
        <div className="mt-5 flex w-full justify-center">
          <Pagination totalPages={totalPages} />
        </div>
      )}
      <TeacherClassTable classes={classes} />
    </div>
  );
}