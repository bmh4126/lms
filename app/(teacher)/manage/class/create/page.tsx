import { lusitana } from "@/app/ui/font";
import { Metadata } from "next";
import Form from "@/app/ui/teacher/manage/class/create-form";
import Back from "@/app/ui/back";
import { safeCallback } from "@/app/lib/utils";
import { fetchAllAcademicYear, fetchAllGrades } from "@/app/lib/data/teacher/data";

export const metadata: Metadata = {
  title: "Create class",
};

export default async function Page(props: {
  searchParams?: Promise<{ callbackUrl?: string }>;
}) {
  const sp = await props.searchParams;
  const callbackUrl = safeCallback(sp?.callbackUrl) ?? "/manage/class";
  const [grades, academic_year] = await Promise.all([
    fetchAllGrades(),
    fetchAllAcademicYear(),
  ]);
  return (
    <main>
      <div className="grid grid-cols-[auto_1fr_auto] items-center mb-4">
        <Back href={callbackUrl} />
        <h1
          className={`${lusitana.className} text-center text-xl md:text-2xl font-[700]`}
        >
          Create class
        </h1>
      </div>
      <Form grades={grades} callbackUrl={callbackUrl} academic_years={academic_year}/>
    </main>
  );
}
