import { useEffect, useRef, useState } from "react"
import { useRoomContext } from "../room-context"
import { TracksContextProvider } from "../sessions/context"
import MeetingRoom from "./meeting-room"

import MeetingWrapper from "./wrapper"
import { UserMinimalType } from "@/types/user"
import useBus from "use-bus"
import { __BUS } from "@/const/bus"
import { useAllTrackContext } from "../sessions/context/tracks-provider"
import { isScreenShareExist } from "@/lib/utils"
import { useSocket } from "@/routes/private-wrarpper"
import { LivekitTrackPublishedType } from "@/types/socket"

interface Props {}

type MeetingNodeType = {
  id: string | number
  type: "user" | "share-screen"
  participant: UserMinimalType
}

const GridRoomView = (props: Props) => {
  const { room } = useRoomContext()
  const [nodes, setNodes] = useState<MeetingNodeType[]>([])

  const { tracks } = useAllTrackContext()

  const initRef = useRef(false)
  const isInitShareScreen = useRef(false)

  const { hasShareScreen, shareScreenTrack } = isScreenShareExist(tracks)

  useEffect(() => {
    const initParticipants = room?.participants || []
    if (!hasShareScreen) return
    if (!shareScreenTrack) return
    if (isInitShareScreen.current === true) return

    const targetParticipant = initParticipants.find(
      (p) => p.username === shareScreenTrack.participant.identity
    ) as UserMinimalType

    setNodes((crt) => {
      return [
        ...crt,
        {
          id: shareScreenTrack?.publication?.track?.sid as string,
          type: "share-screen",
          participant: targetParticipant,
        },
      ]
    })
    isInitShareScreen.current = true
  }, [hasShareScreen, shareScreenTrack, room?.participants])

  useEffect(() => {
    const initParticipants = room?.participants || []
    if (initRef.current === true) return
    if (initParticipants.length === 0) return
    setNodes(
      initParticipants.map((p) => ({ id: p.id, type: "user", participant: p }))
    )
    initRef.current = true
  }, [room?.participants])

  useBus(
    __BUS.initRoomParticipantsOnRf,
    (data: any) => {
      //update participants when somebody join into the room
      const participants: UserMinimalType[] = data?.participants || []
      setNodes(
        participants.map((p) => ({ id: p.id, type: "user", participant: p }))
      )
    },
    [nodes]
  )

  useSocket(
    "livekitEvent",
    (data: LivekitTrackPublishedType) => {
      switch (data.event) {
        case "track_published":
          switch (data.track.source) {
            case "SCREEN_SHARE":
              const target_user = nodes.find(
                (n) => n.participant.username === data?.participant.identity
              )?.participant
              setNodes((crt) => [
                ...crt,
                {
                  id: data.track.sid,
                  type: "share-screen",
                  participant: target_user as UserMinimalType,
                },
              ])
              break
          }
          break
        case "track_unpublished":
          switch (data.track.source) {
            case "SCREEN_SHARE":
              setNodes((crt) => crt.filter((n) => n.id !== data?.track.sid))
              break
          }
          break
      }
    },
    [nodes]
  )

  return (
    <TracksContextProvider>
      <div id="room-view" className="w-full h-full bg-black text-white">
        <MeetingWrapper>
          <MeetingRoom />
        </MeetingWrapper>
      </div>
    </TracksContextProvider>
  )
}

export default GridRoomView
