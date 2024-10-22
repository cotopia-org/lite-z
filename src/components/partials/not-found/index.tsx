type Props = {
  text?: string;
};
export default function NotFound({ text = "چیزی یافت نشد!" }: Props) {
  return (
    <div className='flex flex-col gap-y-4 items-center'>
      <img
        className='w-[500px] max-w-full h-auto'
        src='/assets/images/empty-list-personnel.jpg'
        alt='Empty List'
      />
      <p className='text-label text-lg font-normal'>{text}</p>
    </div>
  );
}
