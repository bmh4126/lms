import { redirect } from "next/navigation";

// /curriculum/assessment has no view of its own — default to assignments.
export default function Page() {
  redirect("/curriculum/assessment/assignment");
}
