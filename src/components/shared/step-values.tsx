import { useValues } from "@/hooks"
import { ReactNode, useEffect, useState } from "react"

type Props<T> = {
  defaultStep?: number
  initValues?: T
  children: ({
    step,
  }: {
    step: number
    prevStep: () => void
    nextStep: () => void
    values: T | undefined
    changeKey: (key: string, value: any) => void
    changeBulk: (values: object) => void
    changeStep: (step: number) => void
  }) => ReactNode
}

const StepValues = <T extends { [key: string]: any }>({
  defaultStep,
  initValues,
  children,
}: Props<T>) => {
  const [step, setStep] = useState(0)

  const { changeBulk, changeKey, values } = useValues<T>({} as T)

  useEffect(() => {
    if (initValues !== undefined) {
      changeBulk(initValues)
    }
  }, [initValues])

  useEffect(() => {
    if (defaultStep !== undefined) setStep(defaultStep)
  }, [defaultStep])

  const prevStep = () => {
    setStep((crt) => {
      if (crt === 0) return crt
      return crt - 1
    })
  }

  const nextStep = () => {
    setStep((crt) => crt + 1)
  }

  const changeStep = (newStep: number) => {
    setStep((crt) => {
      if (newStep > 0) {
        return newStep
      } else {
        return crt
      }
    })
  }

  let output = {
    step,
    prevStep,
    nextStep,
    changeBulk,
    changeKey,
    changeStep,
    values,
  }

  return <>{children(output)}</>
}

export default StepValues
