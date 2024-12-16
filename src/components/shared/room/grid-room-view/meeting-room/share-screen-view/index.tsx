import CTabs from "@/components/shared-ui/c-tabs"
import { MeetingNodeType } from "../.."
import ShareScreenTabs from "./share-screen-tabs"
import MeetingNode from "../meeting-node"
import ShareScreenTile from "../share-screen-tile"

type Props = {
  shareScreenNodes: MeetingNodeType[]
  usersNodes: MeetingNodeType[]
}

const ShareScreenView = ({ shareScreenNodes, usersNodes }: Props) => {
  const shareScreenItems = shareScreenNodes.map((node) => {
    return {
      title: node.participant.username,
      value: "" + node.id,
      content: <ShareScreenTile node={node} />,
    }
  })

  return (
    <div className="grid h-full w-full p-4 grid-rows-8 grid-cols-12 grid-flow-col gap-4 ">
      <div className="row-span-8 relative [&_video]:max-h-[450px] col-span-12">
        <ShareScreenTabs>
          <CTabs
            defaultValue={shareScreenItems?.[0]?.value}
            items={shareScreenItems}
          />
        </ShareScreenTabs>
      </div>
      <div className="row-span-8 mt-12 grid gap-4 grid-rows-8 grid-flow-col">
        {usersNodes.map((node) => {
          return (
            <div
              key={node.id}
              className="row-span-2 min-w-[200px] min-h-[100px] h-full"
            >
              <MeetingNode key={node.id} node={node} />
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default ShareScreenView
