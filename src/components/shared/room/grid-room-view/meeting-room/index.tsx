import { MeetingNodeType, MeetingTileType } from ".."
import ParticipantsView from "./participants-view"
import ShareScreenView from "./share-screen-view"

const getShareScreenNodes = (nodes: MeetingNodeType[]) => {
  let items = []
  for (let node of nodes) {
    if (node.type === MeetingTileType.ShareScreenTile) {
      items.push(node)
    }
  }
  return items
}

const getExcludeShareScreenNode = (nodes: MeetingNodeType[]) => {
  return nodes.filter((node) => node.type !== MeetingTileType.ShareScreenTile)
}

const MeetingRoom = ({ nodes }: { nodes: MeetingNodeType[] }) => {
  const share_screens = getShareScreenNodes(nodes)

  const user_nodes = getExcludeShareScreenNode(nodes)

  if (share_screens.length > 0) {
    return (
      <ShareScreenView
        shareScreenNodes={share_screens}
        usersNodes={user_nodes}
      />
    )
  } else {
    return <ParticipantsView userNodes={user_nodes} />
  }
}

export default MeetingRoom
