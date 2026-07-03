"use server";

import { sql } from "../../db";

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
