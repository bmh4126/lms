"use server";

import {
  Chapter,
  TopicListItem,
  LessonDetail,
  LessonListItem,
} from "../../definition";
import { z } from "zod";
import { sql } from "../../db";

// The single database connection for the whole app.
// Only this module reads the connection string from the environment — every
// other file imports `sql` from here (Data Access Layer principle).

export async function getCurriculumPreview() {
  return sql`
    SELECT
      c.grade,
      c.title AS chapter,
      t.title AS topic,
      l.title AS lesson
    FROM chapters c
    JOIN topics  t ON t.chapter_id = c.id
    JOIN lessons l ON l.topic_id   = t.id
    ORDER BY c.grade, c.position, t.position, l.position
  `;
}

export async function fetchChaptersByGrade(grade: number) {
  return sql<Chapter[]>`
    SELECT
      c.title    AS title,
      c.position AS position,
      COALESCE(
        json_agg(
          json_build_object(
            'title', t.title,
            'position', t.position,
            'lessons', (
              SELECT COALESCE(
                json_agg(
                  json_build_object('id',l.id, 'title', l.title, 'position', l.position)
                  ORDER BY l.position
                ),
                '[]'
              )
              FROM lessons l
              WHERE l.topic_id = t.id
            )
          )
          ORDER BY t.position
        ) FILTER (WHERE t.id IS NOT NULL),
        '[]'
      ) AS topics
    FROM chapters c
    LEFT JOIN topics t ON t.chapter_id = c.id
    WHERE c.grade = ${grade}
    GROUP BY c.id, c.title, c.position
    ORDER BY c.position
  `;
}

export async function fetchCardData(grade: number) {
  const totalChapterPromise = await sql`
    SELECT COUNT(*)
    FROM chapters c
    WHERE grade = ${grade}
  `;
  const data = await Promise.all([totalChapterPromise]);
  const totalChapter = Number(data[0][0].count ?? "0");
  return { totalChapter };
}

export async function fetchLessonById(id: string) {
  const validatedId = z
    .object({
      id: z.uuid(),
    })
    .safeParse({ id });
  if (!validatedId.success) {
    throw {
      errors: validatedId.error.message,
      message: "Missing field. Failed to create invoice.",
    };
  }
  try {
    const [lesson] = await sql<LessonDetail[]>`
  SELECT
    l.title AS title,
    l.video_url AS video_url,
    l.position AS position
  FROM lessons l
  WHERE l.id = ${validatedId.data.id}
  LIMIT 1
  `;
    return lesson;
  } catch (error) {
    console.log(error);
    throw error;
  }
}
