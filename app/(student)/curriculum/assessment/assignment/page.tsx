import { Metadata } from "next";
import AssessmentList from "@/app/ui/student/practice/assessment-list";

export const metadata: Metadata = {
  title: "Assignments",
};

export default function Page() {
  return <AssessmentList type="assignment" />;
}
