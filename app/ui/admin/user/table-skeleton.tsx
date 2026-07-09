// Fallback for the users table (md+). Renders a full page worth of placeholder
// rows (same count + column widths as the real table) so the table area keeps a
// constant height while a page loads — no collapse/jump when paginating.
const ROWS = 6;

function Bar({ className }: { className: string }) {
  return <div className={`rounded bg-gray-200 ${className}`} />;
}

export default function UsersTableSkeleton() {
  return (
    <div className="mt-6 flow-root">
      <div className="inline-block min-w-full align-middle">
        <div className="animate-pulse rounded-lg bg-gray-50 p-2 md:pt-0">
          <table className="hidden min-w-full w-full text-gray-900 md:table table-fixed">
            <thead className="rounded-lg text-left text-sm font-normal">
              <tr>
                <th className="w-1/4 px-4 py-5 sm:pl-6">
                  <Bar className="h-4 w-16" />
                </th>
                <th className="w-1/3 px-3 py-5">
                  <Bar className="h-4 w-16" />
                </th>
                <th className="w-20 px-3 py-5">
                  <Bar className="h-4 w-12" />
                </th>
                <th className="w-40 px-3 py-5">
                  <Bar className="h-4 w-12" />
                </th>
                <th className="w-24 py-3 pl-6 pr-3" />
              </tr>
            </thead>
            <tbody className="bg-white">
              {Array.from({ length: ROWS }).map((_, i) => (
                <tr
                  key={i}
                  className="w-full border-b last-of-type:border-none"
                >
                  <td className="py-4 pl-6 pr-3">
                    <Bar className="h-5 w-28" />
                  </td>
                  <td className="px-3 py-4">
                    <Bar className="h-5 w-44" />
                  </td>
                  <td className="px-3 py-4">
                    <Bar className="h-5 w-8" />
                  </td>
                  <td className="px-3 py-4">
                    <Bar className="h-5 w-24" />
                  </td>
                  <td className="py-4 pl-6 pr-3">
                    <div className="flex justify-end gap-3">
                      <Bar className="h-9 w-9" />
                      <Bar className="h-9 w-9" />
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
