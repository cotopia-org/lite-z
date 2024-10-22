import { cn } from "@/lib/utils";
import React from "react";

interface ListItemProps {
  children: React.ReactNode;
  onClick?: () => void; // Optional click handler
  selected?: boolean; // Optional selected state
  icon?: React.ReactNode; // Optional icon
}

export const ListItem: React.FC<ListItemProps> = ({
  children,
  onClick,
  selected,
  icon,
}) => {
  return (
    <li
      onClick={onClick}
      className={cn(
        "flex items-center py-3 px-4 transition-all hover:bg-black/5",
        onClick ? "cursor-pointer" : "cursor-default",
        selected ? "bg-primary-200" : "bg-transparent"
      )}
    >
      {icon && <span style={{ marginRight: "10px" }}>{icon}</span>}
      {children}
    </li>
  );
};
