import { Metadata } from "next";
import { lusitana } from "@/app/ui/font";

export const metadata: Metadata = {
  title: "Report",
};

export default function Page() {
    return (
      <main>
        <h1 className={`${lusitana.className} mb-4 text-xl md:text-2xl`}>
          Dashboard
        </h1>
      </main>
    );
}
