import { useState } from "react"
import { OrgIconButton, OrgInput } from "../shared-ui"
import { OrgInputProps } from "../shared-ui/o-input"
import { EyeIcon, EyeOff } from "lucide-react"
import colors from "tailwindcss/colors"

type Props = {} & OrgInputProps

const PasswordInput = ({ disabled, ...rest }: Props) => {
  const [visible, setVisible] = useState(false)

  return (
    <OrgInput
      type={visible ? "text" : "password"}
      disabled={disabled}
      beforeNode={
        <OrgIconButton
          disabled={disabled}
          tabIndex={-1}
          type="button"
          onClick={(e) => {
            e.stopPropagation()
            e.preventDefault()
            setVisible((crt) => !crt)
          }}
        >
          {visible ? (
            <EyeOff color={colors["gray"][600]} size={24} />
          ) : (
            <EyeIcon color={colors["gray"][600]} size={24} />
          )}
        </OrgIconButton>
      }
      {...rest}
    />
  )
}

export default PasswordInput
