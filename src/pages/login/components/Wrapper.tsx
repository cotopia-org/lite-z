import { SmallContainer } from "@/components/containers"
import Footer from "./Footer"
import { ReactNode } from "react"

interface Props {
  children: ReactNode
}

const LoginWrapper = ({ children }: Props) => {
  return (
    <div className="flex flex-col justify-between items-center w-full h-screen">
      <SmallContainer>{children}</SmallContainer>
      <Footer />
    </div>
  )
}

export default LoginWrapper
