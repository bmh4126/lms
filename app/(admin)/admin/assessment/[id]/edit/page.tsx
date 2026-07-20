import { lusitana } from "@/app/ui/font";
import { Metadata } from "next";
import Form from "@/app/ui/admin/assessments/edit-form";
import Back from "@/app/ui/back";
import { fetchAllCurentClasses } from "@/app/lib/data/admin/data";
import { fetchAssessmentForEdit } from "@/app/lib/data/common-data";
import { notFound } from "next/navigation";
import { safeCallback } from "@/app/lib/utils";

export const metadata: Metadata = {
  title: "Edit Assessment | Admin",
};

export default async function Page(prop: {
  params: Promise<{ id: string }>;
  searchParams?: Promise<{ callbackUrl?: string }>;
}) {
  const { id } = await prop.params;
  const sp = await prop.searchParams;
  const callbackUrl = safeCallback(sp?.callbackUrl) ?? "/admin/assessment";

  const [assessment, classes] = await Promise.all([
    fetchAssessmentForEdit(id),
    fetchAllCurentClasses(),
  ]);
  if (!assessment) notFound();

  // Distinct grade levels — a grade can have many classes.
  const grades = Array.from(new Set(classes.map((c) => c.grade_level))).sort(
    (a, b) => a - b,
  );

  return (
    <main className="pb-48">
      <div className="grid grid-cols-[auto_1fr_auto] items-center mb-4">
        <Back href={callbackUrl} />
        <h1
          className={`${lusitana.className} text-center text-xl md:text-2xl font-[700]`}
        >
          Edit Assessment
        </h1>
      </div>
      <Form
        assessment={assessment}
        classes={classes}
        grades={grades}
        callbackUrl={callbackUrl}
      />
    </main>
  );
}
