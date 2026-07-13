import { Cards } from "@/app/lib/definition";
import { fetchGradeByUserId, fetchAssignmentCardData } from "@/app/lib/data/student/data";


export async function getAssignmentCards(userId: string): Promise<Cards[]> {
  const userGrade = await fetchGradeByUserId(userId);
  const { totalAssignment,totalInProgress, totalDued,avgScore } = await fetchAssignmentCardData(userGrade.position,userId);
  return [
    { title: "Total Assignments", value: totalAssignment, type: "bookOpenIcon" },
    { title: "In Progress", value: totalInProgress, type: "bookOpenIcon" },
    { title: "Dued", value: totalDued, type: "bookOpenIcon" },
    { title: "Average Score", value: avgScore, type: "chartBarIcon" },
  ];
}
