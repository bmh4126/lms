import { lusitana } from "@/app/ui/font";
import { Metadata } from "next";
import Form from "@/app/ui/admin/user/student/create-form";
import Back from "@/app/ui/back";
import { fetchAllCurentClasses } from "@/app/lib/data/admin/data";
import { Class } from "@/app/lib/definition";

export const metadata: Metadata = {
  title: "Create students",
};

export default async function Page() {
  const classes:Class[] = await fetchAllCurentClasses();
  return (
    <main>
      <div className="grid grid-cols-[auto_1fr_auto] items-center mb-4">
        <Back href="/admin/student" />
        <h1
          className={`${lusitana.className} text-center text-xl md:text-2xl font-[700]`}
        >
          Create student
        </h1>
      </div>
      <Form classes={classes} />
    </main>
  );
}
