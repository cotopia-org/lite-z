import React, { useEffect } from "react"
import { useRoomContext } from "../room-context"
import RoomSidebar from "../sidebar"
import RoomSettings from "../settings"
import LiveKitAudioManager from "../components/audio-manager"
import InitRoom from "./init-room"
import CanvasBoard from "../../canvas-board"
import { useSocket } from "@/routes/private-wrarpper"
import { useParams } from "react-router-dom"

export default function RoomInner() {
  const { room_id } = useParams()

  const socket = useSocket()

  const { sidebar, joinRoom } = useRoomContext()

  useEffect(() => {
    const fn = () => {
      if (room_id) joinRoom(room_id)
    }
    socket?.on("connect", fn)
    return () => {
      socket?.off("connect", fn)
    }
  }, [socket, joinRoom, room_id])

  let mainRoomHolderClss = "main-room-holder w-full h-screen overflow-hidden"
  if (sidebar) mainRoomHolderClss += " pr-[376px]"

  useEffect(() => {
    if (room_id) joinRoom(room_id)
  }, [room_id])

  return (
    <>
      <InitRoom />
      <div id="main-room-holder" className={mainRoomHolderClss}>
        <div className="w-full h-full relative">
          <CanvasBoard />
        </div>
        {!!sidebar && (
          <div className="fixed right-0 top-0 bottom-0 w-[376px] bg-white h-screen overflow-y-auto">
            <RoomSidebar>
              <RoomSettings />
            </RoomSidebar>
          </div>
        )}
        <LiveKitAudioManager />
      </div>
    </>
  )
}
