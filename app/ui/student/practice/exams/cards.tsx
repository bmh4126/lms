import { Card } from "@/app/ui/cards";
import { IconName } from "@/app/lib/definition";

export default async function Page({
  totalExams,
  totalInProgress,
  upcoming,
  completed,
  totalDued,
  avgScore,
}: {
  totalExams: number;
  totalInProgress: number;
  upcoming: number;
  completed: number;
  totalDued: number;
  avgScore: string;
}) {
  const stats: { title: string; value: number | string; type: IconName }[] = [
    { title: "Total Exams", value: totalExams, type: "documentDuplicateIcon" },
    {
      title: "In Progress",
      value: totalInProgress,
      type: "documentDuplicateIcon",
    },
    { title: "Upcoming", value: upcoming, type: "numberedListIcon" },
    { title: "Completed", value: completed, type: "checkCircleIcon" },
    { title: "Dued", value: totalDued, type: "documentDuplicateIcon" },
    {
      title: "Average Score",
      value: avgScore === "-1" ? "-" : avgScore + "%",
      type: "chartBarIcon",
    },
  ];
  return (
    <>
      {stats.map((s) => (
        <Card key={s.title} title={s.title} value={s.value} type={s.type} />
      ))}
    </>
  );
}
