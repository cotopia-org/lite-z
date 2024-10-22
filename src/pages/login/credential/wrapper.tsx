import { OrgImage } from "@/components/shared";
import { ReactNode } from "react";

interface Props {
  children: ReactNode;
}

const CredentialWrapper = ({ children }: Props) => {
  return (
    <div className="flex flex-col h-full w-full items-center justify-center gap-y-4">
      <div className="flex flex-col items-center gap-y-3 w-full">
        <OrgImage src={"/assets/images/login-image.svg"} />
        <span className="text-2xl font-medium text-black/[0.87]">ورود</span>
      </div>
      {children}
    </div>
  );
};

export default CredentialWrapper;
