import { AttachmentFileType } from '@/types/file';
import AttachmentImage from './image';

type Props = {
  item: AttachmentFileType;
};
export default function Attachment({ item }: Props) {
  switch (item.mime_type) {
    case 'image/jpeg':
    case 'image/png':
    case 'image/jpeg':
    case 'image/gif':
    case 'image/webp':
    case 'image/tif':
      return <AttachmentImage image={item} />;
  }

  return <div>Attachment</div>;
}
