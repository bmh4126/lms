"use server";
import { User } from "../definition";
import { sql } from "../db";
import { signIn } from "@/auth";
import { AuthError } from "next-auth";

export type State = {
  errors?: {
    userId?: { errors: string[] };
    name?: { errors: string[] };
    email?: { errors: string[] };
    password?: { errors: string[] };
    grade?: { errors: string[] };
    created_at?: { errors: string[] };
  };
  message?: string | null;
};

export async function authenticate(
  prevState: string | undefined,
  formData: FormData,
) {
  try {
    await signIn("credentials", formData);
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return "Invalid credetials.";
        default:
          return "Something went wrong.";
      }
    }
    throw error;
  }
}

export async function getUser(email: string) {
  try {
    const user = await sql<User[]>`
    SELECT
      u.id AS id,
      u.name AS name,
      u.role AS role,
      u.email AS email, 
      u.password AS password,
      e.grade AS grade
    FROM users u
    LEFT JOIN enrollment e ON e.user_id = u.id
    WHERE email = ${email}`;
    return user[0];
  } catch (error) {
    console.error("Failed to fetch user:", error);
    throw new Error("Failed to fetch user.");
  }
}
