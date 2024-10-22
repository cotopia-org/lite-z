import { FetchPaginatedDataType } from "@/services/axios";
import { DateType } from "@/types/date";
import moment from "moment-jalaali";

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

export const getItemsFromPagination = <T>(data?: FetchPaginatedDataType<T>) => {
  if (data === undefined) return [] as T[];

  return data?.items ?? [];
};

export const getJalaliDate = (
  date: DateType,
  format: string = "jYYYY/jMM/jDD"
) => moment(date.jalali, "jYYYY-jMM-jDD").format(format);
