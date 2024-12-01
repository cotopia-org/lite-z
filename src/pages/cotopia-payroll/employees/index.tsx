import PayrollWrapper from "../payroll-wrapper";
import Employees from "./employees-table/employees-table";
import { useAppSelector } from "@/store";

export default function PayrollEmployees() {
    const user = useAppSelector((store) => store.auth.user);

    return (
        <PayrollWrapper>
            {user?.id === 6 ? (
                <Employees/>
            ) : (
                <div className="w-full h-screen flex items-center justify-center">
                    <p className="text-red-400 font-medium">You are not authorized to access this page.</p>
                </div>
            )}
        </PayrollWrapper>
    )
}