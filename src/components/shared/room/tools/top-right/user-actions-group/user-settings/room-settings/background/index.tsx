import CTabs from "@/components/shared-ui/c-tabs";
import Gallery from "./gallery";
import { useRoomContext } from "@/components/shared/room/room-context";

export default function BackgroundSetting() {
  const { room_id, workspace_id } = useRoomContext();

  if (!room_id) {
    return null;
  }

  if (!workspace_id) {
    return null;
  }

  return (
    <CTabs
      title='Background'
      titleClassName='text-base text-gray-700'
      defaultValue='gallery'
      items={[
        {
          title: "Gallery",
          value: "gallery",
          content: <Gallery room_id={room_id} workspace_id={workspace_id} />,
        },
        {
          title: "Upload",
          value: "upload",
          content: <>This feature will be ready in the soon future.</>,
        },
      ]}
    />
  );
}
