import { DialogClose, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { X } from 'lucide-react';
import { useUploadAttachment } from '..';
import VideoPlayer from '@/components/shared/video-player';

export default function UploadVideo() {
  const { file } = useUploadAttachment();

  if (!file) return null;

  return (
    <>
      <DialogHeader className="dialog-header flex-row justify-between w-full  items-center">
        <DialogTitle className="dialog-title text-3xl font-medium">
          {`Send a video`}
        </DialogTitle>
        <DialogClose className="opacity-70 hover:opacity-100">
          <X className="h-5 w-5" />
          <span className="sr-only">Close</span>
        </DialogClose>
      </DialogHeader>
      <div className="bg-black/10 [&_video]:!max-h-[400px]">
        <VideoPlayer videoSrc={URL.createObjectURL(file)} freezeState />
      </div>
    </>
  );
}
