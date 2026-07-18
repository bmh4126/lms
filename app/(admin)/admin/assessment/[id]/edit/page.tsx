import Back from "@/app/ui/back";
import { lusitana } from "@/app/ui/font";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Create Assessment | Admin",
};

export default function Page() {
  return (
    <div className="w-full">
      <Back />
      <h1 className={`${lusitana.className} mb-4 text-xl md:text-2xl`}>
        Edit Assessment
      </h1>
      {/* TODO: assessment creation form */}
    </div>
  );
}
