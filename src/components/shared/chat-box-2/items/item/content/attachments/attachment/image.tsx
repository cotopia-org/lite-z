import { AttachmentFileType } from '@/types/file';

type Props = {
  image: AttachmentFileType;
};
export default function AttachmentImage({ image }: Props) {
  return <img className="w-full h-auto rounded-md" src={image.url} alt="" />;
}
