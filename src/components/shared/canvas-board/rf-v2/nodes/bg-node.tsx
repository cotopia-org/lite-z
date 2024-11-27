import React from "react";

export default function BgNode({ data }: any) {
  return (
    <div
      className='flex flex-col pointer-events-none z-0'
      style={{
        width: 4000,
        height: 2160,
        backgroundImage: `url(${data.background})`,
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
      }}
    ></div>
  );
}
