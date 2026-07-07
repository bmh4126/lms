"use server";

import { sql } from "../../db";
import { Grade, TeacherForm } from "../../definition";

export async function fetchCardData() {
  const totalGradesPromise = await sql`
    SELECT COUNT(DISTINCT grade)
    FROM chapters
  `;
  const totalStudentsPromise = await sql`
    SELECT COUNT(*)
    FROM users
    WHERE role = 'student'
  `;
  const totalTeachersPromise = await sql`
    SELECT COUNT(*)
    FROM users
    WHERE role = 'teacher'
  `;
  const data = await Promise.all([
    totalGradesPromise,
    totalStudentsPromise,
    totalTeachersPromise,
  ]);
  const totalGrades = Number(data[0][0].count ?? "0");
  const totalStudents = Number(data[1][0].count ?? "0");
  const totalTeachers = Number(data[2][0].count ?? "0");
  return { totalGrades, totalStudents, totalTeachers };
}

export async function fetchTeacherById(id: string) {
  try{const data = await sql<TeacherForm[]>`
  SELECT
    u.id AS id,
    u.name AS name,
    u.email AS email,
    e.grade AS grade,
    u.created_at AS created_at
  FROM users u
  JOIN enrollment e ON u.id = e.user_id
  WHERE u.id = ${id}
  `;
    return data[0];
  } catch (e) {
    console.log("Database error", e);
    throw new Error("Cannot fetch teacher with such ID.")
  }
}

export async function fetchGrades() {
  try { return await sql<{ position: number }[]>`SELECT position FROM grades`; } catch (e) {
    console.log("Database error", e);
    throw new Error("Cannot fetch all grades.");
  }
}