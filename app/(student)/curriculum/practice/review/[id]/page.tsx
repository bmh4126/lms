import Back from "@/app/ui/back";
import { Metadata } from "next";
import { fetchKindById } from "@/app/lib/data/student/data";

export const metadata: Metadata = {
  title: "Review",
};

export default async function Page(prop: { params: Promise<{ id: string }> }) {
  const param = await prop.params;
  const id = param.id;
  const kind = (await fetchKindById(id)).kind;
  return (
    <>
      {kind === "assignment" ? (
        <Back href="/curriculum/practice/assignment/" />
      ) : (
        <Back href="/curriculum/practice/exam/" />
      )}
      <p>Review assignment or exams</p>
    </>
  );
}
