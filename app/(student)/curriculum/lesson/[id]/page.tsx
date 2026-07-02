import { fetchLessonById } from "@/app/lib/data/student/lessons";
import { lusitana } from "@/app/ui/font";
import notFound from "./notfound";

export default async function Page(prop: { params: Promise<{ id: string }> }) {
  const param = await prop.params;
  const id = param.id;
  const data = await fetchLessonById(id);

  if (!data) notFound();
  const lesson = data[0];

  return (
    <div className="flex w-full items-center justify-between">
      <h1 className={`${lusitana.className} text-2xl`}>{lesson.title}</h1>
      <div>{id}</div>
    </div>
  );
}
