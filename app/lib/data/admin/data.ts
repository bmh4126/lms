"use server";

import { sql } from "../../db";
import { Class, StudentForm } from "../../definition";

export async function fetchCardData() {
  const totalClassesPromise = await sql`
    SELECT COUNT(*)
    FROM school.classes
  `;
  const totalStudentsPromise = await sql`
    SELECT COUNT(*)
    FROM school.users
    WHERE role = 'student'
  `;
  const totalTeachersPromise = await sql`
    SELECT COUNT(*)
    FROM school.users
    WHERE role = 'teacher'
  `;
  const data = await Promise.all([
    totalClassesPromise,
    totalStudentsPromise,
    totalTeachersPromise,
  ]);
  const totalClasses = Number(data[0][0].count ?? "0");
  const totalStudents = Number(data[1][0].count ?? "0");
  const totalTeachers = Number(data[2][0].count ?? "0");
  return { totalClasses, totalStudents, totalTeachers };
}

export async function fetchStudentById(id: string) {
  try {
    const data = await sql<StudentForm[]>`
  SELECT
    u.id,
    u.name,
    u.email,
    c.grade_level,
    u.created_at,
    c.label
  FROM school.users u
  JOIN school.enrollments e ON u.id = e.student_id
  JOIN school.classes c ON c.id = e.class_id
  WHERE u.id = ${id}
  `;
    return data[0];
  } catch (e) {
    console.log("Database error", e);
    throw new Error("Cannot fetch user with such ID.");
  }
}

export async function fetchAllCurentClasses() {
  try {
    return await sql<Class[]>`
    SELECT
      id,
      label,
      grade_level
    FROM school.classes
    ORDER BY grade_level ASC, label ASC
    `;
  } catch (e) {
    console.log("Database error", e);
    throw new Error("Cannot fetch all grades.");
  }
}
