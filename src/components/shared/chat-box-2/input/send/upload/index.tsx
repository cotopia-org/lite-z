import { Paperclip } from 'lucide-react';
import { createContext, useCallback, useContext, useState } from 'react';
import UploadButton from './upload-button';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import UploadRenderer from './types/renderer';
import UploadActions from './actions';
import useLoading from '@/hooks/use-loading';
import { useChat2 } from '@/hooks/chat/use-chat-2';
import axiosInstance from '@/services/axios';
import { AttachmentFileType } from '@/types/file';

const UploadAttachmentContext = createContext<{
  file: File | undefined;
  closeModal: () => void;
  send: () => void;
  sendLoading: boolean;
}>({
  file: undefined,
  closeModal: () => {},
  send: () => {},
  sendLoading: false,
});

export const useUploadAttachment = () => useContext(UploadAttachmentContext);

export default function UploadAttachment() {
  const { startLoading, stopLoading, isLoading } = useLoading();

  const [file, setFile] = useState<File | undefined>(undefined);

  const handleFile = useCallback((file: File | null) => {
    if (file === null) return;

    setFile(file);
  }, []);

  const { currentChat } = useChat2();

  const { send } = useChat2({ chat_id: currentChat?.id });

  const handleSend = async () => {
    startLoading();

    //Upload attachment
    const formData = new FormData();
    if (file) formData.append('file', file);

    // addSimple({ files: file ? [file] : [], text: 'تست فایل ', seen: true });

    const fileRes = await axiosInstance.post(`/files`, formData);

    stopLoading();

    const attachment: AttachmentFileType = fileRes?.data?.data;

    send({ files: [attachment], text: '', seen: true });

    closeModal();
  };

  const closeModal = () => {
    setFile(undefined);
  };

  return (
    <UploadAttachmentContext.Provider
      value={{ file, closeModal, send: handleSend, sendLoading: isLoading }}
    >
      <UploadButton icon={<Paperclip />} onSelect={handleFile} />
      <Dialog
        open={!!file}
        onOpenChange={(open) => open === false && setFile(undefined)}
      >
        <DialogContent>
          {!!file && <UploadRenderer file={file} />}
          <UploadActions />
        </DialogContent>
      </Dialog>
    </UploadAttachmentContext.Provider>
  );
}
