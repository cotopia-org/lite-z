import { ContextMenuItem } from "@/components/ui/context-menu";
import { Copy, Pin, Reply, Trash } from "lucide-react";

export default function MenuItems() {
  return (
    <div className='bg-gray-700 rounded-md py-2'>
      {[
        { label: "Reply", icon: <Reply /> },
        { label: "Pin", icon: <Pin /> },
        { label: "Copy Text", icon: <Copy /> },
        { label: "Delete", icon: <Trash /> },
      ].map(({ icon, label }, index) => (
        <ContextMenuItem
          key={index}
          className='py-2 px-4 cursor-pointer !text-white rounded-none gap-x-2'
        >
          {icon}
          {label}
        </ContextMenuItem>
      ))}
    </div>
  );
}
