import TitleEl from "@/components/shared/title-el"
import { ReactNode } from "react"

type Props = {
    title: string
    children: ReactNode
}
export default function RoomsHolder({title, children}: Props) {
  return (
    <TitleEl title={title} className="!gap-y-0 [&_strong]:italic [&_strong]:p-4">
        {children}
    </TitleEl>
  )
}
