"use server";

import { sql } from "../../db";
import { TeacherTable } from "../../definition";
import {
  LessonDetail,
  ChapterListItem,
  TopicListItem,
  LessonListItem,
} from "../../definition";
import z from "zod";

export async function fetchCardData(class_id:string, subject_id:string) {
  const totalChapterPromise = await sql`
    SELECT chapter_count
    FROM curriculum.subjects
    WHERE id = ${subject_id}
  `;
  const totalStudentPromise = await sql`
    SELECT COUNT(*)
    FROM school.classes c
    JOIN school.enrollments e ON e.class_id = c.id
    WHERE c.id = ${class_id}
  `;
  const data = await Promise.all([totalChapterPromise,totalStudentPromise]);
  const totalChapters = Number(data[0][0].chapter_count ?? 0);
  const totalStudents = Number(data[1][0].count ?? 0)
  return { totalChapters,totalStudents };
}

// export async function fetchClassByTeacherId(teacherId: string) {
//   const data = await sql`
//     SELECT
//       g.position AS position,
//       g.chapter_count AS chapter_count
//     FROM allocation
//     LEFT JOIN enrollment e ON e.grade = g.position
//     WHERE e.user_id = ${userId}
//   `;
//   return data[0];
// }

export async function fetchChaptersByGrade(grade: number) {
  // Read-through cache for topic_count:
  // For any chapter in this grade whose cached count is NULL (never computed),
  // count it from the source of truth (topics) — correctly 0 when the chapter
  // has no topics — and persist it. `WHERE ... IS NULL` means this only writes
  // the first time; once populated, it's a cheap no-op update.
  await sql`
    UPDATE chapters c
    SET topic_count = (SELECT COUNT(*) FROM topics t WHERE t.chapter_id = c.id)
    WHERE c.grade = ${grade} AND c.topic_count IS NULL
  `;
  // Now the stored value is guaranteed non-null; read it directly (no aggregate).
  return sql<ChapterListItem[]>`
    SELECT id, title, position, topic_count
    FROM chapters
    WHERE grade = ${grade}
    ORDER BY position
  `;
}

export async function fetchTopicCountByChapter(chapter_id: string) {
  const validatedId = z
    .object({ chapter_id: z.uuid() })
    .safeParse({ chapter_id });
  if (!validatedId.success) {
    throw {
      errors: validatedId.error.message,
      message: "Not a valid ChapterID",
    };
  }
  try {
    const data =
      await sql`SELECT COUNT(*) FROM topics WHERE chapter_id = ${validatedId.data.chapter_id}`;
    return Number(data[0].count);
  } catch (e) {
    console.log(e);
    throw e;
  }
}

export async function fetchTopicsByChapter(chapter_id: string) {
  // await delay(3000); //Remove later
  const validatedId = z
    .object({ chapter_id: z.uuid() })
    .safeParse({ chapter_id });
  if (!validatedId.success) {
    throw {
      errors: validatedId.error.message,
      message: "Not a valid ChapterID",
    };
  }
  try {
    return sql<TopicListItem[]>`
  SELECT
      t.id             AS id,
      t.title          AS title,
      t.position       AS position,
      COUNT(l.id)::int AS lesson_count
    FROM topics t
    LEFT JOIN lessons l ON l.topic_id = t.id
    WHERE t.chapter_id = ${validatedId.data.chapter_id}
    GROUP BY t.id, t.title, t.position
    ORDER BY t.position
  `;
  } catch (e) {
    console.log(e);
    throw e;
  }
}

export async function fetchLessonCountByTopic(topic_id: string) {
  const validatedId = z.object({ topic_id: z.uuid() }).safeParse({ topic_id });
  if (!validatedId.success) {
    throw {
      errors: validatedId.error.message,
      message: "Not a valid TopicID",
    };
  }
  try {
    return sql`
    SELECT COUNT(*)
    FROM chapters c
    WHERE grade = ${validatedId.data.topic_id}`;
  } catch (e) {
    console.log(e);
    throw e;
  }
}

// Lazy-load leaf: lessons for one topic. No child count — lessons have no
// children to skeleton.
export async function fetchLessonsByTopic(topic_id: string) {
  const validatedId = z.object({ topic_id: z.uuid() }).safeParse({ topic_id });
  if (!validatedId.success) {
    throw {
      errors: validatedId.error.message,
      message: "Not a valid TopicID",
    };
  }
  try {
    return sql<LessonListItem[]>`
    SELECT
      l.id       AS id,
      l.title    AS title,
      l.position AS position
    FROM lessons l
    WHERE l.topic_id = ${validatedId.data.topic_id}
    ORDER BY l.position
  `;
  } catch (e) {
    console.log(e);
    throw e;
  }
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
      message: "Not a valid LessonID",
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

const ITEMS_PER_PAGE = 6;

export async function fetchTeachersPages(query: string) {
  try {
    const data = await sql`
    SELECT COUNT(*)
    FROM school.allocations a
    JOIN school.users u ON u.id = a.teacher_id
    WHERE
      u.name ILIKE ${`%${query}%`} OR
      u.email ILIKE ${`%${query}%`}
    `;
    const totalPages = Math.ceil(Number(data[0].count) / ITEMS_PER_PAGE) || 1;
    return totalPages;
  } catch (e) {
    console.log("Database error: ", e);
    throw new Error("Cannot fetch total teachers pages");
  }
}

export async function fetchFilteredTeacher(query: string, currentPage: number) {
  const offset = (currentPage - 1) * ITEMS_PER_PAGE;
  try {
    return await sql<TeacherTable[]>`
    SELECT
      u.id,
      u.name,
      u.email,
      u.created_at
    FROM school.allocations a
    JOIN school.users u ON u.id = a.teacher_id
    WHERE
      u.name ILIKE ${`%${query}%`} OR
      u.email ILIKE ${`%${query}%`}
    ORDER BY u.name ASC
    LIMIT ${ITEMS_PER_PAGE} OFFSET ${offset}
    `;
  } catch (e) {
    console.log("Database error: ", e);
    throw new Error("Failed to fetch teachers");
  }
}
