import PayrollSideBar from "@/components/shared/cotopia-payroll/side-bar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ReactNode } from "react";

interface Props {
  children: ReactNode;
}

export default function PayrollWrapper({ children }: Props) {
  return (
    <main className='w-full min-h-screen flex gap-x-2'>
      <PayrollSideBar />

      <ScrollArea className='h-screen flex flex-col gap-y-4 w-full'>
        {children}
      </ScrollArea>
    </main>
  );
}
