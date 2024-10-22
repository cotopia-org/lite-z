import { Loader } from "lucide-react";

type Props = {
  className?: string;
};
export default function CircularLoading({ className }: Props) {
  return (
    <div
      className={`flex flex-col items-center justify-center w-full ${
        className ?? ""
      }`}
    >
      <Loader className='animate-spin' />
    </div>
  );
}
