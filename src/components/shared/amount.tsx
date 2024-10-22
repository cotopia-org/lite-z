type Props = {
  value: number;
};
export default function Amount({ value }: Props) {
  return (
    <div className='amount-holder flex flex-row items-end gap-x-2 flex-wrap'>
      <strong className='amount font-normal text-black/[.87] text-lg md:text-2xl'>
        {value.toLocaleString()}
      </strong>
      <span className='text-label text-base md:text-base'>تومان</span>
    </div>
  );
}
