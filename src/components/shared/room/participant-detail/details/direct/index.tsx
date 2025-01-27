import CotopiaIconButton from '@/components/shared-ui/c-icon-button';
import CotopiaPopover from '@/components/shared-ui/c-popover';
import CotopiaTooltip from '@/components/shared-ui/c-tooltip';
import { SendHorizonal } from 'lucide-react';
import DirectBox from './direct-box';

export default function UserDirect() {
  return (
    <>
      <CotopiaPopover
        trigger={
          <CotopiaTooltip title="Send direct">
            <CotopiaIconButton size={'icon'} className="text-black w-6 h-6">
              <SendHorizonal size={16} />
            </CotopiaIconButton>
          </CotopiaTooltip>
        }
      >
        {() => {
          return <DirectBox />;
        }}
      </CotopiaPopover>
    </>
  );
}
