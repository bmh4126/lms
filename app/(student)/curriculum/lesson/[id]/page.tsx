import { fetchLessonById } from "@/app/lib/data/student/lessons";
import { Video } from "@/app/ui/curriculum/lecture";
import { lusitana } from "@/app/ui/font";
import { notFound } from "next/navigation";

export default async function Page(prop: { params: Promise<{ id: string }> }) {
  const param = await prop.params;
  const id = param.id;
  const lesson = await fetchLessonById(id);

  if (!lesson) notFound();

  return (
    <div className="block w-full">
      <div className="flex w-full flex-row items-center justify-between">
        <h1 className={`${lusitana.className} text-2xl`}>{lesson.title}</h1>
        <div>{id}</div>
      </div>
      <div className="block w-full h-full">
        <Video video_url={lesson.video_url} />
      </div>
    </div>
  );
}
