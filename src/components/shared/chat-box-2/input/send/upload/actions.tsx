import CotopiaButton from '@/components/shared-ui/c-button';
import { useUploadAttachment } from '.';

export default function UploadActions() {
  const { closeModal, send, sendLoading } = useUploadAttachment();

  return (
    <div className="flex flex-row justify-between">
      <CotopiaButton variant={'ghost'} onClick={closeModal}>
        Cancel
      </CotopiaButton>
      <CotopiaButton variant={'ghost'} onClick={send} loading={sendLoading}>
        Send
      </CotopiaButton>
    </div>
  );
}
