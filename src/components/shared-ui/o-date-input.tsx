import { ReactNode } from "react";
import { Input, InputProps } from "../ui/input";
import Calendar, { CalendarProps } from "../shared/calendar/calendar";
import OPopover from "./o-popover";
import { Calendar as CalendarIcon } from "lucide-react";
import moment from "moment";
import jMoment from "moment-jalaali";

interface Props extends CalendarProps {
  variant?: "text" | "outlined" | "filled" | "text-dasshed";
  beforeNode?: ReactNode;
  afterNode?: ReactNode;
  error?: boolean;
  helperText?: string;
  label?: string;
}

export type OrgDateInputProps = InputProps & Props;

const OrgDateInput = ({
  variant,
  beforeNode,
  error = false,
  helperText,
  afterNode,
  label,
  ...rest
}: OrgDateInputProps) => {
  let inputClss = "min-h-[56px] w-full text-base";

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

  const isJalali = rest?.config?.system === "jalali";

  //@ts-ignore
  let dateToShow: string | undefined = rest?.defaultDate ?? undefined;

  if (dateToShow) {
    if (isJalali) {
      dateToShow = jMoment(dateToShow).format("jYYYY-jMM-jDD");
    } else {
      dateToShow = moment(dateToShow).format("YYYY-MM-DD");
    }
  }

  let inputNode = (
    <div className={defaultClss}>
      {!!beforeNode && <div className='before-node'>{beforeNode}</div>}
      <OPopover
        align='start'
        trigger={
          <div className='flex-1 relative'>
            <Input className={inputClss} value={dateToShow} />
            <CalendarIcon className='absolute top-4 left-2 opacity-[.54]' />
          </div>
        }
      >
        <Calendar {...rest} />
      </OPopover>
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

export default OrgDateInput;
