import { fetchTeacherById } from "@/app/lib/data/admin/data";
import Back from "@/app/ui/back";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import Form from "@/app/ui/admin/user/teacher/edit-form";
import { lusitana } from "@/app/ui/font";
import { safeCallback } from "@/app/lib/utils";

export const metadata: Metadata = {
  title: "Edit teachers",
};

export default async function Page(prop: {
  params: Promise<{ id: string }>;
  searchParams?: Promise<{ callbackUrl?: string }>;
}) {
  const { id } = await prop.params;
  const sp = await prop.searchParams;
  const callbackUrl = safeCallback(sp?.callbackUrl) ?? "/admin/teacher";
  const teacher = await fetchTeacherById(id);

  if (!teacher) notFound();

  return (
    <main>
      <div className="grid grid-cols-[auto_1fr_auto] items-center mb-4">
        <Back href={callbackUrl} />
        <h1
          className={`${lusitana.className} text-center text-xl md:text-2xl font-[700]`}
        >
          Edit teacher {teacher.name}
        </h1>
      </div>
      <Form teacher={teacher} callbackUrl={callbackUrl} />
    </main>
  );
}
