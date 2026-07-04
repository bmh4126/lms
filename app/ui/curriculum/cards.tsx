import { Cards } from "@/app/lib/definition";
import { fetchCardData } from "@/app/lib/data/student/data";

export async function getStudentCards(): Promise<Cards[]> {
  const { totalChapter } = await fetchCardData(1);
  return [
    { title: "Total Chapters", value: totalChapter, type: "chapter" },
    { title: "Demo 2", value: 2, type: "test" },
    { title: "Demo 3", value: 3, type: "test" },
    { title: " Demo 4", value: 4, type: "test" },
  ];
}
