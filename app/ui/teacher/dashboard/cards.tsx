import { fetchCardData } from "@/app/lib/data/teacher/data";
import { Card } from "../../cards";
import { IconName } from "@/app/lib/definition";

export default async function Page({
  class_id,
  subject_id,
}: {
  class_id: string;
  subject_id: string;
}) {
  const { totalChapters,totalStudents } = await fetchCardData(class_id, subject_id); //Change later
  const CardList = [
    { title: "Total Chapters", value: totalChapters, type: "bookOpenIcon" },
    { title: "Total Student", value: totalStudents, type: "academicCapIcon" },
    { title: "Demo 3", value: 3, type: "homeIcon" },
    { title: "Demo 4", value: 4, type: "homeIcon" },
  ];
  return (
    <>
      {CardList.map((card) => {
        const { title, value, type } = card;
        return (
          <Card
            key={title}
            title={title}
            value={value}
            type={type as IconName}
          />
        );
      })}
    </>
  );
}
