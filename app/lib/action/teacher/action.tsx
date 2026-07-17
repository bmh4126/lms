"use server";

import { redirect } from "next/navigation";
import { sql } from "../../db";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { randomUUID } from "crypto";
import b from "bcrypt";
import { State } from "../common-action";

const formSchema = z.object({
  name: z.string().min(1),
  email: z.email().min(1),
  password: z.string().min(8),
});

const UpdateSchema = formSchema.omit({
  password: true,
});
const CreateSchema = formSchema;

export async function CreateTeacher(
  prevState: State,
  formData: FormData,
): Promise<State> {
  const validatedFields = CreateSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    password: formData.get("password"),
  });
  if (!validatedFields.success) {
    return {
      errors: z.treeifyError(validatedFields.error).properties,
      message: "Missing fields. Failed to add new teacher",
    };
  }
  const id = randomUUID();
  const { email, name, password } = validatedFields.data;
  const hash_password = (await b.hash(password, 10)).toString();
  try {
    await sql`
      INSERT INTO school.users (id, email, password, name, role)
      VALUES (${id}, ${email}, ${hash_password}, ${name}, 'teacher')
        `;
    revalidatePath("/admin/teacher");
  } catch (e) {
    console.log("Database error: ", e);
    const message =
      (e as Error).message ===
      'duplicate key value violates unique constraint "users_email_key"'
        ? `Already exists teacher with email ${email}`
        : "Cannot add this teacher. Please retry.";
    return { message: message };
  }
  redirect("/admin/teacher");
}

export async function deleteTeacher(id: string) {
  try {
    await sql`
    DELETE FROM school.users
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

  const { name, email} = validatedFields.data;
  const password = { password: formData.get("password") };
  try {
    await sql.begin(async (tx) => {
      await tx`UPDATE school.users SET name = ${name}, email = ${email} WHERE id = ${id}`;
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
        await tx`UPDATE school.users SET password = ${hash_password} WHERE id = ${id}`;
      }
    });
    revalidatePath("/admin/teacher");
  } catch (e) {
    console.log("Database error: ", e);
    const message =
      (e as Error).message ===
      'duplicate key value violates unique constraint "users_email_key"'
        ? `Already exists teacher with email ${email}`
        : "Cannot update this teacher. Please retry.";
    return { message: message };
  }
  redirect("/admin/teacher");
}
