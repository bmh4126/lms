"use server";

import { redirect } from "next/navigation";
import { sql } from "../../db";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { randomUUID } from "crypto";
import b from "bcrypt";
import { State } from "../common-action";

const formSchema = z.object({
  userId: z.uuid(),
  name: z.string().min(1),
  email: z.email().min(1),
  password: z.string().min(8),
  grade: z.coerce.number().min(1).max(6), //Grade 1-6
  created_at: z.string(),
});

const UpdateSchema = formSchema.omit({
  userId: true,
  password: true,
  created_at: true,
});
const CreateSchema = formSchema.omit({ userId: true, created_at: true });

export async function CreateTeacher(
  prevState: State,
  formData: FormData,
): Promise<State> {
  const validatedFields = CreateSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    password: formData.get("password"),
    grade: formData.get("grade"),
  });
  if (!validatedFields.success) {
    return {
      errors: z.treeifyError(validatedFields.error).properties,
      message: "Missing fields. Failed to add new teacher",
    };
  }
  try {
    const id = randomUUID();
    const { email, name, password, grade } = validatedFields.data;
    const hash_password = (await b.hash(password, 10)).toString();
    await sql.begin(async (tx) => {
      await tx`
        INSERT INTO users (id, email, password, name, role)
        VALUES (${id}, ${email}, ${hash_password}, ${name}, 'teacher')
          `;
      await tx`
        INSERT INTO enrollment (user_id, grade)
        VALUES (${id}, ${grade})
        `;
    });
    revalidatePath("/admin/teacher");
  } catch (e) {
    console.log("Database error: Create teacher");
    return { message: "Cannot add this teacher. Please retry" };
  }
  redirect("/admin/teacher");
}

export async function deleteTeacher(id: string) {
  try {
    await sql`
    DELETE FROM users
    WHERE id = ${id}
    `;

    revalidatePath("/admin/teacher");
  } catch (e) {
    console.log("Database error", e);
    throw new Error("Cannot delete this teacher. Please retry.");
  }
}

export async function updateTeacher(
  id: string,
  prevState: State,
  formData: FormData,
): Promise<State> {
  const validatedFields = UpdateSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    password: formData.get("password"),
    grade: formData.get("grade"),
  });
  if (!validatedFields.success) {
    return {
      errors: z.treeifyError(validatedFields.error).properties,
      message: "Missing fields. Failed to update teacher.",
    };
  }

  const { name, email, grade } = validatedFields.data;
  const password = { password: formData.get("password") };
  try {
    await sql.begin(async (tx) => {
      await tx`UPDATE users SET name = ${name}, email = ${email} WHERE id = ${id}`;
      await tx`UPDATE enrollment SET grade = ${grade} WHERE user_id = ${id}`;
      if (password.password) {
        const validatedPassword = z
          .object({ password: z.string().min(8) })
          .safeParse(password);
        if (!validatedPassword.success) {
          return {
            errors: z.treeifyError(validatedPassword.error).properties,
            message: "Missing fields. Failed to update teacher.",
          };
        }
        const hash_password = (
          await b.hash(validatedPassword.data.password, 10)
        ).toString();
        await tx`UPDATE users SET password = ${hash_password} WHERE id = ${id}`;
      }
    });
    revalidatePath("/admin/teacher");
  } catch (e) {
    console.log("Database error: Update teacher");
    return { message: "Cannot update this teacher. Please retry" };
  }
  redirect("/admin/teacher");
}
