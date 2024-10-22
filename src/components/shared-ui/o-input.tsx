import { ReactNode, useEffect, useRef } from "react";
import { Input, InputProps } from "../ui/input";

interface Props {
  variant?: "text" | "outlined" | "filled" | "text-dasshed";
  beforeNode?: ReactNode;
  afterNode?: ReactNode;
  error?: boolean;
  helperText?: string;
  label?: string;
  onGetCoords?: (coords: any) => void;
}

export type OrgInputProps = InputProps & Props;

const OrgInput = ({
  variant,
  beforeNode,
  error = false,
  helperText,
  afterNode,
  label,
  onGetCoords,
  ...rest
}: OrgInputProps) => {
  const inputRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    if (!inputRef.current) return;

    if (onGetCoords) onGetCoords(inputRef.current?.getBoundingClientRect());
  }, [onGetCoords]);

  useEffect(() => {
    if (inputRef.current === null) return;

    if (rest?.autoFocus !== undefined) inputRef.current.focus();
  }, [rest?.autoFocus]);

  let inputClss = "min-h-[56px] w-full text-base  ";

  let helperTextClss = "text-sm text-black/[0.87] font-medium";

  let defaultClss =
    "flex w-full relative items-center h-full gap-x-2 rounded-xl overflow-hidden ";

  switch (variant) {
    default:
    case "outlined":
      defaultClss +=
        " px-3 border border-primary focus-visible:ring-1 focus-visible:ring-ring [&.error-state]:!border-2 [&.error-state]:!border-red-500";
      break;
    case "text":
      defaultClss +=
        " !rounded-none border-b-2 border-b-primary [&.error-state]:!border-b-red-500";
      break;
    case "text-dasshed":
      defaultClss +=
        " !rounded-none border-b-2 border-dashed border-b-label [&.error-state]:!border-b-red-500";
      break;
    case "filled":
      defaultClss +=
        " px-3 bg-input [&.error-state]:!border-2 [&.error-state]:!border-red-500";
      inputClss += " bg-input";
      break;
  }

  if (beforeNode) {
    defaultClss += " pr-3";
  }
  if (afterNode) {
    defaultClss += " pl-3";
  }

  if (error) {
    helperTextClss += " !text-red-500";
    defaultClss += " error-state";
  }

  let additionalProps = {};

  if (rest?.type === "number")
    additionalProps = {
      onWheel: (e: any) => {
        e.target.blur();
        setTimeout(() => {
          e.target.focus();
        }, 500);
      },
    };

  let inputNode = (
    <div className={defaultClss}>
      {!!beforeNode && <div className='before-node'>{beforeNode}</div>}

      <Input
        ref={inputRef}
        className={inputClss}
        {...rest}
        {...additionalProps}
      />
      {afterNode && <div className='after-node'>{afterNode && afterNode}</div>}
    </div>
  );

  return (
    <div className='flex w-full flex-col items-start gap-y-2'>
      <div className='w-full flex flex-col gap-y-2 items-start'>
        {!!label && <div className='label text-label'>{label}</div>}
        {inputNode}
      </div>
      {helperText && <span className={helperTextClss}>{helperText}</span>}
    </div>
  );
};

export default OrgInput;
