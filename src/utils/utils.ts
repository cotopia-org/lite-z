import moment from "moment-jalaali";
import dayjs from "dayjs";

export const thunkResHandler = (
  thunkRes: Promise<any>,
  thunkKey: string,
  onSuccess: (res: any) => void,
  onError: (res: any) => void
): void => {
  thunkRes.then((res) => {
    if (res.type === `${thunkKey}/fullfield`) {
      onSuccess(res);
    } else if (res.type === `${thunkKey}/rejected`) {
      onError(res);
    }
  });
};


export function formatChatDate(timestamp: number): string {
  const date = dayjs(timestamp * 1000);
  const today = dayjs();
  const yesterday = today.subtract(1, 'day');
  if (timestamp === undefined || timestamp <= 0) {
  }
  if (date.isSame(today, 'day')) {
    return "Today";
  } else if (date.isSame(yesterday, 'day')) {
    return "Yesterday";
  } else if (date.isSame(today, 'year')) {
    return date.format("dddd, D MMMM")
  }
  else {
    return date.format("dddd, D MMMM, YYYY");
  }
}
