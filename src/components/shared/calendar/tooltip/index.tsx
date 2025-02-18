import CotopiaIconButton from '@/components/shared-ui/c-icon-button';
import { X } from 'lucide-react';
import { ReactNode } from 'react';

export type CalendarTooltipProps = {
  title?: string;
  children: ReactNode;
  onClose: () => void;
};
export default function Tooltip({
  children,
  title,
  onClose,
}: CalendarTooltipProps) {
  return (
    <div className="flex flex-col gap-y-2 rounded-xl p-4 border border-grayscale-border bg-white ">
      <div className="flex flex-row items-center justify-between w-full gap-x-8 border-b pb-2">
        <strong>{title}</strong>
        <CotopiaIconButton
          onClick={onClose}
          className="text-black min-w-[initial] min-h-[initial] !w-6 !h-6"
        >
          <X size={16} />
        </CotopiaIconButton>
      </div>
      {children}
    </div>
  );
}
