
import moment from "moment";

export default function UserDate() {
  const createdAt = moment();

  return (
    <span className='text-[8px] font-light text-black/50'>{`Since ${createdAt.format(
      "YYYY"
    )}`}</span>
  );
}
