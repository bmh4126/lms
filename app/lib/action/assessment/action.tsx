"use server";

import { sql } from "../../db";
import { revalidatePath } from "next/cache";
import { State } from "../common-action";
import { z } from "zod";
import { localTimeToDate } from "../../utils";
import { randomUUID } from "crypto";
import { redirect } from "next/navigation";

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

async function revalidate() {
  revalidatePath("/admin/assessment");
  revalidatePath("/curriculum/practice/assignment");
  revalidatePath("/curriculum/practice/exam");
}

export async function deleteAssessment(id: string) {
  try {
    await sql`
    DELETE FROM practice.assessments
    WHERE id = ${id}
    `;

    await revalidate();
  } catch (e) {
    console.log("Database error", e);
    throw new Error("Cannot delete this assessment. Please retry.");
  }
}

export async function createAssessment(
  _prevState: State,
  formData: FormData,
): Promise<State> {
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
      errors: z.treeifyError(validatedFields.error).properties,
      message: "Missing fields. Failed to add new assessment",
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
    return { message: "Malformed questions data. Please try again." };
  }
  const question_count = questionList.length;
  const assessment_id = randomUUID();

  try {
    // One transaction: if any insert fails, everything rolls back — no orphaned
    // assessment left behind. `sql` inside the callback is transaction-scoped.
    await sql.begin(async (sql) => {
      await sql`
        INSERT INTO practice.assessments (id, name, open, close, question_count, type)
        VALUES (${assessment_id}, ${name}, ${openAt}, ${closeAt}, ${question_count}, ${type})
      `;

      for (const [qi, q] of questionList.entries()) {
        const question_id = randomUUID();
        await sql`
          INSERT INTO practice.questions (id, assessment_id, label, position)
          VALUES (${question_id}, ${assessment_id}, ${q.label}, ${qi + 1})
        `;
        for (const [oi, o] of q.options.entries()) {
          const option_id = randomUUID();
          const is_correct = q.correctOptionId === o.id;
          await sql`
            INSERT INTO practice.question_options (id, question_id, label, is_correct, order_index)
            VALUES (${option_id}, ${question_id}, ${o.label}, ${is_correct}, ${oi + 1})
          `;
        }
      }

      if (scope === "class" && class_id) {
        await sql`
          INSERT INTO practice.assessment_class (assessment_id, class_id)
          VALUES (${assessment_id}, ${class_id})
        `;
      } else {
        await sql`
          INSERT INTO practice.assessment_grade_level (assessment_id, grade_level)
          VALUES (${assessment_id}, ${grade_level})
        `;
      }
      await revalidate();
    });
  } catch (e) {
    console.log("Database error: ", e);
    return { message: "Cannot create new assessment. Please try again." };
  }
  redirect("/admin/assessment");
}
