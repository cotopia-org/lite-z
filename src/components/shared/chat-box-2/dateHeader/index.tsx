import React from "react";

type Props = {
  messageDate: string;
};

function DateHeader({ messageDate }: Props) {
  return <div className="text-center text-sm text-gray-500">{messageDate}</div>;
}

export { DateHeader };
