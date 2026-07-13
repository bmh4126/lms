import { lusitana } from "./font";
import { IconName, IconsMap } from "../lib/definition";
import { typeCardList } from "../lib/definition";

export function Card({
  title,
  value,
  type,
}: {
  title: string;
  value: number | string;
  type: IconName;
}) {
  const Icon = IconsMap[type];

  return (
    <div className="shadow-lg/30 rounded-xl bg-gray-50 p-2">
      <div className="flex p-4">
        {Icon ? <Icon className="h-5 w-5 text-gray-700" /> : null}
        <h3 className="ml-2 text-sm font-medium">{title}</h3>
      </div>
      <p
        className={`${lusitana.className}
          truncate rounded-xl bg-white px-4 py-8 text-center text-2xl`}
      >
        {value}
      </p>
    </div>
  );
}

export default async function Page({
  type,
  userId,
}: {
  type: string;
  userId: string;
}) {
  const CardList = await typeCardList[type](userId);
  return (
    <>
      {CardList.map((card) => {
        const { title, value, type } = card;
        return <Card key={title} title={title} value={value} type={type} />;
      })}
    </>
  );
}
