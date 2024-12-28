import { BellOff, UsersRound } from "lucide-react";
import { ReactNode } from "react";

type Props = {
  title: string;
  sub_title?: string;
  description?: ReactNode;
  type: string;
};
export default function ChatDetails({
  title,
  sub_title,
  description,
  type,
}: Props) {
  return (
    <div className="flex flex-col gap-y-1 flex-1 w-full">
      <div className="flex flex-row items-center justify-between">
        <div className={"flex flex-row items-center gap-1"}>
          {type !== "direct" && <UsersRound size={16} color={"black"} />}
          <strong>{title}</strong>
        </div>

        {!!sub_title && (
          <div>
            <span className="text-xs text-gray-500">{sub_title}</span>
          </div>
        )}
      </div>
      {!!description && (
        <span className="text-sm text-gray-500 text-ellipsis whitespace-nowrap overflow-hidden w-[300px]">
          {description}
        </span>
      )}
    </div>
  );
}
