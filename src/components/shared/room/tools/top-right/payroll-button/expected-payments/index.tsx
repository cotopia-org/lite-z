import useAuth from "@/hooks/auth";

type Props = {
  amount: number;
};

export default function ExpectedPayments({ amount }: Props) {
  const { user } = useAuth();

  return (
    <span className='font-semibold text-black'>
      {user?.active_contract ? (
        <>
          <span className='text-base font-bold mr-2'>{amount.toFixed(2)}</span>
          <span className='text-gray-400 font-medium text-sm'>
            {user.active_contract.currency}
          </span>
        </>
      ) : (
        <span className='text-sm font-medium'>No contract yet</span>
      )}
    </span>
  );
}
