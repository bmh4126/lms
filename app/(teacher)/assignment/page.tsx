import { lusitana } from "@/app/ui/font";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: 'Assignment',
}

export default function Page() {
  return (
    <div className="flex w-full items-center justify-between">
      <h1 className={`${lusitana.className} mb-4 text-xl md:text-2xl`}>
        Assignment
      </h1>
    </div>
  );
}
