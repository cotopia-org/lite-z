import { MeetingNodeType } from "../.."

type Props = {
  shareScreenNodes: MeetingNodeType[]
  usersNodes: MeetingNodeType[]
}

const ShareScreenView = ({ shareScreenNodes, usersNodes }: Props) => {
  return (
    <div className="grid h-full w-full p-4 grid-rows-8 grid-cols-12 grid-flow-col gap-4">
      <div className="row-span-8 col-span-12 grid grid-cols-subgrid gap-y-4">
        <div className="col-span-12 bg-red-200 ">inner</div>
        <div className="col-span-12 bg-red-200">inner</div>
        <div className="col-span-12 bg-red-200">inner</div>
      </div>
      <div className="row-span-2 col-span-12 bg-red-200 ">02</div>
      <div className="row-span-2 col-span-12  bg-red-200">03</div>
      <div className="row-span-2 col-span-12 bg-red-200 ">04</div>
      <div className="row-span-2 col-span-12  bg-red-200">05</div>
      <div className="row-span-2 col-span-12 bg-red-200 ">06</div>
      <div className="row-span-2 col-span-12 bg-red-200">07</div>
    </div>
  )
}

export default ShareScreenView
