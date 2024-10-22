import { ReactNode } from "react";
import { Button, ButtonProps } from "../ui/button";
import { Loader } from "lucide-react";

interface Props {
  loading?: boolean;
  disabled?: boolean;
  startIcon?: ReactNode;
  className?: string;
  endIcon?: ReactNode;
}

export type OrgButtonProps = ButtonProps & Props;

const OrgButton = ({
  children,
  loading,
  startIcon,
  disabled,
  className = "",
  endIcon,
  ...rest
}: OrgButtonProps) => {
  let clss = "gap-x-2 px-2 w-full rounded-xl font-medium ";

  const isDisabled = disabled ?? loading ?? false;

  let buttonNode = (
    <>
      {startIcon && startIcon}
      {children}
      {endIcon && endIcon}
    </>
  );

  if (loading) {
    buttonNode = <Loader size={16} className='animate-spin' />;
  }

  return (
    <Button {...rest} className={`${clss} ${className}`} disabled={isDisabled}>
      {buttonNode}
    </Button>
  );
};

export default OrgButton;
