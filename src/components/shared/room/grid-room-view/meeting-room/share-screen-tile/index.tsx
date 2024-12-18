import ShareScreenProvider from "@/components/shared/share-screen-card/provider"
import { MeetingNodeType, MeetingTileType } from "../.."
import ShareScreenCard from "@/components/shared/share-screen-card"

type Props = {
  node: MeetingNodeType
}

const ShareScreenTile = ({ node }: Props) => {
  return (
    <ShareScreenProvider
      lkOptions={{
        identity: node.participant.username,
        source: MeetingTileType.ShareScreenTile,
      }}
    >
      <ShareScreenCard className="border-none w-fit shadow-none" />
    </ShareScreenProvider>
  )
}

export default ShareScreenTile
