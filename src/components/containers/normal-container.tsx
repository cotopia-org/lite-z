import { ReactNode } from "react"

interface Props {
  children: ReactNode
  className?: string
}

const NormalContainer = ({ children, className = "" }: Props) => {
  return (
    <div className={`w-[1280px] max-w-full px-3 md:px-0 ${className}`}>
      {children}
    </div>
  )
}

export default NormalContainer
