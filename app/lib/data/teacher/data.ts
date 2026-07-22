"use server";

import { sql } from "../../db";
import { ClassForm, ClassRow, TeacherTable, Year } from "../../definition";
import {
  LessonDetail,
  ChapterListItem,
  TopicListItem,
  LessonListItem,
} from "../../definition";
import z from "zod";
import { StudentSearchResult } from "../../definition";

export async function fetchCardData(class_id: string, subject_id: string) {
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
  const data = await Promise.all([totalChapterPromise, totalStudentPromise]);
  const totalChapters = Number(data[0][0].chapter_count ?? 0);
  const totalStudents = Number(data[1][0].count ?? 0);
  return { totalChapters, totalStudents };
}

const CLASSES_PER_PAGE = 6;

export async function fetchFilteredClassesByTeacherId(
  teacherId: string,
  grade_level: string | null,
  page: number,
) {
  try {
    const offset = CLASSES_PER_PAGE * (page - 1);
    const data = await sql<ClassRow[]>`
    SELECT
      id,
      label,
      grade_level,
      total_student
    FROM school.classes
    WHERE created_by = ${teacherId} AND
      (${grade_level}::smallint IS NULL OR
      grade_level = ${grade_level}::smallint)
    ORDER BY grade_level ASC
    LIMIT ${CLASSES_PER_PAGE} OFFSET ${offset}
  `;
    return data;
  } catch (e) {
    console.log("Database error: ", e);
    throw new Error("Cannot fetch filtered classes with this TeacherID.");
  }
}

export async function fetchClassesPage(
  teacherId: string,
  grade_level: string | null,
) {
  try {
    const data = await sql`
  SELECT COUNT(*)
  FROM school.classes
  WHERE created_by = ${teacherId} AND
     (${grade_level}::smallint IS NULL OR
      grade_level = ${grade_level}::smallint)
  `;
    const totalPages = Math.ceil(
      Number(data[0].count ?? "0") / CLASSES_PER_PAGE,
    );
    return totalPages;
  } catch (e) {
    console.log("Database error: ", e);
    throw new Error("Cannot fetch total classes page with this TeacherID.");
  }
}

export async function fetchAllGrades(id?: string) {
  try {
    if (!id) {
      const data = await sql`
    SELECT position FROM school.grade_levels ORDER BY position
    `;
      return data.map((g) => g.position);
    } else {
      const data = await sql`
      SELECT grade_level FROM school.classes WHERE created_by = ${id}
      `;
      return Array.from(new Set(data.map((d)=>d.grade_level)));
    }
  } catch (e) {
    console.log("Database error: ", e);
    throw new Error(
      `Cannot fetch all grades ${id ? "for this teacher ID" : ""}.`,
    );
  }
}

// Live search for the StudentPicker: up to 5 students whose card_id matches the
// query, ordered by card_id. A read (not the write action), so it's built here.
export async function searchStudentsByCardId(
  query: string,
): Promise<StudentSearchResult[]> {
  const trimmed = query.trim();
  try {
    // Empty query -> "%%" matches everyone, so focusing shows the first 5.
    return await sql<StudentSearchResult[]>`
      SELECT id, name, card_id
      FROM school.users
      WHERE role = 'student' AND card_id ILIKE ${`%${trimmed}%`}
      ORDER BY card_id ASC
      LIMIT 5
    `;
  } catch (e) {
    console.log("Database error: ", e);
    throw new Error("Cannot search students.");
  }
}

export async function fetchAllAcademicYear() {
  try {
    const data = await sql<Year[]>`
    SELECT
      id,
      label,
      start,
      "end"
    FROM school.academic_year
    WHERE "end" >= NOW()
    `;
    return data;
  } catch (e) {
    console.log("Database error: ", e);
    throw new Error("Cannot fetch all academic year.");
  }
}

export async function fetchClassById(id: string): Promise<ClassForm> {
  try {
    const [row] = await sql<ClassForm[]>`
      SELECT
        c.id,
        c.label,
        c.grade_level,
        c.academic_year_id,
        COALESCE(
          (
            SELECT jsonb_agg(
              jsonb_build_object('id', u.id, 'name', u.name, 'card_id', u.card_id, 'group', e.group)
              ORDER BY u.card_id ASC
            )
            FROM school.users u
            JOIN school.enrollments e ON e.student_id = u.id
            WHERE e.class_id = c.id
          ),
          '[]'::jsonb
        ) AS students
      FROM school.classes c
      WHERE c.id = ${id}
    `;
    return row ?? [];
  } catch (e) {
    console.log("Database error: ", e);
    throw new Error("Cannot fetch class with such ID.");
  }
}

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
