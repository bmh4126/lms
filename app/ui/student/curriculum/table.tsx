"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import {
  ChapterListItem,
  TopicListItem,
  LessonListItem,
} from "@/app/lib/definition";
import {
  chapterHead,
  chapterRow,
  lessonList,
  lessonRow,
  topicHead,
  topicList,
  topicRow,
  treeList,
} from "../shared";
import { ChevronDownIcon, ChevronUpIcon } from "@heroicons/react/24/outline";
import {
  fetchLessonsByTopic,
  fetchTopicsByChapter,
} from "@/app/lib/data/student/data";
import { LessonListSkeleton, TopicListSkeleton } from "@/app/ui/skeletons";

// Client accordion tree. Receives the already-fetched chapter list as a prop
// (fetched on the server, in page.tsx). Topics/lessons are lazy-loaded on
// expand via server actions.
export default function Table({ chapters }: { chapters: ChapterListItem[] }) {
  return (
    <ul className={treeList}>
      {chapters.map((chapter) => (
        <ChapterNode key={chapter.id} chapter={chapter} />
      ))}
    </ul>
  );
}

function ChapterNode({ chapter }: { chapter: ChapterListItem }) {
  const [open, setOpen] = useState(false);
  // `null` = not fetched yet. Doubles as the loading gate AND the cache: once
  // set, re-opening the chapter never refetches.
  const [topics, setTopics] = useState<TopicListItem[] | null>(null);
  const [, startTransition] = useTransition();

  function toggle() {
    const next = !open;
    setOpen(next);
    // Fetch on the first open only — user-triggered, so no effect needed.
    if (!open && topics === null) {
      startTransition(async () => {
        setTopics(await fetchTopicsByChapter(chapter.id));
      });
    }
  }

  return (
    // The <li> is the chapter BOX — border + background live here.
    <li className={chapterRow}>
      {/* Title box — a separate clickable header, NOT wrapping the topics */}
      <button
        onClick={toggle}
        aria-expanded={open}
        className={`${chapterHead} bg-gray-100 transition-all hover:bg-blue-100 hover:text-blue-500`}
      >
        <div className="flex grow items-center">
          <p>
            Chapter {chapter.position}: {chapter.name}
          </p>
          <div className="hidden w-auto grow rounded-md bg-gray-50 md:block"></div>
          {!open ? (
            <ChevronDownIcon className="w-6" />
          ) : (
            <ChevronUpIcon className="w-6" />
          )}
        </div>
      </button>

      {/* Topics are a sibling of the title, still inside the chapter box.
          While loading, show a count-sized skeleton so nothing shifts. */}
      {open &&
        (topics === null ? (
          <TopicListSkeleton amount={chapter.topic_count} />
        ) : (
          <ul className={topicList}>
            {topics.map((topic) => (
              <TopicNode key={topic.id} topic={topic} />
            ))}
          </ul>
        ))}
    </li>
  );
}

function TopicNode({ topic }: { topic: TopicListItem }) {
  const [open, setOpen] = useState(false);
  const [lessons, setLessons] = useState<LessonListItem[] | null>(null);
  const [, startTransition] = useTransition();

  function toggle() {
    const next = !open;
    setOpen(next);
    if (!open && lessons === null) {
      startTransition(async () => {
        setLessons(await fetchLessonsByTopic(topic.id));
      });
    }
  }

  return (
    // Same box pattern one level down: the <li> is the topic box.
    <li className={`${topicRow} bg-white`}>
      <button
        onClick={toggle}
        aria-expanded={open}
        className={`${topicHead} bg-gray-50 transition-all hover:bg-blue-100 hover:text-blue-500`}
      >
        <div className="flex grow items-center">
          <p>
            Topic {topic.position}: {topic.name}
          </p>
          <div className="hidden w-auto grow rounded-md bg-gray-50 md:block"></div>
          {!open ? (
            <ChevronDownIcon className="w-6" />
          ) : (
            <ChevronUpIcon className="w-6" />
          )}
        </div>
      </button>

      {/* Lessons stay inside the topic box. */}
      {open &&
        (lessons === null ? (
          <LessonListSkeleton amount={topic.lesson_count} />
        ) : (
          <ul className={lessonList}>
            {lessons.map((lesson) => (
              <li key={lesson.id}>
                <Link
                  href={`/curriculum/lesson/${lesson.id}`}
                  className={`${lessonRow} hover:bg-blue-100 hover:text-blue-600`}
                >
                  Lesson {lesson.position}: {lesson.name}
                </Link>
              </li>
            ))}
          </ul>
        ))}
    </li>
  );
}
