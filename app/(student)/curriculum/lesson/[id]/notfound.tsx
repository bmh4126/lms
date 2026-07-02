import { lusitana } from "@/app/ui/font";

export default function notFound() {
    return (
      <div className="flex w-full items-center justify-between">
        <h1 className={`${lusitana.className} text-2xl`}>Not Found</h1>
      </div>
    );
}