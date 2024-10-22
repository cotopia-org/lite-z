import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ReactNode } from "react";

type Props = {
  title: string;
  icon?: ReactNode;
  variant?: "default" | "destructive" | "info";
};

export default function OrgAlert({ icon, title, variant }: Props) {
  return (
    <Alert variant={variant} className='items-center'>
      {icon}
      <AlertTitle className='text-right leading-[24px]'>{title}</AlertTitle>
    </Alert>
  );
}
