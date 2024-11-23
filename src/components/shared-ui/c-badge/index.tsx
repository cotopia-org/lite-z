import { useEffect, useState } from "react";

export type CBadgeProps = {
  count?: number;
  size?: "small" | "normal" | "large";
  showAnimate?: boolean;
  className?: string;
  postfix?: string;
  prefix?: string;
  hideCount?: boolean;
};

let timeout: any = undefined;

export default function CBadge({
  count,
  showAnimate = true,
  size = "small",
  className,
  postfix,
  prefix,
  hideCount,
}: CBadgeProps) {
  const [hasAnimate, setHasAnimate] = useState(false);

  useEffect(() => {
    function giveAnimate() {
      setHasAnimate(true);

      timeout = setTimeout(() => {
        setHasAnimate(false);
      }, 1000);
    }

    if (showAnimate) {
      giveAnimate();
    }

    return () => {
      clearTimeout(timeout);
    };
  }, [count, showAnimate]);

  let clss = className ?? "";

  switch (size) {
    case "small":
      clss += ` w-[16px] h-[16px]`;
      break;
    case "normal":
      clss += ` w-[24px] h-[24px]`;
      break;
    case "large":
      clss += ` w-[32px] h-[32px]`;
      break;
  }

  if (count !== undefined && count <= 0) return null;

  return (
    <div
      className={`rounded-full bg-destructive text-white flex items-center justify-center ${
        hasAnimate ? "animate-scale-custom" : ""
      } ${clss}`}
    >
      {!!prefix && prefix}
      {!!!hideCount && count}
      {!!postfix && postfix}
    </div>
  );
}
