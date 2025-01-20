import { useChat2 } from '@/hooks/chat/use-chat-2';
import VoiceRecorder from './voice-component';
import useLoading from '@/hooks/use-loading';
import axiosInstance from '@/services/axios';
import { AttachmentFileType } from '@/types/file';

export default function MicButtonHandler() {
  const { startLoading, stopLoading, isLoading } = useLoading();

  const { send } = useChat2();

  const handleSendVoice = async (file: Blob) => {
    startLoading();
    //Upload attachment
    const formData = new FormData();
    if (file) formData.append('file', file);
    try {
      const fileRes = await axiosInstance.post(`/files`, formData);
      const attachment: AttachmentFileType = fileRes?.data?.data;
      await send({ voice_id: attachment.id });
      stopLoading();
    } catch (e) {
      stopLoading();
    }
  };

  return (
    <VoiceRecorder disabled={isLoading} onRecordingComplete={handleSendVoice} />
  );
}
