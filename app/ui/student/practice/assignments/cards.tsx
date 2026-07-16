import { IconName } from "@/app/lib/definition";
import { Card } from "@/app/ui/cards";

export default async function Page({
  totalAssignment,
  totalInProgress,
  totalDued,
  avgScore,
}: {
  totalAssignment: number;
  totalInProgress: number;
  totalDued: number;
  avgScore: string;
}) {
  const CardList = [
    {
      title: "Total Assignments",
      value: totalAssignment,
      type: "bookOpenIcon",
    },
    { title: "In Progress", value: totalInProgress, type: "bookOpenIcon" },
    { title: "Dued", value: totalDued, type: "bookOpenIcon" },
    {
      title: "Average Score",
      value: avgScore === '-1' ? "-" : avgScore + "%",
      type: "chartBarIcon",
    },
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
