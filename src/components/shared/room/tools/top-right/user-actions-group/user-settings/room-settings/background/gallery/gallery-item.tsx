import CotopiaTooltip from '@/components/shared-ui/c-tooltip';
import FullLoading from '@/components/shared/full-loading';
import useLoading from '@/hooks/use-loading';
import axiosInstance from '@/services/axios';
import { AttachmentFileType } from '@/types/file';
import { GalleryItemType } from '@/types/gallery';

type Props = {
  item: GalleryItemType;
  room_id: number;
  workspace_id: number;
};

export default function GalleryItem({ item, room_id, workspace_id }: Props) {
  const { isLoading, startLoading, stopLoading } = useLoading();
  const handleSetBackground = async () => {
    startLoading();
    try {
      const res = await axiosInstance.post(`/files`, {
        path: item.source,
      });
      const file: AttachmentFileType = res.data.data;
      await axiosInstance.put(`/rooms/${room_id}`, {
        background_id: file.id,
      });
      stopLoading();
    } catch (e) {
      stopLoading();
    }
  };

  return (
    <CotopiaTooltip title={item.title} triggerClassName="w-full">
      <div
        className="w-full h-[115px] relative cursor-pointer hover:opacity-80"
        onClick={handleSetBackground}
      >
        <img src={item.source} alt={item.title} />
        {isLoading && (
          <FullLoading
            className={
              'absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] justify-center'
            }
          />
        )}
      </div>
    </CotopiaTooltip>
  );
}
