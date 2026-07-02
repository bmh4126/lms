import { fetchLessonById } from "@/app/lib/data/student/lessons";
import { lusitana } from "@/app/ui/font";
import { notFound } from "next/navigation";

export default async function Page(prop: { params: Promise<{ id: string }> }) {
  const param = await prop.params;
  const id = param.id;
  const lesson = await fetchLessonById(id);

  if (!(lesson && lesson.video_url)) notFound();

  return (
    <div className="block w-full">
      <div className="flex w-full flex-row items-center justify-between">
        <h1 className={`${lusitana.className} text-2xl`}>{lesson.title}</h1>
        <div>{id}</div>
      </div>
      <div>
        <iframe
          width="560"
          height="315"
          src={lesson.video_url}
          title="YouTube video player"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        ></iframe>
      </div>
    </div>
  );
}
