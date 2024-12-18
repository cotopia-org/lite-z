import { ReactNode } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Tag, User } from "lucide-react";
import { MentionType } from "@/types/mention";
import { SearchType } from "@/components/shared/search";

type Props = {
  item: SearchType | MentionType;
  onClick?: () => void;
};
export default function CotopiaMention({ item, onClick }: Props) {
  return (
    <div
      onClick={() => {
        if (onClick) {
          onClick();
        }
      }}
      className={
        "flex flex-row items-center gap-x-1 justify-center" +
        (onClick ? "hover:bg-slate-400 hover:cursor-pointer" : "")
      }
    >
      {item.type === "user" ? <User size={16} /> : <Tag size={16} />}
      <span>{item.title}</span>
    </div>
  );
}
