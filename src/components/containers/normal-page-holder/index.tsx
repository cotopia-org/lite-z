import { OrgIconButton } from "@/components/shared-ui";
import { ArrowRight } from "lucide-react";
import { ReactNode, useCallback } from "react";
import { useNavigate } from "react-router-dom";

type Props = {
  title: string;
  actionNode?: ReactNode;
  children: ReactNode;
  hasBack?: boolean;
};
export default function NormalPageHolder({
  title,
  actionNode,
  children,
  hasBack,
}: Props) {
  const navigate = useNavigate();
  const handleBack = useCallback(() => {
    navigate(-1);
  }, [navigate]);

  return (
    <div className='flex flex-col gap-y-8 w-full'>
      <div className='flex flex-col gap-y-4 md:flex-row justify-normal md:justify-between items-center p-4 w-full'>
        <div className='flex flex-col gap-y-4 w-full'>
          {!!hasBack && (
            <OrgIconButton className='shadow-md w-12 h-12' onClick={handleBack}>
              <ArrowRight />
            </OrgIconButton>
          )}
          <h1 className='text-2xl font-medium'>{title}</h1>
        </div>
        {!!actionNode && (
          <div className='action-node flex flex-row items-center gap-x-2'>
            {actionNode}
          </div>
        )}
      </div>
      <div className='p-4'>{children}</div>
    </div>
  );
}
