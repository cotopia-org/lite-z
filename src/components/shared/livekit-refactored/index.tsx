import { VARZ } from "@/const/varz"
import { useAppSelector } from "@/store"
import { LiveKitRoom } from "@livekit/components-react"
import { ReactNode } from "react"
import { useRoomHolder } from "../room"

type Props = {
  children: ReactNode
}
export default function LivekitRefactored({ children }: Props) {
  const { token } = useAppSelector((store) => store.livekit)

  const { mediaPermissions } = useRoomHolder()

  return (
    //@ts-ignore
    <LiveKitRoom
      serverUrl={VARZ.serverUrl}
      token={token}
      connect={true}
      video={mediaPermissions.video}
      audio={mediaPermissions.audio}
    >
      {children}
    </LiveKitRoom>
  )
}
