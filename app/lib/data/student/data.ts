"use server";

import {
  LessonDetail,
  ChapterListItem,
  TopicListItem,
  LessonListItem,
  StudentTable,
  AssignmentRow,
  ExamRow,
} from "../../definition";
import { z } from "zod";
import { sql } from "../../db";
import {
  closeTime,
  passedCloseTime,
  passedOpenTime,
  compareExams,
} from "../../utils";

// The single database connection for the whole app.
// Only this module reads the connection string from the environment — every
// other file imports `sql` from here (Data Access Layer principle).

export async function delay(duration: number) {
  console.log("Fetching revenue data...");
  await new Promise((resolve) => setTimeout(resolve, duration));
}

export async function fetchStudentClassById(student_id: string) {
  try {
    const data = await sql`
    SELECT 
    c.grade AS grade,
    c.id AS class_id
    FROM enrollments e
    JOIN classes c ON c.id = e.class_id
    WHERE e.student_id = ${student_id}
    `;
    return data[0];
  } catch (e) {
    console.log("Database error: ", e);
    throw new Error("Cannot fetch the class for such student.");
  }
}

export async function fetchHomeCardData(subject_id: string) {
  try {
    const totalChapterPromise = await sql`
    SELECT chapter_count
    FROM subjects
    WHERE id = ${subject_id}
  `;
    const data = await Promise.all([totalChapterPromise]);
    const totalChapter = Number(data[0][0].chapter_count ?? "0");
    return { totalChapter };
  } catch (e) {
    console.log("Database error: ", e);
    throw new Error("Cannot fetch stats for card on home page.");
  }
}

export async function fetchChaptersBySubject(subject_id: string) {
  const validatedId = z
    .object({ subject_id: z.uuid() })
    .safeParse({ subject_id });
  if (!validatedId.success) {
    throw {
      errors: validatedId.error.message,
      message: "Not a valid SubjectID",
    };
  }
  try {
    //   await sql`
    //   UPDATE chapters c
    //   SET topic_count = (SELECT COUNT(*) FROM topics t WHERE t.chapter_id = c.id)
    //   WHERE c.subject_id = ${subject_id} AND c.topic_count IS NULL
    // `;
    return sql<ChapterListItem[]>`
    SELECT id, name, position, topic_count
    FROM chapters
    WHERE subject_id = ${validatedId.data.subject_id}
    ORDER BY position
  `;
  } catch (e) {
    console.log("Database error: ", e);
    throw new Error("Cannot fetch chapters for such subject.");
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
      id,
      name,
      position,
      lesson_count
    FROM topics
    WHERE chapter_id = ${validatedId.data.chapter_id}
    ORDER BY position
  `;
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
      id,
      name,
      position
    FROM lessons
    WHERE topic_id = ${validatedId.data.topic_id}
    ORDER BY position
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
    name,
    video_url,
    position
  FROM lessons
  WHERE id = ${validatedId.data.id}
  LIMIT 1
  `;
    return lesson;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function fetchAssignmentRowsByClass(
  class_id: string,
  studentId: string,
) {
  try {
    type AssignmentQueryRow = Omit<AssignmentRow, "status">;
    const data = await sql<AssignmentQueryRow[]>`
    SELECT
    a.id,
    a.name,
    a.deadline AS close,
    s.score
    FROM assignments a
    LEFT JOIN submissions s ON a.id = s.assignment_id AND s.user_id = ${studentId}
    WHERE a.class_id = ${class_id}
    ORDER BY a.deadline DESC
    `;
    const tableData: AssignmentRow[] = data.map((d) => {
      if (!passedCloseTime(d.close) && !d.score)
        return { ...d, status: "In Progress" };
      if (passedCloseTime(d.close) && !d.score) return { ...d, status: "Dued" };
      return { ...d, status: "Done" };
    });
    const totalAssignment = Number(data.length);
    const totalInProgress = Number(
      data
        .map((d) => !passedCloseTime(d.close) && !d.score)
        .filter((d) => d === true).length,
    );
    const totalDued = Number(
      data
        .map((d) => passedCloseTime(d.close) && !d.score)
        .filter((d) => d === true).length,
    );
    const inConsideration = data.filter(
      (d) => passedCloseTime(d.close) || d.score,
    );
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

export async function fetchExamRowsByStudentId(
  class_id: string,
  studentId: string,
) {
  try {
    type ExamQueryRow = Omit<ExamRow, "status">;
    const data = await sql<ExamQueryRow[]>`
    SELECT
    e.id,
    e.name,
    e.duration,
    e.question_count,
    e.start,
    s.score AS score
    FROM exams e
    LEFT JOIN submissions s ON e.id = s.exam_id AND s.user_id = ${studentId}
    WHERE e.class_id = ${class_id}
    ORDER BY e.start DESC
    `;
    const tableDataBuild: ExamRow[] = data.map((d) => {
      if (!passedOpenTime(d.start)) return { ...d, status: "Before Open" };
      if (
        passedOpenTime(d.start) &&
        !passedCloseTime(closeTime(d.start, d.duration)) &&
        !d.score
      )
        return { ...d, status: "In Progress" };
      if (passedCloseTime(closeTime(d.start, d.duration)) && !d.score)
        return { ...d, status: "Dued" };
      return { ...d, status: "Done" };
    });
    const tableData = tableDataBuild.sort(compareExams);
    const totalExams = Number(data.length);
    const upcoming = Number(
      data.filter((d) => !passedOpenTime(d.start)).length,
    );
    const totalInProgress = Number(
      data.filter(
        (d) =>
          passedOpenTime(d.start) &&
          !passedCloseTime(closeTime(d.start, d.duration)) &&
          !d.score,
      ).length,
    );
    const completed = Number(
      data.filter(
        (d) => d.score,
      ).length,
    );
    const inConsideration = data.filter(
      (d) => passedCloseTime(closeTime(d.start, d.duration)) || d.score,
    );
    const totalDued = Number(
      data.filter(
        (d) => passedCloseTime(closeTime(d.start, d.duration)) && !d.score,
      ).length,
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
    const data = await sql`
    SELECT COUNT(*)
    FROM submissions
    WHERE assignment_id = ${id}
    `;
    return data[0].count ? 'assignment':'exam';
  } catch (e) {
    console.log("Database error: ", e);
    throw new Error("Cannot fetch the kind of this exercise.");
  }
}

const ITEMS_PER_PAGE = 6;

export async function fetchStudentsPages(query: string) {
  try {
    const data = await sql`
    SELECT COUNT(*)
    FROM enrollments e
    JOIN users u ON u.id = e.student_id
    JOIN classes c on c.id = e.class_id
    WHERE
      u.name ILIKE ${`%${query}%`} OR
      u.email ILIKE ${`%${query}%`} OR
      c.label ILIKE ${`%${query}%`}
    `;
    const totalPages = Math.ceil(Number(data[0].count) / ITEMS_PER_PAGE) || 1;
    return totalPages;
  } catch (e) {
    console.log("Database error: ", e);
    throw new Error("Cannot fetch total student pages.");
  }
}

export async function fetchFilteredStudent(query: string, currentPage: number) {
  const offset = (currentPage - 1) * ITEMS_PER_PAGE;
  try {
    return await sql<StudentTable[]>`
    SELECT
      u.id,
      u.name,
      u.email,
      c.label,
      u.role,
      u.created_at
    FROM enrollments e
    JOIN users u ON u.id = e.student_id
    JOIN classes c ON c.id = e.class_id
    WHERE
      u.name ILIKE ${`%${query}%`} OR
      u.email ILIKE ${`%${query}%`} OR
      c.label::text ILIKE ${`%${query}%`}
      ORDER BY c.grade ASC, u.name ASC
      LIMIT ${ITEMS_PER_PAGE} OFFSET ${offset}
    `;
  } catch (e) {
    console.log("Database error: ", e);
    throw new Error("Cannot fetch filterd students.");
  }
}
