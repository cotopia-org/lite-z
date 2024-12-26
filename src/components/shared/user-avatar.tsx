import { ReactNode } from "react";
import CotopiaAvatar from "../shared-ui/c-avatar";
import CotopiaTooltip from "../shared-ui/c-tooltip";

type Props = {
  title: string;
  toolTipTitle?: string;
  src?: string;
  className?: string;
  wrapper?: React.ComponentType<any>;
  date: number;
};

export default function UserAvatar({
  title,
  toolTipTitle,
  src,
  className = "",
  date,
  wrapper: Wrapper, // Rename it for consistency
}: Props) {
  let content = (
    <CotopiaTooltip
      title={toolTipTitle ? toolTipTitle : title}
      triggerClassName="flex"
    >
      <CotopiaAvatar
        date={date}
        className={`min-w-8 min-h-8 ${className}`}
        src={src}
        title={title ? title?.[0] : undefined}
      />
    </CotopiaTooltip>
  );

  return Wrapper ? <Wrapper>{content}</Wrapper> : content;
}
