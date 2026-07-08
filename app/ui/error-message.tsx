import { ExclamationTriangleIcon } from "@heroicons/react/24/outline";

export default function ErrorMessageBox({ message }: { message:string}) {
  return (
    <div className="flex flex-row text-red-500 text-sm">
      <ExclamationTriangleIcon className="w-4 ml-2 mr-3" />
      <p>{message}</p>
    </div>
  );
}
