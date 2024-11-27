import { ReactNode } from "react";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuTrigger,
} from "../ui/context-menu";

type ContextMenuProps = {
  trigger: ReactNode;
  triggerClss?: string;
  width?: number;
  className?: string;
  children: ReactNode;
};

const CotopiaContextMenu = ({
  children,
  trigger,
  triggerClss,
  width = 200,
  className,
}: ContextMenuProps) => {
  return (
    <ContextMenu>
      <ContextMenuTrigger className={triggerClss}>{trigger}</ContextMenuTrigger>
      <ContextMenuContent style={{ width }} className={className}>
        {children}
      </ContextMenuContent>
    </ContextMenu>
  );
};

export default CotopiaContextMenu;
