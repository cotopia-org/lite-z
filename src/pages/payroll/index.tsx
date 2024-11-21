import PayrollSideBar from "@/components/shared/cotopia-payroll/side-bar";
import PayrollUserInformationHeader from "@/components/shared/cotopia-payroll/user-information/header";
import PayrollPersonalProfile from "@/components/shared/cotopia-payroll/user-information/personal-profile";
import JobItems from "@/components/shared/job-items";
import { useApi } from "@/hooks/swr";
import { JobType } from "@/types/job";

export default function PayrollPage() {
    const { data, isLoading } = useApi(`/users/6/jobs`);
    const jobs: JobType[] = data !== undefined ? data?.data : [];

    let content = <JobItems items={jobs} />;
    console.log("User Job" , data)

    return (
        <main className="flex bg-slate-50 gap-x-2">
            <PayrollSideBar />

            <div className="flex gap-3 flex-1 p-3">
                <PayrollPersonalProfile />


                <div className="flex-1 bg-white shadow-lg border border-border p-3 rounded-md">
                    <PayrollUserInformationHeader title="User Contract" altTitle="Ends in Feb 25 , 2050" />

                </div>

            </div>


            <div>{content}</div>

        </main>
    )
}