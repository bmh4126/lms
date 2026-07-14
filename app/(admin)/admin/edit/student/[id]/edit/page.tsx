import { fetchUserById, fetchGrades } from "@/app/lib/data/admin/data";
import Back from "@/app/ui/back";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import Form from "@/app/ui/admin/user/student/edit-form";
import { lusitana } from "@/app/ui/font";

export const metadata: Metadata = {
  title: "Edit students",
};

export default async function Page(prop: { params: Promise<{ id: string }> }) {
  const params = await prop.params;
  const id = params.id;
  const [student, grades] = await Promise.all([
    fetchUserById(id),
    fetchGrades(),
  ]);

  if (!student) notFound();

  return (
    <main>
      <div className="grid grid-cols-[auto_1fr_auto] items-center mb-4">
        <Back href="/admin/student" />
        <h1
          className={`${lusitana.className} text-center text-xl md:text-2xl font-[700]`}
        >
          Edit student {student.name}
        </h1>
      </div>
      <Form student={student} grades={grades} />
    </main>
  );
}
