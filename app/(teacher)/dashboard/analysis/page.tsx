import { Metadata } from "next";
import { lusitana } from "@/app/ui/font";
import Search from "@/app/ui/search";

export const metadata: Metadata = {
  title: "Analysis",
};

export default async function Page(props: {
  searchParams?: Promise<{
    query?: string;
    page?: string;
  }>;
}) {
  const searchParams = await props.searchParams,
    query = searchParams?.query || "",
    currentPage = Number(searchParams?.page || "1");

  return (
    <div className="w-full">
      <div className="flex w-full items-center justify-between">
        <h1 className={`${lusitana.className} mb-4 text-xl md:text-2xl`}>
          Analysis
        </h1>
      </div>
      <div className="mt-4 flex items-center justify-between gap-2 md:mt-8">
        <Search placeholder="Search students..." />
      </div>

      {/* <Suspense key={query + currentPage} fallback={<InvoicesTableSkeleton />}>
        <Table query={query} currentPage={currentPage} />
      </Suspense>
      <div className="mt-5 flex w-full justify-center">
        <Pagination totalPages={totalPages} />
      </div> */}
    </div>
  );
}
