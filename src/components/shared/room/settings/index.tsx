import { useEffect, useState } from "react";
import CTabs from "@/components/shared-ui/c-tabs";
import UserChat from "./chat";
import WorkspaceUsers from "./users";
import WorkspaceSidebar from "@/routes/private-wrarpper/components/workspaces/sidebar";
import { Profile2UserIcon, SoundIcon } from "@/components/icons";
import { colors } from "@/const/varz";
import { useRoomContext } from "../room-context";
import { useAppDispatch } from "@/store";
import { getChats } from "@/store/slices/chat-slice";
import ChatIcon from "./chat-icon";
import UserActionsAvatarButton from "../../user-actions-avatar-button";

export default function RoomSettings() {
  const { workspace_id } = useRoomContext();

  const dispatch = useAppDispatch();

  useEffect(() => {
    if (!workspace_id) return;

    dispatch(getChats({ workspace_id: +workspace_id }));
  }, [workspace_id]);

  const [value, setValue] = useState("rooms");

  return (
    <div className='flex flex-col gap-y-4'>
      <CTabs
        title={
          <div>
            <UserActionsAvatarButton size='large' />
          </div>
        }
        defaultValue={value}
        onChangeTab={setValue}
        className=' [&_.tab-holder]:p-6 [&_.tab-holder]:py-4 [&_.tab-holder]:shadow-app-bar'
        items={[
          {
            icon: <SoundIcon color={colors.grayscale.grayscaleCaption} />,
            content: <WorkspaceSidebar />,
            value: "rooms",
          },
          {
            icon: <ChatIcon />,
            content: <UserChat />,
            value: "chat",
          },
          {
            icon: (
              <Profile2UserIcon color={colors.grayscale.grayscaleCaption} />
            ),
            content: <WorkspaceUsers />,
            value: "users",
          },
        ]}
      />
    </div>
  );
}
