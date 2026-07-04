import { fetchChaptersByGrade } from "@/app/lib/data/student/data";
import { Chapter, LessonListItem, TopicListItem } from "@/app/lib/definition";
import Link from "next/link";

export default async function CurriculumTable() {
  const chapters = await fetchChaptersByGrade(1);
  return (
    <>
      <div>Curriculum Table:</div>
      <ol className="list-decimal list-inside">
        <ChapterList list={chapters} />
      </ol>
    </>
  );
}

function ChapterList({ list }: { list: Chapter[] }) {
  return (
    <>
      {list.map((chapter) => (
        <li key={chapter.position}>
          {chapter.title}
          <ol className="list-[lower-alpha] list-inside pl-6">
            <TopicList list={chapter.topics} />
          </ol>
        </li>
      ))}
    </>
  );
}

function TopicList({ list }: { list: TopicListItem[] }) {
    return (
      <>
        {list.map((topic) => (
          <li key={topic.position}>
            {topic.title}
            <ol className="list-[lower-roman] list-inside pl-6">
              <LessonList list={topic.lessons} />
            </ol>
          </li>
        ))}
      </>
    );
}

function LessonList({ list }: { list: LessonListItem[] }) {
  return (
    <>
      {list.map((lesson) => {
        const lessonHref = `/curriculum/lesson/${lesson.id}`;
        return (
          <li key={lesson.position}>
            <Link href={lessonHref}>{lesson.title}</Link>
          </li>
        );
      })}
    </>
  );
}
