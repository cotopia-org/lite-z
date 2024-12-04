import PayrollSideBar from "@/components/shared/cotopia-payroll/side-bar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ReactNode } from "react";

interface Props {
  children: ReactNode;
}

export default function PayrollWrapper({ children }: Props) {
  return (
    <main className='w-full min-h-screen flex bg-slate-50 gap-x-2'>
      <ScrollArea className='h-72 flex flex-col gap-y-4 w-full'>
        <PayrollSideBar />

        {children}
      </ScrollArea>
    </main>
  );
}
