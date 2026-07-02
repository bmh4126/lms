import { lusitana } from "../../ui/font";
import { Metadata } from "next";
import { Suspense } from "react";
import CardWrapper from "@/app/ui/cards";
import { CardsSkeleton } from "@/app/ui/skeletons";

export const metadata: Metadata = {
  title: "Dashboard",
};

export default function Page() {
  return (
    <main>
      <h1 className={`${lusitana.className} mb-4 text-xl md:text-2xl`}>
        Dashboard
      </h1>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <Suspense fallback={<CardsSkeleton type="teacher"/>}>
          <CardWrapper type="teacher" />
        </Suspense>
      </div>
    </main>
  );
}
