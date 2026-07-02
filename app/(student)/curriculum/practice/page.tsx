import { lusitana } from "@/app/ui/font";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Practice",
};

export default function Page() {
  return (
    <main>
      <h1 className={`${lusitana.className} text-2xl`}>Practice</h1>
    </main>
  );
}
