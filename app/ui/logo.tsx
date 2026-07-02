import { AcademicCapIcon } from "@heroicons/react/24/outline";
import { lusitana } from "./font";

export default function Logo({ role }: { role: string }) {
  return (
    <div className="block">
      <div
        className={`${lusitana.className} flex flex-row items-center leading-none text-white w-full`}
      >
        <AcademicCapIcon className="h-12 w-12 rotate-[5deg]" />
        <p className="text-[44px]">LMS</p>
      </div>
      <p className="flex w-full text-[20px]">{role}</p>
    </div>
  );
}
