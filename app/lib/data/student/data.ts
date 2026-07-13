"use server";

import {
  LessonDetail,
  ChapterListItem,
  TopicListItem,
  LessonListItem,
  UserTable,
  AssignmentRow,
  ExamRow,
} from "../../definition";
import { z } from "zod";
import { sql } from "../../db";
import { passedDeadline, passedOpenTime } from "../../utils";

// The single database connection for the whole app.
// Only this module reads the connection string from the environment — every
// other file imports `sql` from here (Data Access Layer principle).

export async function delay(duration: number) {
  console.log("Fetching revenue data...");
  await new Promise((resolve) => setTimeout(resolve, duration));
}

export async function fetchHomeCardData(grade: number) {
  const totalChapterPromise = await sql`
    SELECT COUNT(*)
    FROM chapters c
    WHERE grade = ${grade}
  `;
  const data = await Promise.all([totalChapterPromise]);
  const totalChapter = Number(data[0][0].count ?? "0");
  return { totalChapter };
}

export async function fetchChapterCountsByGrade(grade: number) {
  try {
    const data = await sql`
    SELECT chapter_count
    FROM grades
    WHERE position = ${grade}
    `;
    return data[0].chapter_count;
  } catch (e) {
    console.log("Database error: ", e);
    throw new Error("Cannot fetch chapter counts for such grade");
  }
}

export async function fetchChaptersByGrade(grade: number) {
  try {
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
  } catch (e) {
    console.log("Database error: ", e);
    throw new Error("Cannot fetch chapters for such grade.");
  }
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

export async function fetchStudentsPages(query: string) {
  try {
    const data = await sql`
    SELECT COUNT(*)
    FROM users u
    JOIN enrollment e ON u.id = e.user_id
    WHERE
      u.role = 'student' AND
      (u.name ILIKE ${`%${query}%`} OR
      u.email ILIKE ${`%${query}%`} OR
      e.grade::text ILIKE ${`%${query}%`})
    `;
    const totalPages = Math.ceil(Number(data[0].count) / ITEMS_PER_PAGE);
    return totalPages;
  } catch (e) {
    console.log("Database error: ", e);
    throw new Error("Cannot fetch total student pages.");
  }
}

export async function fetchFilteredStudent(query: string, currentPage: number) {
  const offset = (currentPage - 1) * ITEMS_PER_PAGE;
  try {
    return await sql<UserTable[]>`
    SELECT
      u.id,
      u.name,
      u.email,
      e.grade,
      u.role,
      u.created_at
    FROM users u
    JOIN enrollment e ON u.id = e.user_id
    WHERE
      u.role = 'student' AND
      (u.name ILIKE ${`%${query}%`} OR
      u.email ILIKE ${`%${query}%`} OR
      e.grade::text ILIKE ${`%${query}%`})
      ORDER BY e.grade ASC, u.name ASC
      LIMIT ${ITEMS_PER_PAGE} OFFSET ${offset}
    `;
  } catch (e) {
    console.log("Database error: ", e);
    throw new Error("Cannot fetch filterd students.");
  }
}

export async function fetchAssignmentRowsByGrade(
  grade: number,
  userId: string,
) {
  try {
    type AssignmentQueryRow = Omit<AssignmentRow, "status">;
    const data = await sql<AssignmentQueryRow[]>`
      SELECT
        e.id AS id,
        e.name AS name,
        e.duration AS duration,
        e.deadline AS deadline,
        s.score AS score
        FROM exercises e
        LEFT JOIN submissions s ON e.id = s.exercise_id AND s.user_id = ${userId}
        WHERE e.grade = ${grade} AND
        e.kind = 'assignment'
        ORDER BY e.deadline DESC
        `;
    const tableData: AssignmentRow[] = data.map((d) => {
      if (!passedDeadline(d.deadline) && !d.score)
        return { ...d, status: "In Progress" };
      if (passedDeadline(d.deadline) && !d.score)
        return { ...d, status: "Dued" };
      return { ...d, status: "Done" };
    });
    const totalAssignment = Number(data.length);
    const totalInProgress = Number(
      data
        .map((d) => !passedDeadline(d.deadline) && !d.score)
        .filter((d) => d === true).length,
    );
    const totalDued = Number(
      data
        .map((d) => passedDeadline(d.deadline) && !d.score)
        .filter((d) => d === true).length,
    );
    const inConsideration = data.filter((d) => passedDeadline(d.deadline));
    const considertationAmount = inConsideration.length;
    const avgScore = !considertationAmount
      ? "-1"
      : Number(
          inConsideration
            .map((d) => (d.score ? parseInt(d.score) : 0))
            .reduce((acc, score) => acc + score, 0) /
            Number(considertationAmount),
        )
          .toFixed(2)
          .toString();
    return { tableData, totalAssignment, totalInProgress, totalDued, avgScore };
  } catch (e) {
    console.log("Database error: ", e);
    throw new Error("Cannot fetch assignments");
  }
}

export async function fetchExamRowsByStudentId(grade: number, userId: string) {
  try {
    type ExamQueryRow = Omit<ExamRow, "status">;
    const data = await sql<ExamQueryRow[]>`
      SELECT
        e.id AS id,
        e.name AS name,
        e.duration AS duration,
        e.question_count AS questions,
        e.deadline AS deadline,
        s.score AS score
        FROM exercises e
        LEFT JOIN submissions s ON e.id = s.exercise_id AND s.user_id = ${userId}
        WHERE e.grade = ${grade} AND
        e.kind = 'exam'
        ORDER BY e.deadline DESC
        `;
    const tableData: ExamRow[] = data.map((d) => {
      if (!passedOpenTime(d.deadline, d.duration))
        return { ...d, status: "Before Open" };
      if (
        passedOpenTime(d.deadline, d.duration) &&
        !passedDeadline(d.deadline) &&
        !d.score
      )
        return { ...d, status: "In Progress" };
      if (passedDeadline(d.deadline) && !d.score)
        return { ...d, status: "Dued" };
      return { ...d, status: "Done" };
    });
    const totalExams = Number(data.length);
    const upcoming = Number(
      data.filter((d) => !passedOpenTime(d.deadline, d.duration)).length,
    );
    const totalInProgress = Number(
      data.filter(
        (d) =>
          passedOpenTime(d.deadline, d.duration) &&
          !passedDeadline(d.deadline) &&
          !d.score,
      ).length,
    );
    const completed = Number(
      data.filter((d) => passedDeadline(d.deadline) && d.score).length,
    );
    const inConsideration = data.filter((d) => passedDeadline(d.deadline));
    const totalDued = Number(
      data.filter((d) => passedDeadline(d.deadline) && !d.score).length,
    );
    const considertationAmount = inConsideration.length;
    const avgScore = !considertationAmount
      ? Number(-1).toString()
      : Number(
          inConsideration
            .map((d) => (d.score ? parseInt(d.score) : 0))
            .reduce((acc, score) => acc + score, 0) /
            Number(inConsideration.length),
        )
          .toFixed(2)
          .toString();
    return {
      tableData,
      totalExams,
      totalInProgress,
      upcoming,
      completed,
      totalDued,
      avgScore,
    };
  } catch (e) {
    console.log("Database error: ", e);
    throw new Error("Cannot fetch exams");
  }
}

export async function fetchKindById(id: string) {
  try {
    const data = await sql<{ kind: string }[]>`
      SELECT kind
      FROM exercises e
      WHERE e.id = ${id}
    `;
    return data[0];
  } catch (e) {
    console.log("Database error: ", e);
    throw new Error("Cannot fetch the kind of this exercise.");
  }
}
