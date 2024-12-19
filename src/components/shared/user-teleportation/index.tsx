import useAuth from "@/hooks/auth"
import { useRoomContext } from "../room/room-context"
import { XYPosition, useReactFlow } from "@xyflow/react"
import { ReactNode } from "react"
import { doCirclesMeetRaw } from "../canvas-board/canvas-audio-rendrer"
import { VARZ } from "@/const/varz"
import { dispatch } from "use-bus"
import { __BUS } from "@/const/bus"

type UserTeleportationType = {
  username?: string
  trigger: (teleport: (onTeleport?: () => {}) => void) => ReactNode
}

const getAroundPoints = (r: number, margin: number) => {
  //get the random angle between 0 and 2Pi (360deg)
  const angle = Math.random() * 2 * Math.PI
  //calc distance from center of circle
  const distance = r + margin
  //clac the distance from the center with the sin cos ratio in the x and y axis

  const xPosition = Math.cos(angle)
  const yPosition = Math.sin(angle)

  let x = distance * xPosition
  let y = distance * yPosition
  if (xPosition < 0) {
    x -= margin
  } else {
    x += margin
  }
  if (yPosition < 0) {
    y -= margin
  } else {
    y += margin
  }

  return { x, y }
}

const UserTeleportation = ({ username, trigger }: UserTeleportationType) => {
  const { user: myAccount } = useAuth()

  const { updateUserCoords } = useRoomContext()
  const rf = useReactFlow()

  const nodes = rf.getNodes()

  const handleCircleMeet = (
    targetUserName: string,
    targetPosition: XYPosition
  ) => {
    const targetUserNode = rf?.getNode(targetUserName)

    if (targetUserNode === undefined) return

    const position = targetPosition

    if (!username) return

    const myUserPosition = rf?.getNode(username)?.position

    if (myUserPosition === undefined) return

    const { meet } = doCirclesMeetRaw(
      46,
      VARZ.voiceAreaRadius,
      myUserPosition,
      position
    )

    rf?.updateNode(targetUserName, {
      data: { ...targetUserNode?.data, meet },
    })

    return meet
  }

  const navigateHandler = (onTeleport?: () => void) => {
    if (!myAccount) return
    if (myAccount?.username === username) return
    const currentUserNode = nodes.find((userNode) => userNode.id === username)
    if (currentUserNode === undefined) return
    const xdimension = currentUserNode?.position.x
    const ydimension = currentUserNode?.position.y
    const radius = 75
    if (xdimension && ydimension) {
      const x = xdimension + radius
      const y = ydimension + radius
      const zoom = 1.5

      rf.setCenter(x, y, { zoom, duration: 1000 })
      //calc radius of target user participant
      const { x: aroundX, y: aroundY } = getAroundPoints(
        radius,
        VARZ.teleportMargin
      )
      let finalXCordinate = xdimension + aroundX
      let finalYCordinate = ydimension + aroundY

      const nPosition = {
        x: finalXCordinate,
        y: finalYCordinate,
      }

      updateUserCoords(myAccount?.username, nPosition)

      handleCircleMeet(currentUserNode.id, currentUserNode.position)

      rf.updateNode(myAccount.username, { position: nPosition })

      dispatch({
        type: __BUS.changeMyUserCoord,
        data: { id: myAccount.username, position: nPosition },
      })

      if (onTeleport) onTeleport()
    }
  }

  return <>{trigger(navigateHandler)}</>
}

export default UserTeleportation
