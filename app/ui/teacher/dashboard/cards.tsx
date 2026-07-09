import { Cards } from "@/app/lib/definition";
import { fetchCardData } from "@/app/lib/data/teacher/data";
import { fetchGradeByUserId } from "@/app/lib/data/student/data";

export async function getTeacherCards(userId: string): Promise<Cards[]> {
  const userGrade = await fetchGradeByUserId(userId);
  const { totalChapter } = await fetchCardData(userGrade.position);
  return [
    { title: "Total Chapters", value: totalChapter, type: "chapter" },
    { title: "Demo 2", value: 2, type: "test" },
    { title: "Demo 3", value: 3, type: "test" },
    { title: "Demo 4", value: 4, type: "test" },
  ];
}
