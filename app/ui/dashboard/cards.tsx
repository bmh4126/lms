import { Cards } from "@/app/lib/definition";
import { fetchCardData } from "@/app/lib/data/student/lessons";

const { totalChapter } = await fetchCardData(1);

export const TeacherCardList: Cards[] = [
  {
    title: "Teacher Demo",
    value: 1,
    type: "test",
  },
  {
    title: "Total Chapter ",
    value: totalChapter,
    type: "chapter",
  },
  {
    title: "Teacher Demo",
    value: 3,
    type: "test",
  },
  {
    title: "Teacher Demo",
    value: 4,
    type: "test",
  },
];
