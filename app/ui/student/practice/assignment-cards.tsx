import { Card } from "@/app/ui/cards";
import { IconName } from "@/app/lib/definition";

// DRAFT UI — mock stats. Replace with a real fetch later (e.g. a CardsWrapper
// server component that queries the student's assignments).
const stats: { title: string; value: number | string; type: IconName }[] = [
  { title: "Total Assignments", value: 12, type: "documentDuplicateIcon" },
  { title: "In Progress", value: 3, type: "numberedListIcon" },
  { title: "Completed", value: 8, type: "checkCircleIcon" },
  { title: "Average Score", value: "82%", type: "chartBarIcon" },
];

export default function AssignmentCards() {
  return (
    <>
      {stats.map((s) => (
        <Card key={s.title} title={s.title} value={s.value} type={s.type} />
      ))}
    </>
  );
}
