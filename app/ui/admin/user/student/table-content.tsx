
import { fetchFilteredStudent } from "@/app/lib/data/student/data";
import Table from "@/app/ui/admin/user/table";

export default async function TableContent({
  query,
  currentPage,
}: {
  query: string;
  currentPage: number;
}) {
  const students = await fetchFilteredStudent(query, currentPage);

  return <Table users={students} />;
}
