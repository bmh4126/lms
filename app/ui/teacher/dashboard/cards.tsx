import { fetchCardData } from "@/app/lib/data/teacher/data";
import { auth } from "@/auth";
import { notFound } from "next/navigation";
import { Card } from "../../cards";
import { IconName } from "@/app/lib/definition";

export default async function Page() {
  const user = await auth();
  if (!user) notFound();
  const userGrade = user.user.grade || 0;
  const { totalChapter } = await fetchCardData(userGrade);
  const CardList = [
    { title: "Total Chapters", value: totalChapter, type: "chapter" },
    { title: "Demo 2", value: 2, type: "test" },
    { title: "Demo 3", value: 3, type: "test" },
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
