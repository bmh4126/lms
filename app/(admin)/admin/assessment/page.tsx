import {
  fetchFilteredAssessments,
  fetchAllCurentClasses,
} from "@/app/lib/data/admin/data";
import { lusitana } from "@/app/ui/font";
import { Metadata } from "next";
import Selector from "@/app/ui/selector/grade-class";
import { CreateObj } from "@/app/ui/admin/buttons";
import AdminAssessmentTable from "@/app/ui/admin/assessments/table";

export const metadata: Metadata = {
  title: "Assessments | Admin",
};

export default async function Page(props: {
  searchParams?: Promise<{ grade?: string; class_id?: string }>;
}) {
  const classes = await fetchAllCurentClasses();
  // Distinct grade levels — a grade can have many classes.
  const grades = Array.from(new Set(classes.map((c) => c.grade_level))).sort(
    (a, b) => a - b,
  );

  // Params from the Selector. "" = not chosen yet, "all" = no filter.
  const searchParams = await props.searchParams;
  const gradeParam = searchParams?.grade ?? "";
  const classParam = searchParams?.class_id ?? "";

  // Only fetch once BOTH grade and class are chosen (non-blank). "all" → "" so
  // the query treats it as no filter on that dimension.
  const ready = gradeParam !== "" && classParam !== "";
  const assessments = ready
    ? await fetchFilteredAssessments(
        gradeParam === "all" ? "" : gradeParam,
        classParam === "all" ? "" : classParam,
      )
    : [];

  return (
    <div className="w-full">
      <h1 className={`${lusitana.className} mb-4 text-xl md:text-2xl`}>
        Edit Assessments Page
      </h1>
      <div className="mt-4 flex items-end justify-between gap-4 md:mt-8">
        <Selector grades={grades} classes={classes} />
        <CreateObj type="assessment" />
      </div>

      {ready ? (
        <AdminAssessmentTable assessments={assessments} />
      ) : (
        <p className="mt-4 text-sm text-gray-500">
          Choose a grade and class to view assessments.
        </p>
      )}
    </div>
  );
}
