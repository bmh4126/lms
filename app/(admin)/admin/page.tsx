import { lusitana } from "@/app/ui/font";
import { Metadata } from "next";
import { Suspense } from "react";
import CardWrapper from "@/app/ui/admin/cards";
import { CardsSkeleton } from "@/app/ui/skeletons";

export const metadata: Metadata = {
  title: "Admin",
};

export default function Page() {
  return (
    <main>
      <h1 className={`${lusitana.className} mb-4 text-xl md:text-2xl`}>
        Curriculum
      </h1>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <Suspense fallback={<CardsSkeleton amount={4} />}>
          <CardWrapper />
        </Suspense>
      </div>
    </main>
  );
}
