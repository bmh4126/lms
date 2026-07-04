import { roleCardList } from "../lib/definition";
import { lusitana } from "./font";

// Loading animation
const shimmer =
  "before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_2s_infinite] before:bg-gradient-to-r before:from-transparent before:via-white/60 before:to-transparent";

export function CardSkeleton() {
  return (
    <div
      className={`${shimmer} relative overflow-hidden rounded-xl bg-gray-100 p-2 shadow-sm`}
    >
      <div className="flex p-4">
        <div className="h-5 w-5 rounded-md bg-gray-200" />
        <div className="ml-2 h-6 w-16 rounded-md bg-gray-200 text-sm font-medium" />
      </div>
      <div className="flex items-center justify-center truncate rounded-xl bg-white px-4 py-8">
        <div className="h-7 w-20 rounded-md bg-gray-200" />
      </div>
    </div>
  );
}

export async function CardsSkeleton({ type }: { type: string }) {
  // const data = await roleCardList[type];
  const amount = 4;
  return (
    <>
      {Array.from({ length: amount }, (_, i) => (
        <CardSkeleton key={i} />
      ))}
    </>
  );
}

export function VideoSkeleton() {
  return (
    <div className={`${lusitana.className} text-[44px]`}>
      <p>Loading video...</p>
    </div>
  );
}

export function StudentTableSkeleton() {
  return null;
  return (
    <div className={`${shimmer} w-full h-[60vh]`}>
      <div className="mb-4 w-full overflow-hidden rounded-md border-b-2 border-r-2 transition-all ">
        {/* Title box — a separate clickable header, NOT wrapping the topics */}
        <div className="bg-gray-100 w-full h-[60px] text-left p-4 font-semibold transition-all hover:bg-blue-100 hover:text-blue-500"></div>
      </div>
      <div className="mb-4 w-full overflow-hidden rounded-md border-b-2 border-r-2 transition-all ">
        {/* Title box — a separate clickable header, NOT wrapping the topics */}
        <div className="bg-gray-100 w-full h-[60px] text-left p-4 font-semibold transition-all hover:bg-blue-100 hover:text-blue-500"></div>
      </div>
      <div className="mb-4 w-full overflow-hidden rounded-md border-b-2 border-r-2 transition-all ">
        {/* Title box — a separate clickable header, NOT wrapping the topics */}
        <div className="bg-gray-100 w-full h-[60px] text-left p-4 font-semibold transition-all hover:bg-blue-100 hover:text-blue-500"></div>
      </div>
      <div className="mb-4 w-full overflow-hidden rounded-md border-b-2 border-r-2 transition-all ">
        {/* Title box — a separate clickable header, NOT wrapping the topics */}
        <div className="bg-gray-100 w-full h-[60px] text-left p-4 font-semibold transition-all hover:bg-blue-100 hover:text-blue-500"></div>
      </div>
      <div className="mb-4 w-full overflow-hidden rounded-md border-b-2 border-r-2 transition-all ">
        {/* Title box — a separate clickable header, NOT wrapping the topics */}
        <div className="bg-gray-100 w-full h-[60px] text-left p-4 font-semibold transition-all hover:bg-blue-100 hover:text-blue-500"></div>
      </div>
    </div>
  );
}
