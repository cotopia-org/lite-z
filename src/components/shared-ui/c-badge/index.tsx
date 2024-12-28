import { cn, compactNumber } from "@/lib/utils";
import { useEffect, useState } from "react";

export type CBadgeProps = {
  count?: number;
  size?: "small" | "normal" | "large";
  showAnimate?: boolean;
  className?: string;
  postfix?: string;
  prefix?: string;
  hideCount?: boolean;
  type?: "normal" | "important";
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
  type = "important",
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

  if (count && count > 99) clss = cn(clss, "!rounded-lg px-1 !w-auto");

  if (count !== undefined && count <= 0) return null;

  if (type === "normal") {
    clss += ` bg-secondary text-black`;
  } else {
    clss += ` bg-destructive text-white`;
  }

  return (
    <div
      className={`rounded-full  flex items-center justify-center ${
        hasAnimate ? "animate-scale-custom" : ""
      } ${clss}`}
    >
      {!!prefix && prefix}
      {!!!hideCount && compactNumber(count ?? 0)}
      {!!postfix && postfix}
    </div>
  );
}
