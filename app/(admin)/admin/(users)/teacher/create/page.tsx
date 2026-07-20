import { lusitana } from "@/app/ui/font";
import { Metadata } from "next";
import Form from "@/app/ui/admin/user/teacher/create-form";
import Back from "@/app/ui/back";
import { safeCallback } from "@/app/lib/utils";

export const metadata: Metadata = {
  title: "Create teachers",
};

export default async function Page(props: {
  searchParams?: Promise<{ callbackUrl?: string }>;
}) {
  const sp = await props.searchParams;
  const callbackUrl = safeCallback(sp?.callbackUrl) ?? "/admin/teacher";
  return (
    <main>
      <div className="grid grid-cols-[auto_1fr_auto] items-center mb-4">
        <Back href={callbackUrl} />
        <h1
          className={`${lusitana.className} text-center text-xl md:text-2xl font-[700]`}
        >
          Create teacher
        </h1>
      </div>
      <Form callbackUrl={callbackUrl} />
    </main>
  );
}
