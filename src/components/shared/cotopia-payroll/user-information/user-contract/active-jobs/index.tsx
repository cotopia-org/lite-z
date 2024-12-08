import { useAppSelector } from "@/store";
import PayrollSectionTitle from "../sections-title";
import { useApi } from "@/hooks/swr";
import { JobType } from "@/types/job";
import useUserContract from "@/hooks/use-user-contract";

function formatMinutesToHours(minutes: number): string {
  const hours = Math.floor(+minutes / 60);
  const remainingMinutes = Math.round(+minutes % 60);
  return `${hours} hours ${remainingMinutes} minutes`;
}

function getHoursFromMinutes(minutes: number): number {
  return +(minutes / 60);
}

export default function PayrollActiveJobs() {
  const { userContract } = useUserContract();
  const userData = useAppSelector((store) => store.auth);
  const { data, isLoading: jobsLoading } = useApi(
    `/users/${userData?.user?.id}/jobs`
  );
  const jobs: JobType[] = data !== undefined ? data?.data : [];

  return (
    <>
      <PayrollSectionTitle title='Active Jobs' />
      <div className='w-full flex flex-col gap-y-8'>
        {jobsLoading ? (
          <p className='text-gray-400 text-xl font-semibold text-center'>
            Loading data...
          </p>
        ) : jobs.length === 0 ? (
          <p className='text-gray-400 text-xl font-semibold text-center'>
            You don't have any active jobs yet.
          </p>
        ) : (
          jobs.map((job) => {
            const jobHours = getHoursFromMinutes(job.total_hours);
            const earnings = userContract
              ? (jobHours * userContract.amount).toFixed(2)
              : "N/A";

            return (
              <div
                key={job.id}
                className='relative w-full bg-primary p-4 rounded-md flex items-center justify-between'
              >
                <h1 className='text-white text-lg font-semibold'>
                  {job.title}
                </h1>
                <span className='text-white font-medium text-md'>
                  {formatMinutesToHours(job.total_hours)}
                </span>
                <span className='py-1 px-4 rounded-md absolute top-10 left-1/2 -translate-x-1/2 text-white bg-black text-sm font-medium'>
                  {userContract ? earnings : "N/A"} USDT
                </span>
              </div>
            );
          })
        )}
      </div>
    </>
  );
}
