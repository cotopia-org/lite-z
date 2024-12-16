import CotopiaAvatar from "@/components/shared-ui/c-avatar"
import { useParticipantTileCtx } from "@/components/shared/participant-tiles/participant-tile-provider"
import WithConnectionQuality from "@/routes/private-wrarpper/components/session/with-connection-quality"
import SpeakingShower from "./speaking-shower"

interface Props {}

const UserTileAvatar = (props: Props) => {
  const { quality, targetUser, userFullName, livekitIdentity, isSpeaking } =
    useParticipantTileCtx()

  return (
    <WithConnectionQuality quality={quality}>
      <SpeakingShower isSpeaking={isSpeaking}>
        <CotopiaAvatar
          className="w-14 h-14 text-black"
          src={targetUser?.avatar?.url}
          title={userFullName?.[0] ?? livekitIdentity?.[0] ?? ""}
        />
      </SpeakingShower>
    </WithConnectionQuality>
  )
}

export default UserTileAvatar
