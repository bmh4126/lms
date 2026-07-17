import { lusitana } from "@/app/ui/font";
import { Metadata } from "next";
import { Suspense } from "react";
import Table from "@/app/ui/admin/user/teacher/table";
import Pagination from "@/app/ui/paginations";
import { fetchTeachersPages } from "@/app/lib/data/teacher/data";
import Search from "@/app/ui/search";
import { CreateObj } from "@/app/ui/admin/buttons";
import UsersTableSkeleton from "@/app/ui/admin/user/table-skeleton";

export const metadata: Metadata = {
  title: "Teachers | Admin",
};

export default async function Page(props: {
  searchParams?: Promise<{
    query?: string;
    page?: string;
  }>;
}) {
  const searchParam = await props.searchParams;
  const query = searchParam?.query || "";
  const currentPage = Number(searchParam?.page || "1");
  const totalPages = await fetchTeachersPages(query);
  return (
    <div className="w-full">
      <h1 className={`${lusitana.className} mb-4 text-xl md:text-2xl`}>
        Teachers Page
      </h1>
      <div className="mt-4 flex items-center justify-between gap-2 md:mt-8">
        <Search placeholder="Search for teacher..." />
        <CreateObj type="teacher" />
      </div>
      <div className="mt-5 flex w-full justify-center">
        <Pagination totalPages={totalPages} />
      </div>
      <Suspense key={query + currentPage} fallback={<UsersTableSkeleton />}>
        <Table query={query} currentPage={currentPage} />
      </Suspense>
    </div>
  );
}
