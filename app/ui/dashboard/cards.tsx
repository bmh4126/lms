import { Cards } from "@/app/lib/definition";
import { fetchCardData } from "@/app/lib/data/teacher/data";

export async function getTeacherCards(): Promise<Cards[]> {
  const { totalChapter } = await fetchCardData(1);
  return [
    { title: "Total Chapters", value: totalChapter, type: "chapter" },
    { title: "Teacher Demo", value: 2, type: "test" },
    { title: "Teacher Demo", value: 3, type: "test" },
    { title: "Teacher Demo", value: 4, type: "test" },
  ];
}
