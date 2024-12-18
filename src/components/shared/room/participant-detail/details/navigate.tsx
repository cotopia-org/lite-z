import CotopiaIconButton from "@/components/shared-ui/c-icon-button"
import CotopiaTooltip from "@/components/shared-ui/c-tooltip"
import { LocateFixed } from "lucide-react"
import { useReactFlow, XYPosition } from "@xyflow/react"
import { useUserDetail } from "."
import { useRoomContext } from "../../room-context"
import useAuth from "@/hooks/auth"
import { VARZ } from "@/const/varz"
import { dispatch } from "use-bus"
import { __BUS } from "@/const/bus"
import { doCirclesMeetRaw } from "@/components/shared/canvas-board/canvas-audio-rendrer"

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
  const { user } = useUserDetail()
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

    if (!user?.username) return

    const myUserPosition = rf?.getNode(user?.username)?.position

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

  const navigateHandler = () => {
    if (!myAccount) return

    const currentUserNode = nodes.find(
      (userNode) => userNode.id === user?.username
    )

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
    }
  }

  return (
    <CotopiaTooltip title="User navigate">
      <CotopiaIconButton
        onClick={navigateHandler}
        size={"icon"}
        className="text-black w-6 h-6"
      >
        <LocateFixed size={16} />
      </CotopiaIconButton>
    </CotopiaTooltip>
  )
}

export default UserNavigate
