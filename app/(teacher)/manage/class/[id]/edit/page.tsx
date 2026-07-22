import Back from "@/app/ui/back";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import Form from "@/app/ui/teacher/manage/class/edit-form";
import { lusitana } from "@/app/ui/font";
import { safeCallback } from "@/app/lib/utils";
import {
  fetchAllAcademicYear,
  fetchAllGrades,
  fetchClassById,
} from "@/app/lib/data/teacher/data";

export const metadata: Metadata = {
  title: "Edit Class",
};

export default async function Page(prop: {
  params: Promise<{ id: string }>;
  searchParams?: Promise<{ callbackUrl?: string }>;
}) {
  const { id } = await prop.params;
  const sp = await prop.searchParams;
  const callbackUrl = safeCallback(sp?.callbackUrl) ?? "/manage/class";
  const [grades, academic_year, row] = await Promise.all([
    fetchAllGrades(),
    fetchAllAcademicYear(),
    fetchClassById(id),
  ]);

  // if (!student) notFound();

  return (
    <main>
      <div className="grid grid-cols-[auto_1fr_auto] items-center mb-4">
        <Back href={callbackUrl} />
        <h1
          className={`${lusitana.className} text-center text-xl md:text-2xl font-[700]`}
        >
          Edit class
          {/* Edit student {student.name} */}
        </h1>
      </div>
      <Form
        grades={grades as number[]}
        classData={row}
        callbackUrl={callbackUrl}
        academic_year={academic_year}
      />
    </main>
  );
}
