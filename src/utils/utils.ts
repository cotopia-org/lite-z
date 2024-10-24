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
