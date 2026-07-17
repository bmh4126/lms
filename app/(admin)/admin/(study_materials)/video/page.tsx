import { lusitana } from "@/app/ui/font";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Video | Admin",
};

export default function Page() {
  return (
    <div className="w-full">
      <h1 className={`${lusitana.className} mb-4 text-xl md:text-2xl`}>
        Video Page
      </h1>
    </div>
  );
}
