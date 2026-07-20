import {
  fetchFilteredAssessments,
  fetchAssessmentPages,
  fetchAllCurentClasses,
} from "@/app/lib/data/admin/data";
import { lusitana } from "@/app/ui/font";
import { Metadata } from "next";
import Selector from "@/app/ui/selector/grade-class";
import { CreateObj } from "@/app/ui/admin/buttons";
import AdminAssessmentTable from "@/app/ui/admin/assessments/table";
import Pagination from "@/app/ui/paginations";

export const metadata: Metadata = {
  title: "Assessments | Admin",
};

export default async function Page(props: {
  searchParams?: Promise<{
    grade?: string;
    class_id?: string;
    type?: string;
    page?: string;
  }>;
}) {
  const classes = await fetchAllCurentClasses();
  // Distinct grade levels — a grade can have many classes.
  const grades = Array.from(new Set(classes.map((c) => c.grade_level))).sort(
    (a, b) => a - b,
  );

  // Params from the Selector. Grade/class default to "all" (show everything);
  // "all" → "" so the query treats it as no filter on that dimension.
  const searchParams = await props.searchParams;
  const gradeParam = searchParams?.grade ?? "all";
  const classParam = searchParams?.class_id ?? "all";
  const typeParam = searchParams?.type ?? ""; // "" = all types
  const currentPage = Math.max(1, Number(searchParams?.page) || 1);

  const grade = gradeParam === "all" ? "" : gradeParam;
  const cls = classParam === "all" ? "" : classParam;

  const [assessments, totalPages] = await Promise.all([
    fetchFilteredAssessments(grade, cls, typeParam, currentPage),
    fetchAssessmentPages(grade, cls, typeParam),
  ]);

  return (
    <div className="w-full">
      <h1 className={`${lusitana.className} mb-4 text-xl md:text-2xl`}>
        Edit Assessments Page
      </h1>
      <div className="mt-4 flex items-end justify-between gap-4 md:mt-8">
        <Selector grades={grades} classes={classes} />
        <CreateObj type="assessment" />
      </div>

      {totalPages > 1 && (
        <div className="mt-5 flex w-full justify-center">
          <Pagination totalPages={totalPages} />
        </div>
      )}
      <AdminAssessmentTable assessments={assessments} />
    </div>
  );
}
