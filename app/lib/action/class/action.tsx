"use server";

import { randomUUID } from "crypto";
import { sql } from "../../db";
import { ClassStudent, StudentGroup, StudentSearchResult } from "../../definition";
import z from "zod";
import { auth } from "@/auth";
import { notFound, redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

export type State = {
  errors?: {
    label?: { errors: string[] };
    grade_level?: { errors: string[] };
    academic_year?: { errors: string[] };
    students?: { errors: string[] };
  };
  message?: string | null;
};

const ClassSchema = z.object({
  label: z.string().min(1),
  grade_level: z.coerce.number().min(1).max(6),
  academic_year: z.uuid(),
  students: z.string(),
});

function parseClassFormData(formData: FormData):
  | { ok: false; state: State }
  | {
      ok: true;
      data: {
        label: string;
        grade_level: number;
        academic_year: string;
        students: string;
      };
    } {
  const validatedFields = ClassSchema.safeParse({
    label: formData.get("label"),
    grade_level: formData.get("grade_level"),
    academic_year: formData.get("academic_year"),
    students: formData.get("students"),
  });
  if (!validatedFields.success) {
    return {
      ok: false,
      state: {
        errors: z.treeifyError(validatedFields.error).properties,
        message: "Missing fields. Failed to create class.",
      },
    };
  }

  const { label, grade_level, academic_year, students } = validatedFields.data;

  return { ok: true, data: { label, grade_level, academic_year, students } };
}

// Parse an uploaded students file (csv / xlsx / xls — 2 columns: name, card_id)
// and return the students that match BOTH name and card_id in the DB, plus the
// rows that matched nothing ("name (card_id)") for showing as errors.
export async function importStudentsFromFile(formData: FormData): Promise<{
  matched: ClassStudent[];
  notFound: string[];
  error?: string;
}> {
  const file = formData.get("file");
  if (!(file instanceof File) || file.size === 0) {
    return { matched: [], notFound: [], error: "No file selected." };
  }

  // SheetJS handles all three formats. Dynamic import keeps it out of the way
  // until an upload actually happens. An unreadable file (e.g. an image) throws.
  let grid: (string | number)[][];
  try {
    const XLSX = await import("xlsx");
    const buf = await file.arrayBuffer();
    const wb = XLSX.read(buf, { type: "array" });
    const sheet = wb.Sheets[wb.SheetNames[0]];
    if (!sheet) {
      return { matched: [], notFound: [], error: "The file has no sheets." };
    }
    grid = XLSX.utils.sheet_to_json<string[]>(sheet, {
      header: 1,
      blankrows: false,
    });
    if (grid[0].length <= 2)
      return {
        matched: [],
        notFound: [],
        error:
          "Lack of columns. Upload a CSV or Excel file with three columns: name, card id and group.",
      };
  } catch {
    return {
      matched: [],
      notFound: [],
      error:
        "Couldn't read the file. Upload a CSV or Excel file with three columns: name, card id and group.",
    };
  }

  // Normalise rows to { name, card_id,group }; skip empties and an optional header row.
  const rows: { name: string; card_id: string; group: string }[] = [];
  for (const r of grid) {
    const name = String(r?.[0] ?? "").trim();
    const card_id = String(r?.[1] ?? "").trim();
    const group = String(r?.[2] ?? "").trim();
    if (!name || !card_id) continue;
    if (
      name.toLowerCase() === "name" &&
      card_id.toLowerCase().replace(/[\s_]/g, "") === "cardid"
    ) {
      continue; // header row
    }
    rows.push({ name, card_id, group });
  }
  if (rows.length === 0) {
    return {
      matched: [],
      notFound: [],
      error:
        "No student rows found. The file needs three columns: name, card id and group.",
    };
  }

  const cardIds = rows.map((r) => r.card_id);
  const found = await sql<StudentSearchResult[]>`
    SELECT id, name, card_id
    FROM school.users
    WHERE role = 'student' AND card_id::text = ANY(${cardIds})
  `;

  const matched: ClassStudent[] = [];
  const notFound: string[] = [];
  const seen = new Set<string>();
  for (const row of rows) {
    // A student matches only when BOTH card_id and name line up.
    const student = found.find(
      (f) =>
        String(f.card_id) === row.card_id &&
        f.name.trim().toLowerCase() === row.name.toLowerCase(),
    );
    if (student) {
      if (!seen.has(student.id)) {
        matched.push({ ...student, group: row.group as StudentGroup});
        seen.add(student.id);
      }
    } else {
      notFound.push(`${row.name} (${row.card_id})`);
    }
  }
  return { matched, notFound };
}

// ---------------------------------------------------------------------------
// TODO (you'll implement the DB writes): create/update a class from the form.
// FormData available:
//   label        -> class name
//   grade_level  -> grade
//   students     -> formData.getAll("students") === array of student ids
//   callbackUrl  -> where to redirect after success
// ---------------------------------------------------------------------------

export async function createClass(
  prevState: State,
  formData: FormData,
): Promise<State> {
  const callbackUrl =
    formData.get("callbackUrl")?.toString() ?? "/manage/class";
  try {
    const user = await auth();
    const userId = user?.user.id;
    if (!userId || user?.user.role !== "teacher") notFound();
    const data = parseClassFormData(formData);
    if (!data.ok) return data.state;
    const { label, grade_level, academic_year, students } = data.data;
    const class_id = randomUUID();
    const studentList = JSON.parse(students);
    const total_student = studentList.length;
    await sql.begin(async (tx) => {
      await tx`
        INSERT INTO school.classes (id, grade_level, label, academic_year_id, created_by, total_student)
        VALUES (${class_id},${grade_level},${label},${academic_year},${userId}, ${total_student});
      `;
      for (const s of studentList) {
        // console.log(s);
        await tx`
        INSERT INTO school.enrollments (student_id, class_id, "group")
        VALUES (${s.id}, ${class_id}, ${s.group})
        `;
      }
    });
  } catch (e) {
    console.log("Database error: ", e);
    return { message: "Cannot create this class. Please try again later." };
  }
  revalidatePath("/manage/class");
  revalidatePath("/dashboard");
  revalidatePath("/curriculum");
  redirect(callbackUrl);
}

export async function updateClass(
  id: string,
  prevState: State,
  formData: FormData,
): Promise<State> {
  // TODO: validate, update the class, and reconcile its enrollments.
  const data = parseClassFormData(formData);
  if (!data.ok) return data.state;
  const { label, grade_level, academic_year, students } = data.data;
  const studentList = JSON.parse(students);
  const total_student = studentList.length;
  try {
    await sql.begin(async (tx) => {
      //Update Class table
      await tx`
        UPDATE school.classes
        SET label = ${label}, 
          grade_level = ${grade_level}, 
          academic_year_id = ${academic_year}, 
          total_student = ${total_student}
        WHERE id = ${id}
      `;
      //Delete all previous students and add new student list
      await tx`
      DELETE FROM school.enrollments WHERE class_id = ${id}
      `;
      for (const s of studentList) {
        await tx`
        INSERT INTO school.enrollments (student_id, class_id, "group")
        VALUES (${s.id},${id},${s.group});
        `;
      }
    });
  } catch (e) {
    console.log("Database error: ", e);
    return {
      message: "Cannot update class with this ID. Please try again later.",
    };
  }
  revalidatePath("/manage/class");
  revalidatePath("/dashboard");
  revalidatePath("/curriculum");
  redirect("/manage/class");
}

export async function deleteClass(id: string) {
  try {
    await sql.begin(async (tx) => {
      await tx`
      DELETE FROM school.classes WHERE id = ${id}
      `;
      await tx`
      DELETE FROM school.enrollments WHERE class_id = ${id}
      `;
    });
  } catch (e) {
    console.log("Database error: ", e);
    throw new Error("Cannot delete this class. Please try again later.");
  }
  revalidatePath("/manage/class");
  revalidatePath("/dashboard");
  revalidatePath("/curriculum");
}
