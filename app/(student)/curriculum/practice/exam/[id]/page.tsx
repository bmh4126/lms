import { Metadata } from "next";
import Back from "@/app/ui/back";

export const metadata: Metadata = {
  title: "Session",
};

export default async function Page(prop: { params: Promise<{ id: string }> }) {
  const param = await prop.params;
  const id = param.id;
  return (
    <>
      <Back href="/curriculum/practice/exam/" />
      <p>Do exam</p>
    </>
  );
}
