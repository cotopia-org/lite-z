import { LinkButton } from "@/components/shared"
import { useTimer } from "@/hooks"
import { useEffect } from "react"

interface Props {}

const ResendCodeHandler = (props: Props) => {
  const { startTimer, time, isDisabled } = useTimer(60000)

  const onResendCode = () => {
    startTimer()
  }
  let resendNode = (
    <LinkButton onClick={onResendCode}>ارسال مجدد کد تایید</LinkButton>
  )

  if (isDisabled) {
    resendNode = <span className="text-primary font-medium">{time}</span>
  }

  useEffect(() => {
    startTimer()
  }, [])

  return (
    <div className="flex flex-col gap-y-2 items-center w-full">
      <span className="text-base text-black/[0.87]">
        کد تایید را دریافت نکرده اید؟
      </span>
      {resendNode}
    </div>
  )
}

export default ResendCodeHandler
