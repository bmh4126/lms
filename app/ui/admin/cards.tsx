import { fetchCardData } from "@/app/lib/data/admin/data";
import { Card } from "../cards";
import { IconName } from "@/app/lib/definition";

export default async function Page() {
  const { totalClasses, totalStudents, totalTeachers } = await fetchCardData();
  const CardList = [
    { title: "Total Chapters", value: totalClasses, type: "bookOpenIcon" },
    { title: "Total Students", value: totalStudents, type: "bookOpenIcon" },
    { title: "Total Teachers", value: totalTeachers, type: "bookOpenIcon" },
    { title: "Demo 4", value: 4, type: "bookOpenIcon" },
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
