import { colors } from "@/const/varz"
import useAuth from "@/hooks/auth"
import { cn, convertMinutesToHHMMSS } from "@/lib/utils"
import { LeaderboardType } from "@/types/leaderboard"

type Props = {
  leaderboard: LeaderboardType
}

const WorkingTime = ({
  time,
  className = "",
}: {
  time: number
  className?: string
}) => {
  return (
    <span
      className={cn(
        "text-xs font-medium text-grayscale-paragraph w-[40px] opacity-85 text-center",
        className
      )}
    >
      {convertMinutesToHHMMSS(time, true)}
    </span>
  )
}

const WorkingTimes = ({ leaderboard }: Props) => {
  const { user: myAccount } = useAuth()
  const leaderboard_user = leaderboard.user
  const working_time = leaderboard.working_minutes
  const idle_time = leaderboard.idle_minutes

  const isMe = leaderboard_user.id === myAccount?.id

  const user_existence =
    leaderboard_user.status === "online" && leaderboard_user.room_id !== null
  let pointed_time = false

  if (user_existence || isMe) {
    pointed_time = true
  }

  let view = (
    <>
      <WorkingTime time={working_time} />
      <WorkingTime time={idle_time} className="text-yellow-600" />
    </>
  )

  if (pointed_time) {
    view = (
      <>
        <WorkingTime time={working_time} className="font-bold opacity-100" />
        <WorkingTime
          time={idle_time}
          className="font-bold opacity-100 text-yellow-600"
        />
      </>
    )
  }

  return (
    <div className={"flex flex-row gap-x-2 items-center justify-end"}>
      {view}
    </div>
  )
}

export default WorkingTimes
