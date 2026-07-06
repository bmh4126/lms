import Link from "next/link";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import { lusitana } from "./font";

export default function Back({ href }: { href: string }) {
    return (
        <div className="">
            <Link href={href} className="flex flex-row bg-blue-400 text-white w-fit p-2 pl-4 pr-4 rounded-xl hover:bg-blue-300 hover:text-blue-50">
                <ArrowLeftIcon className="w-4 mr-1" />
                <p className={`${lusitana.className} font-xl ml-1`}>Back</p>
            </Link>
        </div>  
    );
}