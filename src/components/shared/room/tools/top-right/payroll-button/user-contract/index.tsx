import UserAvatar from "@/components/shared/user-avatar";
import useUserContract from "@/hooks/use-user-contract";
import { useAppSelector } from "@/store";

export default function UserContract() {
  const userData = useAppSelector((store) => store.auth);
  const { userContract } = useUserContract();

  return (
    <>
      {userContract ? (
        <div className='w-full h-full border border-border p-2 rounded-md my-3 flex flex-col gap-y-3'>
          <div className='flex items-center justify-between gap-x-3'>
            <h1 className='text-lg font-semibold'>{userContract?.role}</h1>
            <span
              className={`text-sm tracking-wide font-medium p-1 ${
                userContract?.contractor_status === "active"
                  ? "bg-green-400/40 text-green-800"
                  : "bg-red-400/50 text-red-800"
              } rounded-full `}
            >
              {userContract?.contractor_status}
            </span>
          </div>

          <div className='flex items-center gap-x-2'>
            <UserAvatar
              title={userData.user?.username!}
              className='w-12 h-12'
              src={userData.user?.avatar?.url}
            />
            <h1 className='font-medium'>{userData.user?.username}</h1>
          </div>

          <hr />

          <div className='flex items-center w-full justify-between flex-wrap'>
            <h2 className='text-base font-medium text-gray-700 w-fit'>
              Salary:{" "}
              <span className='text-black font-medium'>
                {userContract?.amount} pre/hours
              </span>
            </h2>
            <h2 className='text-base font-medium text-gray-700 w-fit'>
              Renew-Time:{" "}
              <span className='text-black font-medium'>
                {userContract?.renew_time_period}
              </span>
            </h2>
          </div>
          <h2 className='text-base font-medium text-gray-700 w-fit'>
            End-In:{" "}
            <span className='text-black font-medium'>
              {userContract?.start_at.split("T")[0]}
            </span>
          </h2>
        </div>
      ) : (
        <div className='w-full flex items-center justify-center'>
          <span className='text-sm font-medium'>No have contract yet</span>
        </div>
      )}
    </>
  );
}
