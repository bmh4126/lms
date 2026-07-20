"use server";

import { sql } from "../../db";
import {
  Assessment,
  AssessmentRow,
  Class,
  StudentForm,
  TeacherForm,
} from "../../definition";

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
    u.created_at,
    c.label AS class
  FROM school.users u
  JOIN school.enrollments e ON u.id = e.student_id
  JOIN school.classes c ON c.id = e.class_id
  WHERE u.id = ${id}
  `;
    return data[0];
  } catch (e) {
    console.log("Database error", e);
    throw new Error("Cannot fetch student with such ID.");
  }
}

export async function fetchTeacherById(id: string) {
  try {
    const data = await sql<TeacherForm[]>`
  SELECT
    u.id,
    u.name,
    u.email
  FROM school.users u
  WHERE u.id = ${id} AND
    u.role = 'teacher'
  `;
    return data[0] ?? { id: "Unknown", name: "Unknown", email: "Unknown" };
  } catch (e) {
    console.log("Database error", e);
    throw new Error("Cannot fetch teacher with such ID.");
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

export async function fetchFilteredAssessments(
  grade_level: string,
  class_id: string,
) {
  try {
    const data = await sql<Assessment[]>`
      SELECT
        a.id,
        name,
        question_count,
        open,
        close,
        COALESCE(agl.grade_level, c.grade_level) AS grade_level,
        class_id,
        type
      FROM practice.assessments a
      LEFT JOIN practice.assessment_grade_level agl ON agl.assessment_id = a.id
      LEFT JOIN practice.assessment_class ac ON ac.assessment_id = a.id
      LEFT JOIN school.classes c ON c.id = ac.class_id
      WHERE (agl.grade_level IS NOT NULL AND
        agl.grade_level::text ILIKE ${`%${grade_level}%`}) OR
        (c.grade_level::text ILIKE ${`%${grade_level}%`} AND
        ac.class_id IS NOT NULL AND
        ac.class_id::text ILIKE ${`%${class_id}%`})
      `;
    console.log(data)
    return data;
  } catch (e) {
    console.log("Database error: ", e);
    throw new Error(
      `Cannot fetch assessments for grade ${grade_level} and/or class ${class_id}`,
    );
  }
}
