import { Chat2ItemType } from "@/types/chat2";
import MenuItems from "./menu-items";
import Reactions from "./reactions";

type Props = {
  item: Chat2ItemType;
};

export default function RightClickActions({ item }: Props) {
  return (
    <div className='flex flex-col gap-y-4'>
      <Reactions />
      <MenuItems />
    </div>
  );
}
