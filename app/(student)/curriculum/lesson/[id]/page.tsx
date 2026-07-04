import { fetchLessonById } from "@/app/lib/data/student/data";
import { Video } from "@/app/ui/curriculum/lecture";
import { lusitana } from "@/app/ui/font";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import { Suspense } from "react";
import { VideoSkeleton } from "@/app/ui/skeletons";

export const metadata: Metadata = {
  title: "Study",
};

export default async function Page(prop: { params: Promise<{ id: string }> }) {
  const param = await prop.params;
  const id = param.id;
  const lesson = await fetchLessonById(id);

  if (!lesson) notFound();

  return (
    <div className="block w-full">
      <div className="flex w-full flex-row items-center justify-between">
        <h1
          className={`${lusitana.className} mb-4 text-xl md:text-2xl font-[700]`}
        >
          Lesson {lesson.position}: {lesson.title}
        </h1>
      </div>
      <div className="block w-full h-full">
        <Suspense fallback={<VideoSkeleton/>}>
          <Video video_url={lesson.video_url} />
        </Suspense>
      </div>
    </div>
  );
}
