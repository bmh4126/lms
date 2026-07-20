import { sql } from "../db";
import { AssessmentEdit, Option } from "../definition";

// export async function fetchAssessmentById(id: string) {
//   try {
//     const data = await sql`
//     SELECT
//         id,
//         name,
//         open,
//         close,
//         question_count,
//         type
//     FROM practice.assessments
//     WHERE id = ${id}
//         `;
//     return data[0];
//   } catch (e) {
//     console.log("Database error: ", e);
//     throw new Error("Cannot fetch assessment with this ID.");
//   }
// }

// Full assessment for the edit form: core fields, its target (class or grade),
// and every question with its options. Returns null if the id doesn't exist.
export async function fetchAssessmentForEdit(
  id: string,
): Promise<AssessmentEdit | null> {
  try {
    const [core] = await sql`
      SELECT
        a.id,
        a.name,
        a.open,
        a.close,
        a.type,
        ac.class_id,
        cc.grade_level AS class_grade,
        agl.grade_level AS grade_level
      FROM practice.assessments a
      LEFT JOIN practice.assessment_class ac ON ac.assessment_id = a.id
      LEFT JOIN school.classes cc ON cc.id = ac.class_id
      LEFT JOIN practice.assessment_grade_level agl ON agl.assessment_id = a.id
      WHERE a.id = ${id}
    `;
    if (!core) return null;

    const questions = await sql<
      { id: string; label: string; options: Option[] }[]
    >`
      SELECT
        q.id,
        q.label,
        COALESCE(
          (
            SELECT jsonb_agg(
              jsonb_build_object('id', o.id, 'label', o.label, 'is_correct', o.is_correct)
              ORDER BY o.order_index
            )
            FROM practice.question_options o
            WHERE o.question_id = q.id
          ),
          '[]'::jsonb
        ) AS options
      FROM practice.questions q
      WHERE q.assessment_id = ${id}
      ORDER BY q.position
    `;

    // A class row means class scope (its grade comes from the class); otherwise
    // it's grade scope and grade_level is stored directly.
    const scope = core.class_id ? "class" : "grade";
    const grade_level = core.class_id ? core.class_grade : core.grade_level;

    return {
      id: core.id,
      name: core.name,
      open: core.open,
      close: core.close,
      type: core.type,
      scope,
      grade_level: Number(grade_level),
      class_id: core.class_id ?? null,
      questions,
    };
  } catch (e) {
    console.log("Database error: ", e);
    throw new Error("Cannot fetch assessment for editing.");
  }
}
