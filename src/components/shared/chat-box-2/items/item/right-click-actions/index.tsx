import MenuItems from "./menu-items";
import Reactions from "./reactions";

export default function RightClickActions() {
  return (
    <div className='flex flex-col gap-y-4'>
      <Reactions />
      <MenuItems />
    </div>
  );
}
