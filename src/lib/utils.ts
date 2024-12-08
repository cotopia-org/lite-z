import { mergePropsMain } from "@/components/shared/room/sessions/room-audio-renderer/use-media-track-by-source-or-name/merge-props";
import { ScheduleType } from "@/types/calendar";
import { UserType } from "@/types/user";
import { TrackReferenceOrPlaceholder } from "@livekit/components-core";
import { clsx, type ClassValue } from "clsx";
import { Track } from "livekit-client";
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
  const formattedSeconds = remainingSeconds
    .toFixed(0)
    .toString()
    .padStart(2, "0");

  if (hasHours) return `${formattedHours}h ${formattedMinutes}m`;

  return `${formattedMinutes}m`;
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

export function rawRouteResolver(...args: string[]) {
  return `${args.join("/")}`;
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

export function convertMinutesToHHMMSS(
  minutes: number,
  short: boolean
): string {
  const hours = Math.floor(minutes / 60);
  const mins = Math.floor(minutes % 60);
  const secs = Math.floor((minutes * 60) % 60);

  const formattedHours = String(hours).padStart(2, "0");
  const formattedMinutes = String(mins).padStart(2, "0");
  const formattedSeconds = String(secs).padStart(2, "0");
  if (short) {
    return `${formattedHours} h`;
  }
  return `${formattedHours}:${formattedMinutes}:${formattedSeconds}`;
}

export const estimateTotalHoursBySchedules = (schedules: ScheduleType[]) => {
  let hours = 0;

  if (schedules.length === 0) return 0;

  for (let schedule of schedules) {
    for (let scheduleDay of schedule.days) {
      for (let time of scheduleDay.times) {
        const startMoment = timeStringToMoment(time.start);
        const endMoment = timeStringToMoment(time.end);

        const diffMinutes = endMoment.diff(startMoment, "minutes");
        const diffHours = Math.round(diffMinutes / 60);

        hours += diffHours;
      }
    }
  }

  return hours;
};

export const limitChar = (inputString: string, maxLength: number) => {
  if (inputString.length > maxLength) {
    return inputString.substring(0, maxLength) + "...";
  }
  return inputString;
};

export const capitalizeWords = (str: string) => {
  return str.replace(/\b\w/g, (char) => char.toUpperCase());
};

export const isScreenShareExist = (tracks: TrackReferenceOrPlaceholder[]) => {
  let hasShareScreen = false;
  let shareScreenTrack = [];

  for (let track of tracks) {
    if (track.source === Track.Source.ScreenShare) {
      hasShareScreen = true;
      shareScreenTrack.push(track);
    }
  }
  return {
    hasShareScreen,
    shareScreenTrack: shareScreenTrack?.[0] || null,
  };
};

export function isProp<
  U extends HTMLElement,
  T extends React.HTMLAttributes<U>
>(prop: T | undefined): prop is T {
  return prop !== undefined;
}

export function mergeProps<
  U extends HTMLElement,
  T extends Array<React.HTMLAttributes<U> | undefined>
>(...props: T) {
  return mergePropsMain(...(props.filter(isProp) as any));
}

export const getMiddleIndex = (length: number) => Math.floor((length - 1) / 2);

export const getFocusedMessage = ({
  message,
  targetIndex,
  changingClass,
  removeTimeout = 1500,
}: {
  message: HTMLDivElement;
  targetIndex: number;
  removeTimeout?: number;
  changingClass: string[];
}): { focusHandler: () => void | undefined } => {
  if (message === undefined || targetIndex < 0)
    return { focusHandler: () => {} };

  const findFocusedMessage = () => {
    const nodes = message.childNodes as NodeListOf<HTMLDivElement>;
    setTimeout(() => {
      for (let item of nodes) {
        const datesetIndex = item.dataset?.index;
        if (datesetIndex === undefined) return;
        if (Number(datesetIndex) === Number(targetIndex)) {
          changingClass.map((clss) => {
            return item.classList.add(clss);
          });
          setTimeout(() => {
            changingClass.map((clss) => {
              return item.classList.remove(clss);
            });
          }, removeTimeout);
        }
      }
    }, 500);
  };

  return { focusHandler: findFocusedMessage };
};

export const getTwelveClockFormat = (time: string) => {
  return moment(time, "HH:mm").format("hh:mmA");
};

export function extractMentions(
  message: string
): { start_position: number; user: string }[] {
  const mentionRegex = /@(\S+)/g; // Fixed when a DOT was in the username.
  const mentions: { start_position: number; user: string }[] = [];
  let match: RegExpExecArray | null;

  while ((match = mentionRegex.exec(message)) !== null) {
    mentions.push({
      start_position: match.index,
      user: match[1], // username without '@'
    });
  }

  return mentions;
}

export function getPositionFromStringCoordinates(coords: string) {
  if (!coords) return null;

  const splittedCoords = coords.split(",");

  if (splittedCoords.length !== 2) return null;

  const x = splittedCoords[0];
  const y = splittedCoords[1];

  if (isNaN(+x) || isNaN(+y)) return null;

  return { x: +x, y: +y };
}

export function isUserAdmin(user: UserType | null, workspace_id?: number) {
  if (workspace_id === undefined) return false;

  if (user === null) return false;

  if (user.workspaces.length === 0) return false;

  const userInTargetWorkspace = user.workspaces.find(
    (x) => x.id === workspace_id
  );

  return userInTargetWorkspace?.role === "super-admin";
}
