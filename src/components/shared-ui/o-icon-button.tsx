import OrgButton, { OrgButtonProps } from "./o-button"

const OrgIconButton = ({ children, className, ...rest }: OrgButtonProps) => {
  let clss = ` flex flex-col !p-0 items-center justify-center bg-transparent rounded-full hover:bg-gray-100 text-black w-8 h-8`

  return (
    <OrgButton
      variant={"default"}
      className={`${clss} ${className}`}
      size={"icon"}
      {...rest}
    >
      {children}
    </OrgButton>
  )
}

export default OrgIconButton
