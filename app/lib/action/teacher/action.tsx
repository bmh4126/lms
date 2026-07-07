"use server";

import { redirect } from "next/navigation";
import { sql } from "../../db";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const formSchema = z.object({
  userId: z.uuid(),
  name: z.string().min(1),
  email: z.email().min(1),
  grade: z.coerce.number().min(1).max(6), //Grade 1-6
  created_at: z.string(),
});

const UpdateTeacher = formSchema.omit({ userId: true, created_at: true });

export type State = {
  errors?: {
    userId?: { errors: string[] };
    name?: { errors: string[] };
    email?: { errors: string[] };
    grade?: { errors: string[] };
    created_at?: { errors: string[] };
  };
  message?: string | null;
};

export async function CreateTeacher(prevState: State, formData: FormData):Promise<State> {
    return { message: "" };
}

export async function deleteTeacher(id: string) {
  try {
    await sql`
    DELETE FROM users
    WHERE id = ${id}
    `;

    revalidatePath("/admin/teachers");
  } catch (e) {
    console.log("Database error", e);
    throw new Error("Cannot delete this Teacher");
  }
}

export async function updateTeacher(
  id: string,
  prevState: State,
  formData: FormData,
): Promise<State> {
  const validatedFields = UpdateTeacher.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    grade: formData.get("grade"),
  });
  if (!validatedFields.success) {
    return {
      errors: z.treeifyError(validatedFields.error).properties,
      message: "Missing fields. Failed to update teacher.",
    };
  }

  const { name, email, grade } = validatedFields.data;

  try {
    await sql.begin(async (tx) => {
      await tx`UPDATE users SET name = ${name}, email = ${email} WHERE id = ${id}`;
      await tx`UPDATE enrollment SET grade = ${grade} WHERE user_id = ${id}`;
    });
    revalidatePath("/admin/teachers");
  } catch (e) {
    console.log("Database error", e);
    return { message: "Cannot update this Teacher" };
  }
  redirect("/admin/teachers");
}
