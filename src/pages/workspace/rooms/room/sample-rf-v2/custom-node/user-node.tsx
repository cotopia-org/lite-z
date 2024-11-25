import { memo } from "react";

export default memo(({ data, onClick }: any) => {
  return (
    <div
      onClick={data?.onClick}
      className='flex flex-col items-center justify-center w-[64px] h-[64px] rounded-full bg-black/40'
    >
      {data?.label}
    </div>
  );
});
