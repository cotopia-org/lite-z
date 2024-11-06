import React, { ReactNode, forwardRef } from "react";
import { ToggleSource } from "@livekit/components-core";
import { useTrackToggle, UseTrackToggleProps } from "@livekit/components-react";

type Props<T extends ToggleSource> = UseTrackToggleProps<T> & {
  enabledIcon: ReactNode;
  disabledIcon: ReactNode;
};

const ToggleButton = forwardRef<HTMLButtonElement, Props<any>>(
  ({ enabledIcon, disabledIcon, ...props }, ref) => {
    const { buttonProps, enabled } = useTrackToggle(props);

    return (
      <button
        ref={ref}
        {...buttonProps}
        className={`toggle-button w-8 h-8 flex ${
          enabled ? "enabled" : "disabled"
        }`}
      >
        {enabled ? enabledIcon : disabledIcon}
      </button>
    );
  }
);

ToggleButton.displayName = "ToggleButton";

export default ToggleButton;
