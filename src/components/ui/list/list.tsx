import React from "react";

interface ListProps {
  children: React.ReactNode;
}

export const List: React.FC<ListProps> = ({ children }) => {
  return (
    <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>{children}</ul>
  );
};
