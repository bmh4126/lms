import { fetchCardData } from "@/app/lib/data/admin/data";
import { Card } from "../cards";
import { IconName } from "@/app/lib/definition";

export default async function Page() {
  const { totalGrades, totalStudents, totalTeachers } = await fetchCardData();
  const CardList = [
    { title: "Total Chapters", value: totalGrades, type: "chapter" },
    { title: "Total Students", value: totalStudents, type: "test" },
    { title: "Total Teachers", value: totalTeachers, type: "test" },
    { title: "Demo 4", value: 4, type: "test" },
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
