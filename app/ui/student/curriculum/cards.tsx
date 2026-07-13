import { Cards } from "@/app/lib/definition";
import { fetchHomeCardData, fetchGradeByUserId } from "@/app/lib/data/student/data";


export async function getStudentCards(userId: string): Promise<Cards[]> {
  const userGrade = await fetchGradeByUserId(userId);
  const { totalChapter } = await fetchHomeCardData(userGrade.position);
  return [
    { title: "Total Chapters", value: totalChapter, type: "bookOpenIcon" },
    { title: "Demo 2", value: 2, type: "bookOpenIcon" },
    { title: "Demo 3", value: 3, type: "bookOpenIcon" },
    { title: " Demo 4", value: 4, type: "bookOpenIcon" },
  ];
}
