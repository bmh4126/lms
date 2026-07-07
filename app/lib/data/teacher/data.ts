"use server";
import { sql } from "../../db";
import { UserTable } from "../../definition";

export async function fetchCardData(grade: number) {
  const totalChapterPromise = await sql`
    SELECT COUNT(*)
    FROM chapters c
    WHERE grade = ${grade}
  `;
  const data = await Promise.all([totalChapterPromise]);
  const totalChapter = Number(data[0][0].count ?? "0");
  return { totalChapter };
}

const ITEMS_PER_PAGE = 6;

export async function fetchFilteredTeacher(query: string, currentPage: number) {
  const offset = (currentPage - 1) * ITEMS_PER_PAGE;
  // const queryDate = formatDateToLocal(query);
  try {
    return await sql<UserTable[]>`
    SELECT
      u.id,
      u.name,
      u.email,
      e.grade,
      u.role,
      u.created_at
    FROM users u
    JOIN enrollment e ON u.id = e.user_id
    WHERE
      u.role = 'teacher' AND
      (u.name ILIKE ${`%${query}%`} OR
      u.email ILIKE ${`%${query}%`} OR
      e.grade::text ILIKE ${`%${query}%`})
    ORDER BY e.grade ASC, u.name ASC
    LIMIT ${ITEMS_PER_PAGE} OFFSET ${offset}
    `;
  } catch (e) {
    console.log("Database error: ", e);
    throw new Error("Failed to fetch teachers");
  }
}

export async function fetchTeachersPages(query: string) {
  try {
    const data = await sql`
    SELECT COUNT(*)
    FROM users u
    JOIN enrollment e ON u.id = e.user_id
    WHERE
      u.role = 'teacher' AND
      (u.name ILIKE ${`%${query}%`} OR
      u.email ILIKE ${`%${query}%`} OR
      e.grade::text ILIKE ${`%${query}%`})
    `;
    const totalPages = Math.ceil(Number(data[0].count) / ITEMS_PER_PAGE);
    return totalPages;
  } catch (e) {
    console.log("Database error: ", e);
    throw new Error("Cannot fetch total teachers pages");
  }
}
