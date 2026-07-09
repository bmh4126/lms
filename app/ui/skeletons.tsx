import { lusitana } from "./font";
import {
  chapterHead,
  chapterRow,
  lessonList,
  lessonRow,
  topicHead,
  topicList,
  topicRow,
  treeList,
  treeWrapper,
} from "./student/shared";
import { ChevronDownIcon } from "@heroicons/react/24/outline";

// Loading animation
const shimmer =
  "before:absolute before:inset-0 before:animate-shimmer before:bg-gradient-to-r before:from-transparent before:via-white/60 before:to-transparent";

export function CardSkeleton() {
  return (
    <div
      className={`${shimmer} relative overflow-hidden rounded-xl bg-gray-100 p-2 shadow-sm`}
    >
      <div className="flex p-4">
        <div className="h-5 w-5 rounded-md bg-gray-200" />
        <div className="ml-2 h-6 w-16 rounded-md bg-gray-200 text-sm font-medium" />
      </div>
      <div className="flex items-center justify-center truncate rounded-xl bg-white px-4 py-8">
        <div className="h-7 w-20 rounded-md bg-gray-200" />
      </div>
    </div>
  );
}

export async function CardsSkeleton({
  type,
}: {
  type: "student" | "admin" | "teacher";
}) {
  // const amount = type === "student" ? 4 : type === "admin" ? 4 : 4;
  const amount = 4;
  return (
    <>
      {Array.from({ length: amount }, (_, i) => (
        <CardSkeleton key={i} />
      ))}
    </>
  );
}

export function VideoSkeleton() {
  return (
    <div
      className={`${shimmer} w-full aspect-16/9 relative overflow-hidden rounded-xl bg-gray-100 flex items-center justify-center`}
    >
      <h1 className={`${lusitana.className} text-xl`}>Loading video...</h1>
    </div>
  );
}

// One placeholder chapter row. Uses the SAME `chapterRow`/`chapterHead`
// primitives as the real <ChapterNode>, so its box model is identical.
// The bar is `h-7 md:h-8` to match the text-xl/2xl line-height (1.75rem / 2rem)
// of a real collapsed chapter title — no fixed height guessing.
function StudentTableBoxSkeleton() {
  return (
    <li
      className={`${shimmer} ${chapterRow} group relative bg-gray-100 hover:bg-blue-100`}
    >
      <div className={chapterHead}>
        <div className="h-7 md:h-8 w-1/2 rounded bg-gray-200 group-hover:bg-blue-200" />
        {/* <div className="hidden w-auto grow rounded-md bg-gray-50 md:block"></div> */}
        {/* <ChevronDownIcon className="w-6" /> */}
      </div>
    </li>
  );
}

export function StudentTableSkeleton({amount}: {amount: number} ) {
  const length = amount || 4;
  return (
    <div className={`${lusitana.className} ${treeWrapper}`}>
      <ul className={treeList}>
        {Array.from({ length }, (_, i) => (
          <StudentTableBoxSkeleton key={i} />
        ))}
      </ul>
    </div>
  );
}

// Topic-level fallback: rendered INSIDE an expanded chapter while that chapter's
// topics are being fetched. Size it with the chapter's `topic_count`. Mirrors
// the real <TopicNode> via the shared topic* primitives, so the topics swap in
// without shifting. The bar is `h-7 md:h-8` to match the inherited line-height.
export function TopicListSkeleton({ amount }: { amount: number }) {
  const length = amount || 3;
  return (
    <ul className={topicList}>
      {Array.from({ length }, (_, i) => (
        <li key={i} className={`${shimmer} ${topicRow} relative bg-white`}>
          <div className={topicHead}>
            <div className="h-7 md:h-8 w-2/5 rounded bg-gray-200" />
          </div>
        </li>
      ))}
    </ul>
  );
}

// Lesson-level fallback: rendered INSIDE an expanded topic while that topic's
// lessons are being fetched. Size it with the topic's `lesson_count`. Mirrors
// the real lesson <Link> row via the shared lesson* primitives.
export function LessonListSkeleton({ amount }: { amount: number }) {
  const length = amount || 4;
  return (
    <ul className={lessonList}>
      {Array.from({ length }, (_, i) => (
        <li key={i}>
          <div
            className={`${shimmer} ${lessonRow} relative overflow-hidden bg-gray-100`}
          >
            <div className="h-7 md:h-8 w-1/3 rounded bg-gray-200" />
          </div>
        </li>
      ))}
    </ul>
  );
}
