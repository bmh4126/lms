import { Metadata } from "next";
import AssessmentList from "@/app/ui/student/assessment/assessment-list";

export const metadata: Metadata = {
  title: "Exams",
};

export default function Page() {
  return <AssessmentList type="exam" />;
}
