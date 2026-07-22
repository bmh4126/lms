"use server";

import { sql } from "../../db";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import {
  localTimeToDate,
  safeCallback,
  passedTime,
  getAssessmentPolicy,
} from "../../utils";
import { randomUUID } from "crypto";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import {
  fetchAnswersById,
  fetchAssessmentAttempt,
} from "../../data/student/data";

type State = {
  errors?: {
    userId?: { errors: string[] };
    name?: { errors: string[] };
    email?: { errors: string[] };
    password?: { errors: string[] };
    grade?: { errors: string[] };
    class?: { errors: string[] };
    created_at?: { errors: string[] };
  };
  message?: string | null;
};

const formSchema = z
  .object({
    type: z.enum(["assignment", "exam"]),
    scope: z.enum(["class", "grade"]),
    grade_level: z.coerce.number().int().min(1).max(6),
    class_id: z.uuid().optional().or(z.literal("")),
    name: z.string().min(1),
    open: z.string().min(1),
    close: z.string().min(1),
    timezone: z.string().min(1),
    questions: z.string(),
  })
  .refine((d) => d.scope !== "class" || !!d.class_id, {
    message: "Pick a class for class scope.",
    path: ["class_id"],
  })
  .refine((d) => d.open < d.close, {
    message: "Close must be after open.",
    path: ["close"],
  });

// Shape the QuestionsBuilder serialises into the hidden `questions` input.
type SubmittedOption = { id: string; label: string };
type SubmittedQuestion = {
  id: string;
  label: string;
  options: SubmittedOption[];
  correctOptionId: string | null;
};

function revalidate() {
  revalidatePath("/admin/assessment");
  revalidatePath("/curriculum/assessment/assignment");
  revalidatePath("/curriculum/assessment/exam");
}

// Validate + normalise the shared create/edit form. Returns either the parsed
// data (times converted to Dates, questions parsed) or an error State.
function parseAssessmentForm(formData: FormData):
  | {
      ok: true;
      data: {
        type: "assignment" | "exam";
        scope: "class" | "grade";
        grade_level: number;
        class_id: string;
        name: string;
        openAt: Date;
        closeAt: Date;
        questionList: SubmittedQuestion[];
      };
    }
  | { ok: false; state: State } {
  const validatedFields = formSchema.safeParse({
    type: formData.get("type"),
    scope: formData.get("scope"),
    grade_level: formData.get("grade"),
    class_id: formData.get("class_id") ?? "",
    name: formData.get("name"),
    open: formData.get("open"),
    close: formData.get("close"),
    timezone: formData.get("timezone"),
    questions: formData.get("questions"),
  });
  if (!validatedFields.success) {
    return {
      ok: false,
      state: {
        errors: z.treeifyError(validatedFields.error).properties,
        message: "Missing fields. Failed to save assessment",
      },
    };
  }
  const {
    type,
    scope,
    grade_level,
    class_id,
    name,
    open,
    close,
    timezone,
    questions,
  } = validatedFields.data;

  // Wall-clock strings + offset → real UTC instants for the timestamptz columns.
  const openAt = localTimeToDate(open, timezone);
  const closeAt = localTimeToDate(close, timezone);

  let questionList: SubmittedQuestion[];
  try {
    questionList = JSON.parse(questions);
  } catch {
    return {
      ok: false,
      state: { message: "Malformed questions data. Please try again." },
    };
  }

  return {
    ok: true,
    data: {
      type,
      scope,
      grade_level,
      class_id: class_id ?? "",
      name,
      openAt,
      closeAt,
      questionList,
    },
  };
}

export async function deleteAssessment(id: string) {
  try {
    await sql`
    DELETE FROM practice.assessments
    WHERE id = ${id}
    `;
    revalidate();
  } catch (e) {
    console.log("Database error", e);
    throw new Error("Cannot delete this assessment. Please retry.");
  }
}

export async function createAssessment(
  _prevState: State,
  formData: FormData,
): Promise<State> {
  const parsed = parseAssessmentForm(formData);
  if (!parsed.ok) return parsed.state;
  const {
    type,
    scope,
    grade_level,
    class_id,
    name,
    openAt,
    closeAt,
    questionList,
  } = parsed.data;

  const assessment_id = randomUUID();

  try {
    // One transaction: any failure rolls everything back — no orphaned rows.
    await sql.begin(async (tx) => {
      await tx`
        INSERT INTO practice.assessments (id, name, open, close, question_count, type)
        VALUES (${assessment_id}, ${name}, ${openAt}, ${closeAt}, ${questionList.length}, ${type})
      `;
      for (const [qi, q] of questionList.entries()) {
        const question_id = randomUUID();
        await tx`
          INSERT INTO practice.questions (id, assessment_id, label, position)
          VALUES (${question_id}, ${assessment_id}, ${q.label}, ${qi + 1})
        `;
        for (const [oi, o] of q.options.entries()) {
          await tx`
            INSERT INTO practice.question_options (id, question_id, label, is_correct, order_index)
            VALUES (${randomUUID()}, ${question_id}, ${o.label}, ${q.correctOptionId === o.id}, ${oi + 1})
          `;
        }
      }
      if (scope === "class" && class_id) {
        await tx`
          INSERT INTO practice.assessment_class (assessment_id, class_id)
          VALUES (${assessment_id}, ${class_id})
        `;
      } else {
        await tx`
          INSERT INTO practice.assessment_grade_level (assessment_id, grade_level)
          VALUES (${assessment_id}, ${grade_level})
        `;
      }
    });
  } catch (e) {
    console.log("Database error: ", e);
    return { message: "Cannot create new assessment. Please try again." };
  }

  revalidate();
  redirect(
    safeCallback(formData.get("callbackUrl") as string) ?? "/admin/assessment",
  );
}

export async function updateAssessment(
  id: string,
  _prevState: State,
  formData: FormData,
): Promise<State> {
  const parsed = parseAssessmentForm(formData);
  if (!parsed.ok) return parsed.state;
  const {
    type,
    scope,
    grade_level,
    class_id,
    name,
    openAt,
    closeAt,
    questionList,
  } = parsed.data;

  try {
    await sql.begin(async (tx) => {
      await tx`
        UPDATE practice.assessments
        SET name = ${name}, open = ${openAt}, close = ${closeAt},
            question_count = ${questionList.length}, type = ${type}
        WHERE id = ${id}
      `;

      // Replace questions + options wholesale (options first for FK safety).
      await tx`
        DELETE FROM practice.question_options
        WHERE question_id IN (
          SELECT id FROM practice.questions WHERE assessment_id = ${id}
        )
      `;
      await tx`DELETE FROM practice.questions WHERE assessment_id = ${id}`;

      for (const [qi, q] of questionList.entries()) {
        const question_id = randomUUID();
        await tx`
          INSERT INTO practice.questions (id, assessment_id, label, position)
          VALUES (${question_id}, ${id}, ${q.label}, ${qi + 1})
        `;
        for (const [oi, o] of q.options.entries()) {
          await tx`
            INSERT INTO practice.question_options (id, question_id, label, is_correct, order_index)
            VALUES (${randomUUID()}, ${question_id}, ${o.label}, ${q.correctOptionId === o.id}, ${oi + 1})
          `;
        }
      }

      // Replace targeting.
      await tx`DELETE FROM practice.assessment_class WHERE assessment_id = ${id}`;
      await tx`DELETE FROM practice.assessment_grade_level WHERE assessment_id = ${id}`;
      if (scope === "class" && class_id) {
        await tx`
          INSERT INTO practice.assessment_class (assessment_id, class_id)
          VALUES (${id}, ${class_id})
        `;
      } else {
        await tx`
          INSERT INTO practice.assessment_grade_level (assessment_id, grade_level)
          VALUES (${id}, ${grade_level})
        `;
      }
    });
  } catch (e) {
    console.log("Database error: ", e);
    return { message: "Cannot update this assessment. Please try again." };
  }

  revalidate();
  redirect(
    safeCallback(formData.get("callbackUrl") as string) ?? "/admin/assessment",
  );
}

// The student id comes from the session — never the client — so a submission
// can't be forged for another user.
export async function submitAnswer(
  assessment_id: string,
  selection: Record<string, string>,
): Promise<{ message: string } | void> {
  const user = await auth();
  const student_id = user?.user?.id;
  if (!student_id) return { message: "You must be signed in to submit." };

  // Guard the window server-side (the page mode is only a UX hint).
  const assessment = await fetchAssessmentAttempt(assessment_id, student_id);
  if (!assessment) return { message: "Assessment not found." };
  if (!passedTime(assessment.open))
    return { message: "This assessment isn't open yet." };
  if (passedTime(assessment.close))
    return { message: "This assessment has closed." };

  const policy = getAssessmentPolicy(assessment.type);

  // Single-attempt (exam): reject a re-submit early with a clear message. The
  // unique constraint below is still the race-safe guarantee.
  if (policy.singleAttempt && assessment.score !== null) {
    return { message: "You've already submitted this exam." };
  }

  // Grade against the answer key on the server — the client never sees it.
  const key = await fetchAnswersById(assessment_id);
  const score = key.filter(
    (k) => selection[k.questionId] === k.correctOptionId,
  ).length;

  try {
    await sql.begin(async (tx) => {
      const [row] = policy.singleAttempt
        ? // Exam: one attempt. A duplicate hits the unique constraint (23505).
          await tx<{ id: string }[]>`
            INSERT INTO practice.submissions (id, user_id, assessment_id, score)
            VALUES (${randomUUID()}, ${student_id}, ${assessment_id}, ${score})
            RETURNING id
          `
        : // Assignment: allow re-submit — upsert on the unique key.
          await tx<{ id: string }[]>`
            INSERT INTO practice.submissions (id, user_id, assessment_id, score,submitted_at)
            VALUES (${randomUUID()}, ${student_id}, ${assessment_id}, ${score}, DEFAULT)
            ON CONFLICT (user_id, assessment_id)
            DO UPDATE SET score = EXCLUDED.score
            RETURNING id
          `;

      const submission_id = row.id;

      // Replace this submission's answers.
      await tx`DELETE FROM practice.submission_answer WHERE submission_id = ${submission_id}`;
      for (const [questionId, optionId] of Object.entries(selection)) {
        await tx`
          INSERT INTO practice.submission_answer (submission_id, question_id, answer)
          VALUES (${submission_id}, ${questionId}, ${optionId})
        `;
      }
    });
  } catch (e) {
    if ((e as { code?: string }).code === "23505") {
      return { message: "You've already submitted this exam." };
    }
    console.log("Database error: ", e);
    return { message: "Cannot submit this assessment. Please try again." };
  }

  revalidatePath(`/curriculum/assessment/${assessment_id}`);
  revalidatePath(`/curriculum/assessment`);
  redirect(`/curriculum/assessment/${assessment.type}`);
}
