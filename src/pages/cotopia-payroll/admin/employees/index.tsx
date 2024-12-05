import { useAppSelector } from "@/store";
import Employees from "./components/employees-table";

export default function PayrollEmployees() {
  const user = useAppSelector((store) => store.auth.user);

  return (
    <>
      {user?.id === 6 ? (
        <Employees />
      ) : (
        <div className='w-full h-screen flex items-center justify-center'>
          <p className='text-red-400 font-medium'>
            You are not authorized to access this page.
          </p>
        </div>
      )}
    </>
  );
}
