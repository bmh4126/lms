'use server';

import { fetchChaptersByGrade } from "@/app/lib/data/student/data";
import { auth } from "@/auth";
import { lusitana } from "../font";
import CurriculumTree from "./curriculum-tree";

export default async function CurriculumTable() {
  // const session = await auth();
  const chapters = await fetchChaptersByGrade(1);
  return (
    <div
      className={`${lusitana.className} text-xl md:text-2xl flex flex-col w-full mt-8 pb-[60vh]`}
    >
      <CurriculumTree chapters={chapters} />
    </div>
  );
}

// function ChapterList({ list }: { list: Chapter[] }) {
//   return (
//     <>
//       {list.map((chapter) => (
//         <>
//           <div
//             className="w-full bg-gray-200 rounded-md p-3 mb-4 shadow-md"
//             key={chapter.position}
//           >
//             <div className="border-r-2 bg-gray-100 p-2 rounded-t-md hover:bg-blue-100 hover:text-blue-500">
//               Chapter {chapter.position}: {chapter.title}
//             </div>
//             <TopicList list={chapter.topics} />
//           </div>
//         </>
//       ))}
//     </>
//   );
// }

// function TopicList({ list }: { list: TopicListItem[] }) {
//   return (
//     <>
//       {list.map((topic, index) => (
//         <div
//           className={clsx(
//             "bg-gray-50 p-2 border-r-2",
//             index === list.length - 1 ? "rounded-b-md border-b-2" : "",
//           )}
//           key={topic.position}
//         >
//           <div className="border-r-2 bg-gray-100 p-2 rounded-t-md hover:bg-blue-100 hover:text-blue-500">
//             Topic {topic.position}: {topic.title}
//           </div>
//           <LessonList list={topic.lessons} />
//         </div>
//       ))}
//     </>
//   );
// }

// function LessonList({ list }: { list: LessonListItem[] }) {
//   return (
//     <>
//       {list.map((lesson, index) => {
//         const lessonHref = `/curriculum/lesson/${lesson.id}`;
//         return (
//           <div
//             className={clsx(
//               " bg-gray-50 p-2 border-r-2 hover:bg-blue-100 hover:text-blue-500",
//               index === list.length - 1 ? "rounded-b-md border-b-2" : "",
//             )}
//             key={lesson.position}
//           >
//             <Link href={lessonHref}>
//               Lesson {lesson.position}: {lesson.title}
//             </Link>
//           </div>
//         );
//       })}
//     </>
//   );
// }
