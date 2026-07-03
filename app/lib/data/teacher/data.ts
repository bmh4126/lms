'use server';
import { sql } from "../../db";

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
