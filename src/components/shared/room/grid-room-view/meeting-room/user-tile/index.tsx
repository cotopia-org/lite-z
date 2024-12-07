import { useParticipantTileCtx } from "@/components/shared/participant-tiles/participant-tile-provider"
import { cn } from "@/lib/utils"
import UserTileAvatar from "./avatar"

type Props = {
  className?: string
}

const UserTile = ({ className = "" }: Props) => {
  const { ref, htmlProps } = useParticipantTileCtx()
  return (
    <div
      className={cn(
        `drop-shadow-light relative w-full h-full flex flex-col
         p-4 items-center justify-center rounded-2xl`,
        className
      )}
    >
      <div className="relative" ref={ref} {...htmlProps}>
        <UserTileAvatar />
      </div>
    </div>
  )
}

export default UserTile
