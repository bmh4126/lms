import { lusitana } from "@/app/ui/font";
import { Metadata } from "next";
import Form from "@/app/ui/admin/user/teacher/create-form";
import Back from "@/app/ui/back";

export const metadata: Metadata = {
  title: "Create teachers",
};

export default function Page() {
  return (
    <main>
      <div className="grid grid-cols-[auto_1fr_auto] items-center mb-4">
        <Back href="/admin/teachers" />
        <h1
          className={`${lusitana.className} text-center text-xl md:text-2xl font-[700]`}
        >
          Create teacher
        </h1>
      </div>
      <Form />
    </main>
  );
}
