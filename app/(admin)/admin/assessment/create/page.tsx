import { lusitana } from "@/app/ui/font";
import { Metadata } from "next";
import Form from "@/app/ui/admin/assessments/create-form";
import Back from "@/app/ui/back";
import { fetchAllCurentClasses } from "@/app/lib/data/admin/data";
import { safeCallback } from "@/app/lib/utils";

export const metadata: Metadata = {
  title: "Create Assessment | Admin",
};

export default async function Page(props: {
  searchParams?: Promise<{ callbackUrl?: string }>;
}) {
  const sp = await props.searchParams;
  const callbackUrl = safeCallback(sp?.callbackUrl) ?? "/admin/assessment";
  const classes = await fetchAllCurentClasses();
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
          Create Assessment
        </h1>
      </div>
      <Form classes={classes} grades={grades} callbackUrl={callbackUrl} />
    </main>
  );
}
