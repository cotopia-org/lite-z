type Props = {
  date: string;
};
export default function ChatDate({ date }: Props) {
  return (
    <div className='flex flex-col items-center justify-center my-4 pointer-events-none'>
      <div className='rounded-2xl bg-black/5 py-1 px-2 text-sm font-normal'>
        {date}
      </div>
    </div>
  );
}
