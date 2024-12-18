import CotopiaIconButton from "@/components/shared-ui/c-icon-button";
import CotopiaTooltip from "@/components/shared-ui/c-tooltip";
import { ButtonProps } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ReactNode } from "react";

type Props = {
  tooltipTitle: string;
  loading: boolean;
  children: ReactNode;
  className?: string;
} & ButtonProps;

const StreamButton = ({
  onClick,
  tooltipTitle,
  loading,
  children,
  className = "",
  ...rest
}: Props) => {
  return (
    <CotopiaTooltip title={tooltipTitle}>
      <CotopiaIconButton
        disabled={loading}
        className={cn("text-black !rounded-lg", className)}
        onClick={onClick}
        {...rest}
      >
        {children}
      </CotopiaIconButton>
    </CotopiaTooltip>
  );
};

export default StreamButton;
