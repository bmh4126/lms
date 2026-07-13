import { fetchHomeCardData } from "@/app/lib/data/student/data";
import { auth } from "@/auth";
import { notFound } from "next/navigation";
import { Card } from "../../cards";
import { IconName } from "@/app/lib/definition";

export default async function Page() {
  const user = await auth();
  if (!user) notFound();
  const userGrade = user.user.grade || 0;
  const { totalChapter } = await fetchHomeCardData(userGrade);
  const CardList = [
    { title: "Total Chapters", value: totalChapter, type: "bookOpenIcon" },
    { title: "Demo 2", value: 2, type: "bookOpenIcon" },
    { title: "Demo 3", value: 3, type: "bookOpenIcon" },
    { title: " Demo 4", value: 4, type: "bookOpenIcon" },
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
