import { cn } from "@/lib/utils"
import { ReactNode } from "react"

interface Props {
  children: ReactNode
}

const ShareScreenTabs = ({ children }: Props) => {
  let deafultClss = `w-full h-full [&_.tab-holder_.tab-trigger]:!p-0 [&_.tab-holder_.tab-trigger]:!pb-[2px] [&_.tab-holder_.tab-trigger]:!min-h-10 [&_.tab-holder]:!justify-start [&_.tab-holder_.tab-trigger]:!min-w-[127px]`

  let activeClss =
    "data-[state=active]:[&_.tab-holder_.tab-trigger]:text-white data-[state=active]:[&_.tab-holder_.tab-trigger]:bg-primary"
  let inactiveClss =
    " data-[state=inactive]:[&_.tab-holder_.tab-trigger]:text-white"

  let totalClss = activeClss + inactiveClss

  return <div className={cn(deafultClss, totalClss)}>{children}</div>
}

export default ShareScreenTabs
