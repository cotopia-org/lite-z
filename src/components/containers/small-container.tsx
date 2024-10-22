import { ReactNode } from "react"

interface Props {
  children: ReactNode
  className?: string
}

const NormalContainer = ({ children, className = "" }: Props) => {
  return (
    <div className={`w-[400px] max-w-full h-full px-3 md:px-0 ${className}`}>
      {children}
    </div>
  )
}

export default NormalContainer
