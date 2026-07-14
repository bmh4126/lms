// Grey placeholder rows that pad a table out to a fixed row count, so the table
// keeps a constant height on pages with fewer than the full number of rows —
// no layout jump when paginating. Render inside a <tbody>, after the real rows.
export function FillerRows({
  count,
  colSpan,
  heightClass = "h-8",
}: {
  count: number;
  colSpan: number;
  heightClass?: string;
}) {
  if (count <= 0) return null;
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <tr
          key={`filler-${i}`}
          aria-hidden="true"
          className="w-full last-of-type:border-none"
        >
          <td colSpan={colSpan} className="bg-gray-50 px-3 py-3">
            <div className={heightClass} />
          </td>
        </tr>
      ))}
    </>
  );
}
