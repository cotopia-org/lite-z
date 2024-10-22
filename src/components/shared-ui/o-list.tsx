import { useState } from "react";
import { List } from "../ui/list/list";
import { ListItem } from "../ui/list/list-item";
import { ListItemText } from "../ui/list/list-item-text";

type Props = {
  items: { label: string; value: string }[];
  onChange?: (value: string) => void;
};
export default function OrgList({ items = [], onChange }: Props) {
  const [selectedItem, setSelectedItem] = useState<string | null>(null);

  const handleListItemClick = (selectedItem: string) => {
    setSelectedItem(selectedItem);
    if (onChange) onChange(selectedItem);
  };

  return (
    <List>
      {items.map((x) => (
        <ListItem
          key={x.value}
          selected={selectedItem === x.value}
          onClick={() => handleListItemClick(x.value)}
        >
          <ListItemText primary={x.label} />
        </ListItem>
      ))}
    </List>
  );
}
