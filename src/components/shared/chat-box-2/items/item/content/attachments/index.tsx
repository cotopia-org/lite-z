import { Chat2ItemType } from '@/types/chat2';
import Attachment from './attachment';
import VoicePlayer from './voice';

type Props = {
  item: Chat2ItemType;
};
export default function AttachmentRenderer({ item }: Props) {
  return (
    <div className="flex flex-col">
      {item?.voice && <VoicePlayer audioSrc={item.voice.url} />}
      {item.files?.length > 0 &&
        item.files.map((item) => <Attachment item={item} key={item.id} />)}
    </div>
  );
}
