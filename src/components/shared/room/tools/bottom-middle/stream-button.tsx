import CotopiaIconButton from '@/components/shared-ui/c-icon-button';
import CotopiaTooltip from '@/components/shared-ui/c-tooltip';
import { ButtonProps } from '@/components/ui/button';
import { colors } from '@/const/varz';
import { cn } from '@/lib/utils';
import { ReactNode } from 'react';

type Props = {
  tooltipTitle: string;
  loading?: boolean;
  children: ({
    activeStyle,
    color,
  }: {
    activeStyle: string;
    color: string;
  }) => ReactNode;
  className?: string;
  isActive?: boolean;
} & Omit<ButtonProps, 'children'>;

const StreamButton = ({
  onClick,
  tooltipTitle,
  loading,
  children,
  isActive = false,
  className = '',
  ...rest
}: Props) => {
  let state_color = colors.error.default;

  let state_clss = ' !bg-error-surface-default';

  if (isActive) {
    state_color = colors.success.default;
    state_clss = ' !bg-success-surface-default text-success';
  }

  return (
    <CotopiaTooltip title={tooltipTitle}>
      <CotopiaIconButton
        disabled={loading}
        className={cn('text-black !rounded-lg ', state_clss, className)}
        onClick={onClick}
        {...rest}
      >
        {children({ activeStyle: state_clss, color: state_color })}
      </CotopiaIconButton>
    </CotopiaTooltip>
  );
};

export default StreamButton;
