// import Image from "next/image";
import { UpdateUser, DeleteUser } from "./buttons";
import { formatDateToLocal } from "@/app/lib/utils";
import { UserTable } from "@/app/lib/definition";

export default async function UsersTable({ users }: { users: UserTable[] }) {
  return (
    <div className="mt-6 flow-root">
      <div className="inline-block min-w-full align-middle">
        <div className="rounded-lg bg-gray-50 p-2 md:pt-0">
          <div className="md:hidden">
            {users?.map((user) => (
              <div
                key={user.id}
                className="mb-2 w-full rounded-md bg-white p-4"
              >
                <div className="flex items-center justify-between border-b pb-4">
                  <div>
                    <div className="mb-2 flex items-center text-xl font-medium">
                      <p>{user.name}</p>
                    </div>
                    <p>{user.email}</p>
                  </div>
                </div>
                <div className="flex w-full items-center justify-between pt-4">
                  <div>
                    <p>Grade {user.grade}</p>
                    <p className="text-sm text-gray-500">
                      {formatDateToLocal(user.created_at)}
                    </p>
                  </div>
                  <div className="flex justify-end gap-2">
                    <UpdateUser id={user.id} role={user.role} />
                    <DeleteUser id={user.id} role={user.role} />
                  </div>
                </div>
              </div>
            ))}
          </div>
          <table className="hidden min-w-full w-full h-full text-gray-900 md:table table-fixed">
            <thead className="rounded-lg text-left text-sm font-normal">
              <tr>
                <th scope="col" className="w-1/4 px-4 py-5 font-medium sm:pl-6">
                  Name
                </th>
                <th scope="col" className="w-1/3 px-3 py-5 font-medium">
                  Email
                </th>
                <th scope="col" className="w-20 px-3 py-5 font-medium">
                  Grade
                </th>
                <th scope="col" className="w-40 px-3 py-5 font-medium">
                  Date
                </th>
                <th scope="col" className="w-24 relative py-3 pl-6 pr-3">
                  <span className="sr-only">Edit</span>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white">
              {users?.map((user) => (
                <tr
                  key={user.id}
                  className="w-full border-b py-3 text-sm last-of-type:border-none [&:first-child>td:first-child]:rounded-tl-lg [&:first-child>td:last-child]:rounded-tr-lg [&:last-child>td:first-child]:rounded-bl-lg [&:last-child>td:last-child]:rounded-br-lg"
                >
                  <td className="py-3 pl-6 pr-3">
                    <div className="flex min-w-0 items-center gap-3">
                      {/* <Image
                        src={invoice.image_url}
                        className="rounded-full"
                        width={28}
                        height={28}
                        alt={`${invoice.name}'s profile picture`}
                      /> */}
                      <p className="min-w-0 break-words">{user.name}</p>
                    </div>
                  </td>
                  <td className="break-words px-3 py-3">{user.email}</td>
                  <td className="whitespace-nowrap px-3 py-3">{user.grade}</td>
                  <td className="whitespace-nowrap px-3 py-3">
                    {formatDateToLocal(user.created_at)}
                  </td>
                  <td className="whitespace-nowrap py-3 pl-6 pr-3">
                    <div className="flex justify-end gap-3">
                      <UpdateUser id={user.id} role={user.role} />
                      <DeleteUser id={user.id} role={user.role} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
