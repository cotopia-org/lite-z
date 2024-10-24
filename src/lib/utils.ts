import { clsx, type ClassValue } from "clsx";
import moment from "moment";
import { twMerge } from "tailwind-merge";
const querystring = require("querystring");

export const getQueryParams = (obj: object) => querystring.stringify(obj);

export function urlWithQueryParams(url: string, object: any) {
  if (typeof object !== "object") return "";

  if (!url) return "";

  const params = getQueryParams(object);
  const hasParams = Object.keys(params).length > 0;

  return `${url}${hasParams ? `?${params}` : ``}`;
}

export const getTimeFormat = (
  seconds: number,
  hasHours: boolean = false
): string => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = seconds % 60;

  const formattedHours = hours.toString().padStart(2, "0");
  const formattedMinutes = minutes.toString().padStart(2, "0");
  const formattedSeconds = remainingSeconds.toString().padStart(2, "0");

  if (hasHours)
    return `${formattedHours}:${formattedMinutes}:${formattedSeconds}`;

  return `${formattedMinutes}:${formattedSeconds}`;
};

export function persianToEnglishNumbers(inputStr: string): string {
  const persianNumbers = ["۰", "۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹"];
  const englishNumbers = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];

  const translationMap: { [key: string]: string } = {};
  persianNumbers.forEach((persian, index) => {
    translationMap[persian] = englishNumbers[index];
  });

  return inputStr.replace(/[۰-۹]/g, (match) => translationMap[match]);
}
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function routeResolver(...args: string[]) {
  return `/${args.join("/")}`;
}

type Item = {
  id: string | number;
  [key: string]: any; // Other properties
};

export function uniqueById(items: Item[]): Item[] {
  const uniqueItems = items.reduce((acc, item) => {
    acc.set(item.id, item);
    return acc;
  }, new Map<string | number, Item>());

  return Array.from(uniqueItems.values());
}

export const getUserFullname = (user: any) => {
  let fullName = user?.username;

  if (user?.name) fullName = user?.name;

  return fullName;
};

export function getDay(index: number) {
  const days: { [key: number]: string } = {
    0: "Sunday",
    1: "Monday",
    2: "Tuesday",
    3: "Wednesday",
    4: "Thursday",
    5: "Friday",
    6: "Saturday",
  };
  return days[index];
}

export const timeStringToMoment = (time: string) => {
  const timesArray = time.split(":");

  const hour = timesArray[0];
  const minutues = timesArray[1];

  const momentDate = moment();

  momentDate.set({
    hours: +hour,
    minutes: +minutues,
  });

  return momentDate;
};

export function convertMinutesToHHMMSS(minutes: number): string {
  const hours = Math.floor(minutes / 60);
  const mins = Math.floor(minutes % 60);
  const secs = Math.floor((minutes * 60) % 60);

  const formattedHours = String(hours).padStart(2, "0");
  const formattedMinutes = String(mins).padStart(2, "0");
  const formattedSeconds = String(secs).padStart(2, "0");

  return `${formattedHours}:${formattedMinutes}:${formattedSeconds}`;
}
