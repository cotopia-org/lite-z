import PayrollSideBar from "@/components/shared/cotopia-payroll/side-bar";
import PayrollPersonalProfile from "@/components/shared/cotopia-payroll/user-information/personal-profile";
import PayrollUserContract from "@/components/shared/cotopia-payroll/user-information/user-contract";

export default function PayrollPage() {
    function handleSubmit() {
        const currentURL = window.location.href;
        const url = new URL(currentURL);
    }


    return (
        <main className="flex bg-slate-50 gap-x-2">
            <PayrollSideBar />

            <div className="flex gap-3 flex-1 p-3">
                <PayrollPersonalProfile />
                <PayrollUserContract />
            </div>


            <button onClick={handleSubmit}>Test</button>

        </main>
    )
}