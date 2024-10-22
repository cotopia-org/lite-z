import { ReactNode } from "react";

type Props<T> = {
  items: T[];
  render: (item: T) => ReactNode;
};
export default function List<T>({ items = [], render }: Props<T>) {
  return (
    <div className='flex flex-col py-4'>
      {items.map((item, key) => (
        <div className='item' key={key}>
          {render(item)}
        </div>
      ))}
    </div>
  );
}
