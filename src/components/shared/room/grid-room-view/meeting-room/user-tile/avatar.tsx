import CotopiaAvatar from "@/components/shared-ui/c-avatar"
import { useParticipantTileCtx } from "@/components/shared/participant-tiles/participant-tile-provider"
import WithConnectionQuality from "@/routes/private-wrarpper/components/session/with-connection-quality"
import React from "react"

interface Props {}

const UserTileAvatar = (props: Props) => {
  const { quality, targetUser, userFullName, livekitIdentity } =
    useParticipantTileCtx()

  return (
    <WithConnectionQuality quality={quality}>
      <CotopiaAvatar
        src={targetUser?.avatar?.url}
        title={userFullName?.[0] ?? livekitIdentity?.[0] ?? ""}
      />
    </WithConnectionQuality>
  )
}

export default UserTileAvatar
