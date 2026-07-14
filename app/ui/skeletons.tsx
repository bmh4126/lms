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
  amount,
}: {
  amount: number;
}) {
  // const amount = type === "student" ? 4 : type === "admin" ? 4 : 4;
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

// A full page (6 rows) of the assignment/exam tables. Both mirror the real
// table's column widths + the mobile card layout so the table area holds a
// constant height while data loads — no jump when the rows swap in.
const PRACTICE_ROWS = 6;

function Bar({ className }: { className: string }) {
  return <div className={`rounded bg-gray-200 ${className}`} />;
}

// Matches AssignmentTable: Name / Status / Due / Action (mobile: name + Due).
export function AssignmentTableSkeleton() {
  return (
    <div className="mt-6 flow-root">
      <div className="inline-block min-w-full align-middle">
        <div className="animate-pulse rounded-lg shadow-lg/30 bg-gray-50 p-2 md:pt-0">
          {/* Mobile: cards */}
          <div className="md:hidden">
            {Array.from({ length: PRACTICE_ROWS }).map((_, i) => (
              <div key={i} className="mb-2 w-full rounded-md bg-white p-4">
                <div className="flex w-full items-center justify-between gap-2 border-b pb-4">
                  <Bar className="h-6 w-1/2" />
                </div>
                <div className="flex w-full items-center justify-between pt-4">
                  <Bar className="h-4 w-36" />
                  <div className="flex flex-col items-end gap-2">
                    <Bar className="h-6 w-16 rounded-full" />
                    <Bar className="h-8 w-20" />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Desktop: table */}
          <table className="hidden min-w-full text-gray-900 md:table table-fixed">
            <thead className="rounded-lg text-left text-sm font-normal">
              <tr>
                <th className="w-1/2 px-4 py-5 sm:pl-6">
                  <Bar className="h-4 w-16" />
                </th>
                <th className="w-1/6 px-3 py-5">
                  <Bar className="h-4 w-14" />
                </th>
                <th className="w-1/6 px-3 py-5">
                  <Bar className="h-4 w-12" />
                </th>
                <th className="w-1/6 px-3 py-5" />
              </tr>
            </thead>
            <tbody className="bg-white">
              {Array.from({ length: PRACTICE_ROWS }).map((_, i) => (
                <tr key={i} className="w-full border-b last-of-type:border-none">
                  <td className="py-4 pl-6 pr-3">
                    <Bar className="h-5 w-40" />
                  </td>
                  <td className="px-3 py-4">
                    <Bar className="h-6 w-16 rounded-full" />
                  </td>
                  <td className="px-3 py-4">
                    <Bar className="h-5 w-28" />
                  </td>
                  <td className="px-3 py-4">
                    <div className="flex justify-center">
                      <Bar className="h-8 w-20" />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// Matches ExamTable: Name / Status / Duration / Questions / Open / Close / Action.
export function ExamTableSkeleton() {
  return (
    <div className="mt-6 flow-root">
      <div className="inline-block min-w-full align-middle">
        <div className="animate-pulse shadow-md/30 rounded-lg bg-gray-50 p-2 md:pt-0">
          {/* Mobile: cards */}
          <div className="md:hidden">
            {Array.from({ length: PRACTICE_ROWS }).map((_, i) => (
              <div key={i} className="mb-2 w-full rounded-md bg-white p-4">
                <div className="flex w-full items-center justify-between gap-2 border-b pb-4">
                  <Bar className="h-6 w-1/2" />
                </div>
                <div className="flex w-full items-center justify-between pt-4">
                  <div className="space-y-2">
                    <Bar className="h-4 w-24" />
                    <Bar className="h-4 w-20" />
                    <Bar className="h-4 w-36" />
                    <Bar className="h-4 w-36" />
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <Bar className="h-6 w-16 rounded-full" />
                    <Bar className="h-8 w-20" />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Desktop: table */}
          <table className="hidden min-w-full text-gray-900 md:table table-fixed">
            <thead className="rounded-lg text-left text-sm font-normal">
              <tr>
                <th className="w-1/4 px-4 py-5 sm:pl-6">
                  <Bar className="h-4 w-16" />
                </th>
                <th className="w-1/6 px-3 py-5">
                  <Bar className="h-4 w-14" />
                </th>
                <th className="w-1/8 px-3 py-5">
                  <Bar className="h-4 w-16" />
                </th>
                <th className="w-1/10 px-3 py-5">
                  <Bar className="h-4 w-16" />
                </th>
                <th className="w-1/6 px-3 py-5">
                  <Bar className="h-4 w-20" />
                </th>
                <th className="w-1/6 px-3 py-5">
                  <Bar className="h-4 w-20" />
                </th>
                <th className="w-28 px-3 py-5" />
              </tr>
            </thead>
            <tbody className="bg-white">
              {Array.from({ length: PRACTICE_ROWS }).map((_, i) => (
                <tr key={i} className="w-full border-b last-of-type:border-none">
                  <td className="py-4 pl-6 pr-3">
                    <Bar className="h-5 w-32" />
                  </td>
                  <td className="px-3 py-4">
                    <Bar className="h-6 w-16 rounded-full" />
                  </td>
                  <td className="px-3 py-4">
                    <Bar className="h-5 w-16" />
                  </td>
                  <td className="px-3 py-4">
                    <Bar className="h-5 w-8" />
                  </td>
                  <td className="px-3 py-4">
                    <Bar className="h-5 w-24" />
                  </td>
                  <td className="px-3 py-4">
                    <Bar className="h-5 w-24" />
                  </td>
                  <td className="px-3 py-4">
                    <div className="flex justify-center">
                      <Bar className="h-8 w-20" />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
