import { ScrollArea } from "@/components/ui/scroll-area"
import BlurFade from "@/components/magicui/blur-fade"
import { LeaderboardType } from "@/types/leaderboard"
import useAuth from "@/hooks/auth"
import { WorkspaceUserType } from "@/types/user"
import WorkingTimes from "./working-times"
import UserSummary from "./user-summary"

type TimeTrackingDetailProps = {
  leaderboard: LeaderboardType[]
  workspaceUsers: WorkspaceUserType[]
  setSelectedUser: Function
}

export default function TimeTrackingDetails({
  leaderboard,
  workspaceUsers,
  setSelectedUser,
}: TimeTrackingDetailProps) {
  const { user } = useAuth()

  let content = (
    <div className="flex flex-col gap-y-1 w-full h-full">
      {leaderboard
        .sort((a, b) => b.sum_minutes - a.sum_minutes)
        .map((item, key) => {
          const isMe = item.user.id === user?.id

          let clss =
            "flex items-center justify-between w-full p-2 px-3 !transform-none hover:bg-grayscale-light hover:cursor-pointer"

          if (isMe) clss += ` bg-blue-400/[0.4] hover:bg-blue-400/[0.4]`

          return (
            <div
              className={"w-full"}
              key={key}
              onClick={() => {
                setSelectedUser(item.user)
              }}
            >
              <BlurFade inView className={clss} delay={0.05 + key * 0.05}>
                <UserSummary
                  leaderboard={item}
                  rank={key + 1}
                  workspaceUsers={workspaceUsers}
                />
                <WorkingTimes leaderboard={item} />
              </BlurFade>
            </div>
          )
        })}
    </div>
  )

  return <ScrollArea className="h-72 w-full">{content}</ScrollArea>
}
