"use server";

import {
  LessonDetail,
  ChapterListItem,
  TopicListItem,
  LessonListItem,
  StudentTable,
  Assessment,
  Question,
} from "../../definition";
import { z } from "zod";
import { sql } from "../../db";
import { passedTime, compareExams } from "../../utils";

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
    c.grade_level AS grade_level,
    c.id AS class_id
    FROM school.enrollments e
    JOIN school.classes c ON c.id = e.class_id
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
    FROM curriculum.subjects
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
    FROM curriculum.chapters
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
    FROM curriculum.topics
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
    FROM curriculum.lessons
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
  FROM curriculum.lessons
  WHERE id = ${validatedId.data.id}
  LIMIT 1
  `;
    return lesson;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

// Unified list fetch for both assessment types. `type` filters the rows; the
// returned stats are a superset so either card set can pull what it needs.
export async function fetchAssessmentRows(
  type: "assignment" | "exam",
  grade_level: number,
  class_id: string,
  studentId: string,
) {
  try {
    type Row = Omit<Assessment, "status">;
    const data = await sql<Row[]>`
    SELECT
      a.id,
      a.name,
      a.open,
      a.close,
      a.question_count,
      a.type,
      s.score
    FROM practice.assessments a
    LEFT JOIN practice.assessment_grade_level agl ON agl.assessment_id = a.id
    LEFT JOIN practice.assessment_class ac ON ac.assessment_id = a.id
    LEFT JOIN practice.submissions s ON a.id = s.assessment_id AND s.user_id = ${studentId}
    WHERE a.type = ${type} AND
      (agl.grade_level = ${grade_level} OR
      ac.class_id = ${class_id})
    `;
    const tableDataBuild: Assessment[] = data.map((d) => {
      if (!passedTime(d.open)) return { ...d, status: "Before Open" };
      if (!passedTime(d.close)) {
        // Window open: submitted → "Submitted", otherwise still "In Progress".
        return { ...d, status: d.score !== null ? "Submitted" : "In Progress" };
      }
      // Window closed: submitted → "Done" (score shown), otherwise "Dued".
      return { ...d, status: d.score ? "Done" : "Dued" };
    });
    const tableData = tableDataBuild.sort(compareExams);
    const total = Number(data.length);
    const upcoming = Number(data.filter((d) => !passedTime(d.open)).length);
    const totalInProgress = Number(
      data.filter((d) => passedTime(d.open) && !passedTime(d.close))
        .length,
    );
    const completed = Number(data.filter((d) => d.score).length);
    const totalDued = Number(
      data.filter((d) => passedTime(d.close) && !d.score).length,
    );
    const inConsideration = data.filter((d) => passedTime(d.close));
    const considertationAmount: number = inConsideration.reduce(
      (acc, d) => acc + d.question_count,
      0,
    );
    const avgScore = !considertationAmount
      ? "-1"
      : Number(
          (inConsideration
            .map((d) => (d.score ? parseInt(d.score) : 0))
            .reduce((acc, score) => acc + score, 0) /
            considertationAmount) *
            100,
        )
          .toFixed(2)
          .toString();
    return {
      tableData,
      total,
      totalInProgress,
      upcoming,
      completed,
      totalDued,
      avgScore,
    };
  } catch (e) {
    console.log("Database error: ", e);
    throw new Error(`Cannot fetch ${type}s`);
  }
}

const ITEMS_PER_PAGE = 6;

export async function fetchStudentsPages(query: string) {
  try {
    const data = await sql`
    SELECT COUNT(*)
    FROM school.enrollments e
    JOIN school.users u ON u.id = e.student_id
    JOIN school.classes c on c.id = e.class_id
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
    FROM school.enrollments e
    JOIN school.users u ON u.id = e.student_id
    JOIN school.classes c ON c.id = e.class_id
    WHERE
      u.name ILIKE ${`%${query}%`} OR
      u.email ILIKE ${`%${query}%`} OR
      c.label::text ILIKE ${`%${query}%`}
      ORDER BY c.grade_level ASC, u.name ASC
      LIMIT ${ITEMS_PER_PAGE} OFFSET ${offset}
    `;
  } catch (e) {
    console.log("Database error: ", e);
    throw new Error("Cannot fetch filterd students.");
  }
}

export async function fetchQuestionsForDoById(assessment_id: string) {
  try {
    type todoAssessment = { name: string; questions: Question[] };
    const data = await sql<todoAssessment[]>`
    SELECT
      a.name,
      COALESCE(
        (
          SELECT jsonb_agg(
            jsonb_build_object(
              'id', q.id,
              'label', q.label,
              'options', COALESCE(
                (
                  SELECT jsonb_agg(
                    jsonb_build_object('id', o.id, 'label', o.label)
                    ORDER BY o.order_index
                  )
                  FROM practice.question_options o
                  WHERE o.question_id = q.id
                ),
                '[]'::jsonb
              )
            )
            ORDER BY q.position
          )
          FROM practice.questions q
          WHERE q.assessment_id = a.id
        ),
        '[]'::jsonb
      ) AS questions
    FROM practice.assessments a
    WHERE a.id = ${assessment_id}
    `;
    return data[0];
  } catch (e) {
    console.log("Database error: ", e);
    throw new Error("Cannot fetch questions for such AssessmentId.");
  }
}

// This student's saved selections for an assessment (questionId -> chosen
// optionId), so the do page can reload an in-progress assignment to continue.
// Empty object when there's no submission yet.
export async function fetchStudentAnswers(
  assessment_id: string,
  student_id: string,
): Promise<Record<string, string>> {
  try {
    const rows = await sql<{ questionId: string; answer: string }[]>`
    SELECT sa.question_id AS "questionId", sa.answer
    FROM practice.submissions s
    JOIN practice.submission_answer sa ON sa.submission_id = s.id
    WHERE s.assessment_id = ${assessment_id} AND s.user_id = ${student_id}
    `;
    return Object.fromEntries(rows.map((r) => [r.questionId, r.answer]));
  } catch (e) {
    console.log("Database error: ", e);
    throw new Error("Cannot fetch student answers.");
  }
}

// The answer key for grading: one row per question with its correct option id
// (null if none is marked). Flat and minimal — no options, labels, or is_correct
// leak beyond what grading needs.
export async function fetchAnswersById(assessment_id: string) {
  try {
    const data = await sql<
      { questionId: string; correctOptionId: string | null }[]
    >`
    SELECT
      q.id AS "questionId",
      (
        SELECT o.id
        FROM practice.question_options o
        WHERE o.question_id = q.id AND o.is_correct
        LIMIT 1
      ) AS "correctOptionId"
    FROM practice.questions q
    WHERE q.assessment_id = ${assessment_id}
    ORDER BY q.position
    `;
    return data;
  } catch (e) {
    console.log("Database error: ", e);
    throw new Error("Cannot fetch answer key for such AssessmentId.");
  }
}

export async function fetchQuestionsForReviewById(assessment_id: string) {
  try {
    type reviewAssessment = { name: string; questions: Question[] };
    const data = await sql<reviewAssessment[]>`
    SELECT
      a.name,
      COALESCE(
        (
          SELECT jsonb_agg(
            jsonb_build_object(
              'id', q.id,
              'label', q.label,
              'options', COALESCE(
                (
                  SELECT jsonb_agg(
                    jsonb_build_object('id', o.id, 'label', o.label, 'is_correct', o.is_correct)
                    ORDER BY o.order_index
                  )
                  FROM practice.question_options o
                  WHERE o.question_id = q.id
                ),
                '[]'::jsonb
              )
            )
            ORDER BY q.position
          )
          FROM practice.questions q
          WHERE q.assessment_id = a.id
        ),
        '[]'::jsonb
      ) AS questions
    FROM practice.assessments a
    WHERE a.id = ${assessment_id}
    `;
    return data[0];
  } catch (e) {
    console.log("Database error: ", e);
    throw new Error("Cannot fetch questions for such AssessmentId.");
  }
}

export async function fetchAnswersAndScoreForReview(
  student_id: string,
  assessment_id: string,
) {
  try {
    const data = await sql`
    SELECT 
      a.answer,
      s.score,
      s.user_id
    FROM practice.assessments ass
    LEFT JOIN practice.submissions s ON ass.id = s.assessment_id
    JOIN practice.submission_answer a ON a.submission_id = s.id
    JOIN practice.questions q ON q.id = a.question_id
    WHERE ass.id = ${assessment_id}
    ORDER BY q.position
    `;
    const answers = data.map((d) => d.answer as string) ?? [];
    const studentSubmission = data.filter((d) => d.user_id === student_id);
    const score = Number(studentSubmission[0]?.score ?? 0);
    return { answers, score };
  } catch (e) {
    console.log("Database error: ", e);
    throw new Error("Cannot fetch options for review.");
  }
}

// The single /assessment/[id] page reads core fields + timing + this student's
// submission score, so it can decide the mode (locked / do / review / missed).
export async function fetchAssessmentAttempt(id: string, studentId: string) {
  try {
    const [row] = await sql<
      {
        id: string;
        name: string;
        type: "assignment" | "exam";
        open: Date;
        close: Date;
        question_count: number;
        score: string | null;
      }[]
    >`
    SELECT a.id, a.name, a.type, a.open, a.close, a.question_count, s.score
    FROM practice.assessments a
    LEFT JOIN practice.submissions s
      ON a.id = s.assessment_id AND s.user_id = ${studentId}
    WHERE a.id = ${id}
    `;
    return row ?? null;
  } catch (e) {
    console.log("Database error: ", e);
    throw new Error("Cannot fetch assessment.");
  }
}
