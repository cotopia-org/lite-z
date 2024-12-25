import Rank from "./rank"
import { LeaderboardType } from "@/types/leaderboard"
import UserAvatar from "@/components/shared/user-avatar"
import { WorkspaceUserType } from "@/types/user"

type Props = {
  rank: number
  leaderboard: LeaderboardType
  workspaceUsers: WorkspaceUserType[]
}

const UserSummary = ({ rank, leaderboard, workspaceUsers }: Props) => {
  const user = leaderboard.user

  const avatar = workspaceUsers.find((x) => x.id === user.id)?.avatar

  const username = user.name

  return (
    <div className="flex flex-row w-full items-center gap-x-2">
      <Rank rank={rank} />
      <UserAvatar title={username} src={avatar?.url} />
      <span className="text-xs text-grayscale-subtitle font-medium">
        {username ?? "-"}
      </span>
    </div>
  )
}

export default UserSummary
