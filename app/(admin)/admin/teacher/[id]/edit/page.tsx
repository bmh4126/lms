import { fetchTeacherById, fetchGrades } from "@/app/lib/data/admin/data";
import Back from "@/app/ui/back";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import Form from "@/app/ui/admin/user/teacher/edit-form";
import { lusitana } from "@/app/ui/font";

export const metadata: Metadata = {
  title: "Edit teachers",
};

export default async function Page(prop: { params: Promise<{ id: string }> }) {
  const params = await prop.params;
  const id = params.id;
  const [teacher, grades] = await Promise.all([
    fetchTeacherById(id),
    fetchGrades(),
  ]);

  if (!teacher) notFound();

  return (
    <main>
      <div className="grid grid-cols-[auto_1fr_auto] items-center mb-4">
        <Back href="/admin/teacher" />
        <h1
          className={`${lusitana.className} text-center text-xl md:text-2xl font-[700]`}
        >
          Edit teacher {teacher.name}
        </h1>
      </div>
      <Form teacher={teacher} grades={grades} />
    </main>
  );
}
