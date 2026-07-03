import { Cards } from "@/app/lib/definition";
import { fetchCardData } from "@/app/lib/data/admin/data";


export async function getAdminCards(): Promise<Cards[]> {
    const { totalGrades, totalStudents, totalTeachers } = await fetchCardData();
  return [
    { title: "Total Chapters", value: totalGrades, type: "chapter" },
    { title: "Total Students", value: totalStudents, type: "test" },
    { title: "Total Teachers", value: totalTeachers, type: "test" },
    { title: "Admin Demo ", value: 4, type: "test" },
  ];
}