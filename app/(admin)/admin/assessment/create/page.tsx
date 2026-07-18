import { lusitana } from "@/app/ui/font";
import { Metadata } from "next";
import Form from "@/app/ui/admin/assessments/create-form";
import Back from "@/app/ui/back";
import { fetchAllCurentClasses } from "@/app/lib/data/admin/data";

export const metadata: Metadata = {
  title: "Create Assessment | Admin",
};

export default async function Page() {
  const classes = await fetchAllCurentClasses();
  // Distinct grade levels — a grade can have many classes.
  const grades = Array.from(new Set(classes.map((c) => c.grade_level))).sort(
    (a, b) => a - b,
  );

  return (
    <main className="pb-48">
      <div className="grid grid-cols-[auto_1fr_auto] items-center mb-4">
        <Back href="/admin/assessment" />
        <h1
          className={`${lusitana.className} text-center text-xl md:text-2xl font-[700]`}
        >
          Create Assessment
        </h1>
      </div>
      <Form classes={classes} grades={grades} />
    </main>
  );
}
