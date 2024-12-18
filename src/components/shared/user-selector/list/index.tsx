import { UserMinimalType } from "@/types/user";
import UserCardItem from "./item";
import { useState } from "react";
import useKeyPress from "@/hooks/use-key-press";

type Props = {
  items: UserMinimalType[];
  onPick?: (item: UserMinimalType) => void;
  defaultSelectedId?: number;
  env?: "simple" | "detailed";
  excludes?: number[]
};
export default function UserList({
  items,
  onPick,
  defaultSelectedId,
  env = "detailed",
  excludes = []
}: Props) {

  const [keyboardSelected, setKeyboardSelected] = useState(0)
  useKeyPress('ArrowDown', () => {
    const next = keyboardSelected + 1
    if (items?.[next] )
      setKeyboardSelected(next)
    else 
      setKeyboardSelected(0)
  })

  useKeyPress('ArrowUp', () => {
    const prev = keyboardSelected - 1
    if (items?.[prev] )
      setKeyboardSelected(prev)
    else 
      setKeyboardSelected(items.length -1 )
  })

  useKeyPress('Enter', (e) => {
    if (!onPick) return
    onPick(items?.[keyboardSelected])
    e.stopPropagation()
    e.preventDefault()
  })


  useKeyPress('ArrowUp', () => {
    const prev = keyboardSelected - 1
    if (items?.[prev] )
      setKeyboardSelected(prev)
    else 
      setKeyboardSelected(items.length -1 )
  })
  

  if (items.length === 0) return null;

  let finalItems = [...items]

  if ( excludes.length > 0 ) finalItems = finalItems.filter(a => !excludes.includes(a.id)) 

  return (
    <div className='py-2 flex flex-col overflow-hidden max-h-[300px] overflow-y-auto'>
      {finalItems.map((user, index) => (
        <UserCardItem
          item={user}
          key={user.id}
          onPick={onPick}
          isSelected={defaultSelectedId === user?.id}
          isKeyboardSelected={keyboardSelected === index}
          env={env}
        />
      ))}
    </div>
  );
}
