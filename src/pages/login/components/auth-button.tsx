import OrgButton, { OrgButtonProps } from "@/components/shared-ui/o-button"

const AuthButton = ({
  onSubmit,
  ...rest
}: OrgButtonProps & { onSubmit?: () => void }) => {
  return (
    <OrgButton onClick={onSubmit} className="min-h-[56px] text-lg" {...rest} />
  )
}

export default AuthButton
