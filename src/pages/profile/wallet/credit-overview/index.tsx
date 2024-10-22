import Amount from "@/components/shared/amount";
import useAuth from "@/hooks/auth";
import { useAppDispatch } from "@/store";
import { getProfileThunk } from "@/store/slices/auth/slice";
import { ReactNode, useEffect } from "react";

type Props = {
  afterNode?: ReactNode;
};

export default function CreditOverview({ afterNode }: Props) {
  const { user } = useAuth();

  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(getProfileThunk());
  }, []);

  return (
    <div className='flex flex-col gap-y-12 items-center justify-center w-full md:w-[464px] max-w-full mx-auto border-dashed border border-primary rounded-xl overflow-hidden p-8'>
      <img
        src='/assets/images/wallet-cover.jpg'
        alt=''
        className='max-w-full h-auto'
      />
      <div className='flex flex-row items-center justify-between w-full'>
        <strong className=' text-xl md:text-2xl font-normal'>
          اعتبار سازمان:
        </strong>
        <Amount value={user?.credit ?? 0} />
      </div>
      {!!afterNode && afterNode}
    </div>
  );
}
