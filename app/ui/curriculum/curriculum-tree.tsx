"use client";

import { useState } from "react";
import Link from "next/link";
import clsx from "clsx";
import { Chapter } from "@/app/lib/definition";

export default function CurriculumTree({ chapters }: { chapters: Chapter[] }) {
  return (
      <ul className="flex flex-col gap-3 w-full">
        {chapters.map((chapter) => (
          <ChapterNode key={chapter.position} chapter={chapter} />
        ))}
      </ul>
  );
}

function ChapterNode({ chapter }: { chapter: Chapter }) {
  const [open, setOpen] = useState(false);
  return (
    // The <li> is the chapter BOX — border + background live here.
    <li className="w-full overflow-hidden rounded-md border-b-2 border-r-2 transition-all ">
      {/* Title box — a separate clickable header, NOT wrapping the topics */}
      <button
        onClick={() => setOpen((o) => !o && !!chapter.topics.length)}
        aria-expanded={open}
        className="bg-gray-100 w-full text-left p-4 font-semibold transition-all hover:bg-blue-100 hover:text-blue-500"
      >
       Chapter {chapter.position}: {chapter.title}
      </button>

      {/* Topics are a sibling of the title, still inside the chapter box */}
      {open && (
        <ul className="flex flex-col gap-2 p-3">
          {chapter.topics.map((topic) => (
            <TopicNode key={topic.position} topic={topic} />
          ))}
        </ul>
      )}
    </li>
  );
}

function TopicNode({ topic }: { topic: Chapter["topics"][number] }) {
  const [open, setOpen] = useState(false);
  return (
    // Same box pattern one level down: the <li> is the topic box.
    <li className="overflow-hidden rounded-md border-b-2 border-r-2 bg-white transition-all">
      <button
        onClick={() => setOpen((o) => !o && !!topic.lessons.length)}
        aria-expanded={open}
        className="bg-gray-50 w-full text-left p-3 transition-all hover:bg-blue-100 hover:text-blue-500"
      >
        Topic {topic.position}: {topic.title}
      </button>

      {/* Lessons stay inside the topic box */}
      {open && (
        <ul className="flex flex-col gap-1 p-2 pl-4">
          {topic.lessons.map((lesson) => (
            <li key={lesson.id}>
              <Link
                href={`/curriculum/lesson/${lesson.id}`}
                className="border-r-2 border-b-2 rounded-md block rounded p-2 hover:bg-blue-100 hover:text-blue-600"
              >
                      Lesson {lesson.position}: {lesson.title}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </li>
  );
}
