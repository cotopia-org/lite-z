import { ReactNode, useState } from "react"
import CTabs from "@/components/shared-ui/c-tabs"
import SettingsChatAction from "./chat/action"
import UserChat from "./chat"
import WorkspaceUsers from "./users"
import CBadgeSimple from "@/components/shared-ui/c-badge/c-badge-simple"
import { useAppSelector } from "@/store"
import WorkspaceSidebar from "@/routes/private-wrarpper/components/workspaces/sidebar"
import { MessagesIcon, Profile2UserIcon, SoundIcon } from "@/components/icons"
import { colors } from "@/const/varz"

export default function RoomSettings() {
  const roomSlice = useAppSelector((state) => state.room)

  const messagesCount = roomSlice?.messages_count ?? { room: [], objects: {} }

  const roomIds = messagesCount.room
  const directsIds = Object?.values(messagesCount.directs).flatMap(
    (item) => item
  )

  const totalCount = roomIds.length + directsIds.length

  const [value, setValue] = useState("rooms")

  let title: ReactNode = ""
  switch (value) {
    case "chat":
      title = <SettingsChatAction />
      break
  }

  return (
    <div className="flex flex-col gap-y-4">
      <CTabs
        title={<div>{title}</div>}
        defaultValue={value}
        onChangeTab={setValue}
        className="[&_.tab-content>*]:p-6 [&_.tab-content>*]:py-4 [&_.tab-holder]:p-6 [&_.tab-holder]:py-4 [&_.tab-holder]:shadow-app-bar"
        items={[
          {
            icon: <SoundIcon color={colors.grayscale.grayscaleCaption} />,
            content: <WorkspaceSidebar />,
            value: "rooms",
          },
          {
            icon: (
              <CBadgeSimple count={totalCount}>
                <MessagesIcon color={colors.grayscale.grayscaleCaption} />
              </CBadgeSimple>
            ),
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
  )
}
