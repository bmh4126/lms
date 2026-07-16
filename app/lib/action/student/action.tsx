"use server";

import { redirect } from "next/navigation";
import { sql } from "../../db";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { State } from "../common-action";
import b from "bcrypt";
import { randomUUID } from "crypto";

const formSchema = z.object({
  userId: z.uuid(),
  name: z.string().min(1),
  email: z.email().min(1),
  password: z.string(),
  class_id: z.uuid(),
  created_at: z.string(),
});

const UpdateSchema = formSchema.omit({
  userId: true,
  password: true,
  created_at: true,
});
const CreateSchema = formSchema.omit({ userId: true, created_at: true });

export async function createStudent(
  prevState: State,
  formData: FormData,
): Promise<State> {
  const validatedFields = CreateSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    password: formData.get("password"),
    class_id: formData.get("class_id"),
  });
  if (!validatedFields.success) {
    return {
      errors: z.treeifyError(validatedFields.error).properties,
      message: "Missing fields. Failed to add new teacher",
    };
  }
  try {
    const id = randomUUID();
    const { email, name, password, class_id } = validatedFields.data;
    const hash_password = (await b.hash(password, 10)).toString();
    await sql.begin(async (tx) => {
      await tx`
        INSERT INTO school.users (id, email, password, name, role)
        VALUES (${id}, ${email}, ${hash_password}, ${name}, 'student')
          `;
      await tx`
        INSERT INTO school.enrollments (student_id, class_id)
        VALUES (${id}, ${class_id})
        `;
    });
    revalidatePath("/admin/edit/student");
  } catch (e) {
    console.log("Database error: Create student");
    return { message: "Cannot add this student. Please retry" };
  }
  redirect("/admin/edit/student");
}

export async function deleteStudent(id: string) {
  try {
    await sql`
    DELETE FROM school.users
    WHERE id = ${id}
    `;

    revalidatePath("/admin/edit/student");
  } catch (e) {
    console.log("Database error", e);
    throw new Error("Cannot delete this student. Please retry.");
  }
}

export async function updateStudent(
  id: string,
  prevState: State,
  formData: FormData,
): Promise<State> {
  const validatedFields = UpdateSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    password: formData.get("password"),
    class_id: formData.get("class_id"),
  });
  if (!validatedFields.success) {
    return {
      errors: z.treeifyError(validatedFields.error).properties,
      message: "Missing fields. Failed to update student.",
    };
  }

  const { name, email, class_id } = validatedFields.data;
  const password = { password: formData.get("password") };
  try {
    await sql.begin(async (tx) => {
      await tx`UPDATE school.users SET name = ${name}, email = ${email} WHERE id = ${id}`;
      await tx`UPDATE school.enrollments SET class_id = ${class_id} WHERE student_id = ${id}`;
      if (password.password) {
        const validatedPassword = z
          .object({ password: z.string().min(8) })
          .safeParse(password);
        if (!validatedPassword.success) {
          return {
            errors: z.treeifyError(validatedPassword.error).properties,
            message: "Missing fields. Failed to update student.",
          };
        }
        const hash_password = (
          await b.hash(validatedPassword.data.password, 10)
        ).toString();
        await tx`UPDATE school.users SET password = ${hash_password} WHERE id = ${id}`;
      }
    });
    revalidatePath("/admin/edit/student");
  } catch (e) {
    console.log("Database error: Update student");
    return { message: "Cannot update this student. Please retry" };
  }
  redirect("/admin/edit/student");
}
