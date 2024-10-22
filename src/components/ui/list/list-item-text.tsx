import React from "react";

interface ListItemTextProps {
  primary: string;
  secondary?: string;
}

export const ListItemText: React.FC<ListItemTextProps> = ({
  primary,
  secondary,
}) => {
  return (
    <div className='flex felx-col'>
      <span className='font-normal text-sm text-label'>{primary}</span>
      {secondary && (
        <span style={{ fontSize: "14px", color: "#6b6b6b" }}>{secondary}</span>
      )}
    </div>
  );
};
