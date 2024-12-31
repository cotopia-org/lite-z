import UploadImage from './image';
import UploadVideo from './video';

type Props = {
  file: File;
};
export default function UploadRenderer({ file }: Props) {
  switch (file.type) {
    case 'image/jpeg':
    case 'image/png':
    case 'image/gif':
    case 'image/webp':
      return <UploadImage />;
    case 'video/mp4':
    case 'video/mov':
      return <UploadVideo />;
  }

  return null;
}
