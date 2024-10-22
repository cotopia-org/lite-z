import React from "react";
import { Fragment, useContext, useMemo } from "react";
import { CalendarContext } from "../calendar";
import { CalendarHolderContext } from "../calendar-holder";
import moment from "moment-jalaali";

const jDaysOrder = [6, 0, 1, 2, 3, 4, 5];

export default function JalaliDaysGap() {
  const { viewDate } = useContext(CalendarContext);
  const { index } = useContext(CalendarHolderContext);

  let finalDate = viewDate?.clone();

  if (index > 0) finalDate = finalDate?.clone()?.add(index, "month");

  const firstDayOfJalaliMonth = moment(finalDate).startOf("jMonth").day();

  const getTargetIndex = useMemo(() => {
    return jDaysOrder.indexOf(firstDayOfJalaliMonth);
  }, [firstDayOfJalaliMonth]);

  return (
    <Fragment>
      {[...Array.from(Array(getTargetIndex))].map((item) => (
        <div key={item} className='col-span-1'></div>
      ))}
    </Fragment>
  );
}
