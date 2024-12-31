import { Chat2ItemType } from '@/types/chat2';
import Attachment from './attachment';

type Props = {
  item: Chat2ItemType;
};
export default function AttachmentRenderer({ item }: Props) {
  if (item.files.length === 0) return null;

  return (
    <div className="flex flex-col">
      {item.files.map((item) => (
        <Attachment item={item} key={item.id} />
      ))}
    </div>
  );
}
