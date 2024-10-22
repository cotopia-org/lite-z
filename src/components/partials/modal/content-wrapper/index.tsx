import { OrgIconButton } from "@/components/shared-ui";
import { X } from "lucide-react";
import { ReactNode } from "react";

type Props = {
  title?: string;
  onClose: () => void;
  children: ReactNode;
};
export default function ModalContentWrapper({
  title,
  onClose,
  children,
}: Props) {
  return (
    <div className='flex flex-col gap-y-4'>
      <div className='flex flex-col items-center p-4 relative min-h-[56px]'>
        {!!title && <strong>{title}</strong>}
        {!!onClose && (
          <OrgIconButton
            onClick={onClose}
            className='absolute top-[50%] translate-y-[-50%] left-2'
          >
            <X />
          </OrgIconButton>
        )}
      </div>
      <div className='children p-4'>{children}</div>
    </div>
  );
}
