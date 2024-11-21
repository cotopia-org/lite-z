import PayrollSideBar from "@/components/shared/cotopia-payroll/side-bar";
import PayrollUserInformationHeader from "@/components/shared/cotopia-payroll/user-information/header";
import PayrollPersonalProfile from "@/components/shared/cotopia-payroll/user-information/personal-profile";

export default function PayrollPage() {
    return (
        <main className="flex bg-slate-50 gap-x-2">
            <PayrollSideBar />

            <div className="flex gap-3 flex-1 p-3">
                <PayrollPersonalProfile />


                <div className="flex-1 bg-white shadow-lg border border-border p-3 rounded-md">
                    <PayrollUserInformationHeader title="User Contract" altTitle="Ends in Feb 25 , 2050" />

                </div>

            </div>


        </main>
    )
}