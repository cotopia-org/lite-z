import Reply from "./reply";
import Pin from "./pin";
import CopyText from "./copy";
import Delete from "./delete";
import Edit from "./edit";

export default function MenuItems() {
  return (
    <div className='bg-gray-700 rounded-md py-2'>
      <Reply />
      <Edit />
      <Pin />
      <CopyText />
      <Delete />
    </div>
  );
}
