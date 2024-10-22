import { ReactNode } from "react"

interface Props {
  lable: string
  icon: ReactNode
}

const LabeledIcon = ({ lable, icon }: Props) => {
  return (
    <div className="flex items-end gap-x-2">
      {icon}
      <span className="label text-base leading-5  text-black/[0.87] font-medium">
        {lable}
      </span>
    </div>
  )
}

export default LabeledIcon
