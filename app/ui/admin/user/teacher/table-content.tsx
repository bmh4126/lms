import { fetchFilteredTeacher } from "@/app/lib/data/teacher/data";
import { TeacherForm } from "@/app/lib/definition";
// import Image from "next/image";
import Table from "@/app/ui/admin/user/table";

export default async function TableContent({
  query,
  currentPage,
}: {
  query: string;
  currentPage: number;
}) {
  const teachers = await fetchFilteredTeacher(query, currentPage);

  return <Table users={teachers} />;
}
