import { Cards } from "@/app/lib/definition";
import { fetchCardData } from "@/app/lib/data/student/lessons";

const { totalChapter } = await fetchCardData(1);

export const StudentCardList: Cards[] = [
  {
    title: "Total Chapters",
    value: totalChapter,
    type: "chapter",
  },
  {
    title: "Student Demo 2",
    value: 2,
    type: "test",
  },
  {
    title: "Student Demo 3",
    value: 3,
    type: "test",
  },
  {
    title: "Student Demo 4",
    value: 4,
    type: "test",
  },
];
