import { fetchStudentById, fetchAllCurentClasses } from "@/app/lib/data/admin/data";
import Back from "@/app/ui/back";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import Form from "@/app/ui/admin/user/student/edit-form";
import { lusitana } from "@/app/ui/font";
import { safeCallback } from "@/app/lib/utils";

export const metadata: Metadata = {
  title: "Edit students",
};

export default async function Page(prop: {
  params: Promise<{ id: string }>;
  searchParams?: Promise<{ callbackUrl?: string }>;
}) {
  const { id } = await prop.params;
  const sp = await prop.searchParams;
  const callbackUrl = safeCallback(sp?.callbackUrl) ?? "/admin/student";
  const [student, classes] = await Promise.all([
    fetchStudentById(id),
    fetchAllCurentClasses(),
  ]);

  if (!student) notFound();

  return (
    <main>
      <div className="grid grid-cols-[auto_1fr_auto] items-center mb-4">
        <Back href={callbackUrl} />
        <h1
          className={`${lusitana.className} text-center text-xl md:text-2xl font-[700]`}
        >
          Edit student {student.name}
        </h1>
      </div>
      <Form student={student} classes={classes} callbackUrl={callbackUrl} />
    </main>
  );
}
