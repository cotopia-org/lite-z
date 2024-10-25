import Uploader from "@/components/shared/uploader";
import useAuth from "@/hooks/auth";
import axiosInstance from "@/services/axios";
import { AttachmentFileType } from "@/types/file";

export default function UploadAvatar() {
  const { user } = useAuth();

  const handleUpdateAvatar = (file: AttachmentFileType) => {
    axiosInstance
      .put(`/users/update`, {
        avatar_id: file.id,
      })
      .then((res) => {});
  };

  const handleDeleteAvatar = () => {
    axiosInstance
      .put(`/users/update`, {
        avatar_id: undefined,
      })
      .then((res) => {});
  };

  return (
    <div className='w-[120px] max-w-full'>
      <Uploader
        defaultMedia={user?.avatar ?? undefined}
        onUpload={handleUpdateAvatar}
        onDelete={handleDeleteAvatar}
        label='Avatar'
      />
    </div>
  );
}
