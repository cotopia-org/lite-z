import PayrollSideBar from "@/components/shared/cotopia-payroll/side-bar";
import { ReactNode } from "react";

interface Props {
  children: ReactNode;
}

export default function PayrollWrapper({ children }: Props) {
  return (
    <main className='w-full min-h-screen flex bg-slate-50 gap-x-2'>
      <PayrollSideBar />

      {children}
    </main>
  );
}
