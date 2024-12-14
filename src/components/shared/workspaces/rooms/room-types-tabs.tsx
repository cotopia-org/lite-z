import { cn } from "@/lib/utils"
import { ReactNode } from "react"

interface Props {
  children: ReactNode
}

const RoomTypesTabs = ({ children }: Props) => {
  let deafultClss = `w-full h-full [&_.tab-holder_.tab-trigger]:!p-0 [&_.tab-holder_.tab-trigger]:!pb-[2px] [&_.tab-holder_.tab-trigger]:!min-h-10 [&_.tab-holder]:!justify-end [&_.tab-holder_.tab-trigger]:!min-w-[100px] [&_.tab-holder_.tab-trigger]:!shadow-none`

  let activeClss =
    "data-[state=active]:[&_.tab-holder_.tab-trigger]:text-primary data-[state=active]:[&_.tab-holder_.tab-trigger]:bg-transparent"
  let inactiveClss =
    " data-[state=inactive]:[&_.tab-holder_.tab-trigger]:text-foreground"

  let totalClss = activeClss + inactiveClss

  return <div className={cn(deafultClss, totalClss)}>{children}</div>
}

export default RoomTypesTabs
