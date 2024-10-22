import OrgButton, { OrgButtonProps } from "../shared-ui/o-button"
import { buttonVariants } from "../ui/button"

const LinkButton = ({ className, ...rest }: OrgButtonProps) => {
  let clss = `bg-transparent w-auto text-base border-b rounded-none no-underline font-medium hover:no-underline border-b-primary text-primary hover:bg-transparent p-[2px] leading-4 h-auto ${className}`

  return (
    <OrgButton
      className={buttonVariants({
        variant: "link",
        className: clss,
      })}
      type="button"
      {...rest}
    >
      {rest.children}
    </OrgButton>
  )
}

export default LinkButton
