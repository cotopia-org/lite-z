import CotopiaIconButton from "@/components/shared-ui/c-icon-button"
import CotopiaTooltip from "@/components/shared-ui/c-tooltip"
import { LocateFixed } from "lucide-react"
import { useReactFlow } from "@xyflow/react"
import { useUserDetail } from "."
import { useCallback } from "react"
import { useRoomContext } from "../../room-context"
import { useSocket } from "@/routes/private-wrarpper"
import useAuth from "@/hooks/auth"
import { VARZ } from "@/const/varz"
import { dispatch } from "use-bus"
import { __BUS } from "@/const/bus"

interface Props {}

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

const UserNavigate = (props: Props) => {
  const socket = useSocket()

  const { user } = useUserDetail()
  const { user: myAccount } = useAuth()

  const { room } = useRoomContext()
  const rf = useReactFlow()

  const nodes = rf.getNodes()

  const navOnUserHandler = useCallback(() => {
    if (!user || !socket || !myAccount) return
    const targetUser = nodes.find((n) => n.id === user.username)

    const jailNode = nodes.find((n) => n.type === VARZ.jailNodeType)
    const bgNode = nodes.find((n) => n.type === VARZ.backgroundNodeType)

    const bgNodeWidth = bgNode?.measured?.width ?? 0
    const jailNodeWidth = jailNode?.measured?.width ?? 0

    const bgNodeHeight = bgNode?.measured?.height ?? 0
    const jailNodeHeight = jailNode?.measured?.height ?? 0

    const wDiff = (bgNodeWidth - jailNodeWidth) * 1.5
    const hDiff = (bgNodeHeight - jailNodeHeight) / 1.5

    const h = targetUser?.measured?.height
    const w = targetUser?.measured?.width
    const xdimension = targetUser?.position.x
    const ydimension = targetUser?.position.y

    if (h && w && xdimension && ydimension) {
      const radius = w / 2

      const x = xdimension + radius
      const y = ydimension + radius
      const zoom = 1.5

      rf.setCenter(x - wDiff, y - hDiff, { zoom, duration: 1000 })

      //calc radius of target user participant
      const { x: aroundX, y: aroundY } = getAroundPoints(
        radius,
        VARZ.teleportMargin
      )
      let finalXCordinate = xdimension + aroundX
      let finalYCordinate = ydimension + aroundY

      const newCoords = `${finalXCordinate},${finalYCordinate}`

      const sendingObject = {
        room_id: room?.id,
        coordinates: newCoords,
        username: myAccount.username,
      }
      socket.emit("updateCoordinates", sendingObject)
      dispatch({
        type: __BUS.changeMyUserCoord,
        data: {
          ...myAccount,
          coordinates: newCoords,
        },
      })
    }
  }, [user, nodes, myAccount?.username])

  return (
    <CotopiaTooltip title="User navigate">
      <CotopiaIconButton
        onClick={navOnUserHandler}
        size={"icon"}
        className="text-black w-6 h-6"
      >
        <LocateFixed size={16} />
      </CotopiaIconButton>
    </CotopiaTooltip>
  )
}

export default UserNavigate
