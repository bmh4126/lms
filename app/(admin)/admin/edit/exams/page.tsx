import { lusitana } from "@/app/ui/font";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Edit exams",
};

export default function Page() {
  return (
    <div className="w-full">
      <h1 className={`${lusitana.className} mb-4 text-xl md:text-2xl`}>
        Edit Exams Page
      </h1>
    </div>
  );
}
