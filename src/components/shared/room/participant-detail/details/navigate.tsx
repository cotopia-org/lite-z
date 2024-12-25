import CotopiaIconButton from "@/components/shared-ui/c-icon-button"
import CotopiaTooltip from "@/components/shared-ui/c-tooltip"
import { LocateFixed } from "lucide-react"
import { useUserDetail } from "."
import UserTeleportation from "@/components/shared/user-teleportation"

interface Props {}

const UserNavigate = (props: Props) => {
  const { user } = useUserDetail()
  return (
    <UserTeleportation
      username={user?.username}
      trigger={(navigateHandler) => {
        return (
          <CotopiaTooltip title="User navigate">
            <CotopiaIconButton
              onClick={() => navigateHandler()}
              size={"icon"}
              className="text-black w-6 h-6"
            >
              <LocateFixed size={16} />
            </CotopiaIconButton>
          </CotopiaTooltip>
        )
      }}
    />
  )
}

export default UserNavigate
