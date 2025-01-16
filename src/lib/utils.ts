import { mergePropsMain } from '@/components/shared/canvas-board/canvas-audio-rendrer/use-media-track-by-source-or-name/merge-props';
import { ScheduleType } from '@/types/calendar';
import { UserContractType } from '@/types/contract';
import { WorkspaceRoomShortType } from '@/types/room';
import { MeType, UserType, WorkspaceUserType } from '@/types/user';
import { TrackReferenceOrPlaceholder } from '@livekit/components-core';
import { type ClassValue, clsx } from 'clsx';
import { Track } from 'livekit-client';
import moment from 'moment';
import momentTZ from 'moment-timezone';
import { twMerge } from 'tailwind-merge';

const querystring = require('querystring');

export const getQueryParams = (obj: object) => querystring.stringify(obj);

export function urlWithQueryParams(url: string, object: any) {
  if (typeof object !== 'object') return '';

  if (!url) return '';

  const params = getQueryParams(object);
  const hasParams = Object.keys(params).length > 0;

  return `${url}${hasParams ? `?${params}` : ``}`;
}

export const getTimeFormat = (
  seconds: number,
  hasHours: boolean = false,
): string => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = seconds % 60;

  const formattedHours = hours.toString().padStart(2, '0');
  const formattedMinutes = minutes.toString().padStart(2, '0');
  const formattedSeconds = remainingSeconds
    .toFixed(0)
    .toString()
    .padStart(2, '0');

  if (hasHours) return `${formattedHours}h ${formattedMinutes}m`;

  return `${formattedMinutes}m`;
};

export function persianToEnglishNumbers(inputStr: string): string {
  const persianNumbers = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
  const englishNumbers = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];

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
  return `/${args.join('/')}`;
}

export function rawRouteResolver(...args: string[]) {
  return `${args.join('/')}`;
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
    0: 'Sunday',
    1: 'Monday',
    2: 'Tuesday',
    3: 'Wednesday',
    4: 'Thursday',
    5: 'Friday',
    6: 'Saturday',
  };
  return days[index];
}

export const timeStringToMoment = (time: string) => {
  const timesArray = time.split(':');

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
  short: boolean,
): string {
  const hours = Math.floor(minutes / 60);
  const mins = Math.floor(minutes % 60);
  const secs = Math.floor((minutes * 60) % 60);

  const formattedHours = String(hours).padStart(2, '0');
  const formattedMinutes = String(mins).padStart(2, '0');
  const formattedSeconds = String(secs).padStart(2, '0');
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

        const diffMinutes = endMoment.diff(startMoment, 'minutes');
        const diffHours = Math.round(diffMinutes / 60);

        hours += diffHours;
      }
    }
  }

  return hours;
};

export const limitChar = (inputString: string, maxLength: number) => {
  if (inputString.length > maxLength) {
    return inputString.substring(0, maxLength) + '...';
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
  T extends React.HTMLAttributes<U>,
>(prop: T | undefined): prop is T {
  return prop !== undefined;
}

export function mergeProps<
  U extends HTMLElement,
  T extends Array<React.HTMLAttributes<U> | undefined>,
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
    return {
      focusHandler: () => {},
    };

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
  return moment(time, 'HH:mm').format('hh:mmA');
};

export function extractMentions(
  message: string,
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

  const splittedCoords = coords.split(',');

  if (splittedCoords.length !== 2) return null;

  const x = splittedCoords[0];
  const y = splittedCoords[1];

  if (isNaN(+x) || isNaN(+y)) return null;

  return { x: +x, y: +y };
}

export function compactNumber(value: number, decimals: number = 1): string {
  if (value === null || value === undefined || isNaN(value)) {
    throw new Error('Invalid number input');
  }

  const suffixes = ['', 'K', 'M', 'B', 'T', 'P'];
  const factor = 1000;

  let index = 0;

  while (Math.abs(value) >= factor && index < suffixes.length - 1) {
    value /= factor;
    index++;
  }

  return `${value.toFixed(decimals).replace(/\.0+$/, '')}${suffixes[index]}`;
}

export function isUserAdmin(
  user: UserType | WorkspaceUserType | null | MeType,
  workspace_id?: number,
) {
  if (workspace_id === undefined) return false;

  if (user === null) return false;

  if (user?.workspaces?.length === 0) return false;

  const userInTargetWorkspace = user?.workspaces?.find(
    (x) => x.id === workspace_id,
  );

  return (
    userInTargetWorkspace?.role === 'super-admin' ||
    userInTargetWorkspace?.role === 'owner'
  );
}

export function formatTime(
  totalMinutes: number,
  hour: boolean = false,
  min: boolean = false,
  short: boolean = false,
): string {
  const hours = Math.floor(totalMinutes / 60);
  const wholeMinutes = Math.floor(totalMinutes % 60); // Extract whole minutes
  const seconds = Math.round((totalMinutes % 1) * 60); // Convert fractional part to seconds

  // Adjust minutes if rounding seconds overflows
  let adjustedMinutes = wholeMinutes;
  let adjustedHours = hours;
  let adjustedSeconds = seconds;

  if (seconds === 60) {
    adjustedSeconds = 0;
    adjustedMinutes += 1;
  }

  if (adjustedMinutes === 60) {
    adjustedMinutes = 0;
    adjustedHours += 1;
  }

  if (short) {
    return `${String(adjustedHours).padStart(2, '0')}:${String(adjustedMinutes).padStart(2, '0')}`;
  }
  let string = '';
  if (hour && adjustedHours !== 0) {
    string += String(adjustedHours).padStart(2, '0') + ' hrs';
  }

  if (adjustedHours !== 0 && adjustedMinutes !== 0 && min) {
    string += ' and ';
  }

  if (min) {
    string += String(adjustedMinutes).padStart(2, '0') + ' mins';
  }

  if (!hour && !min) {
    return `${String(adjustedHours).padStart(2, '0')}:${String(adjustedMinutes).padStart(2, '0')}:${String(adjustedSeconds).padStart(2, '0')}`;
  }

  return string;
}

export function getContractStatus(contract: UserContractType) {
  if (contract.user_sign_status === 1 && contract.contractor_sign_status === 1)
    return 'Signed';

  if (contract.user_sign_status === 0) return 'Awaiting user signing';

  if (contract.contractor_sign_status === 0) return 'Awaiting admin signing';

  return 'UnSigned';
}

export const roomSeparatorByType = (rooms: WorkspaceRoomShortType[]) => {
  let flowRooms: WorkspaceRoomShortType[] = [];
  let gridRooms: WorkspaceRoomShortType[] = [];

  for (let room of rooms) {
    if (room?.type === 'flow') {
      flowRooms.push(room);
    } else {
      gridRooms.push(room);
    }
  }

  return { flowRooms, gridRooms };
};

export function getDateTime(
  date: string,
  format: string = 'YYYY/MM/DD HH:mm:ss',
) {
  return moment(date).format(format);
}

export const convertToTimezone = (time: string, timezoneFrom: string) => {
  const sourceTime = momentTZ.tz(time, 'HH:mm', timezoneFrom);
  const currentTimezone = momentTZ.tz.guess();

  const targetTime = sourceTime.clone().tz(currentTimezone);

  return targetTime.format('HH:mm');
};

export function isNowBetween(start: string, end: string, timezone: string) {
  const now = new Date();
  // now.setHours(18, 0, 0, 0);
  const [startHour, startMinute] = convertToTimezone(start, timezone)
    .split(':')
    .map(Number);
  const [endHour, endMinute] = convertToTimezone(end, timezone)
    .split(':')
    .map(Number);

  const startTime = new Date(now);
  startTime.setHours(startHour, startMinute, 0, 0);

  const endTime = new Date(now);
  endTime.setHours(endHour, endMinute, 0, 0);

  if (endTime < startTime) {
    endTime.setDate(endTime.getDate() + 1);
  }

  return now >= startTime && now <= endTime;
}

export const getNodePositionFromCenter = (
  center: { x: number; y: number },
  nodePosition: { x: number; y: number },
) => {
  const rectCenterX = center.x;
  const rectCenterY = center.y;

  const dx = nodePosition.x - rectCenterX;
  const dy = rectCenterY - nodePosition.y;

  const angleInRadians = Math.atan2(dy, dx);
  let angleInDegrees = (angleInRadians * 180) / Math.PI;

  let angleDegrees = angleInRadians * (180 / Math.PI);

  if (angleDegrees < 0) {
    angleDegrees += 360;
  }

  return { degree: angleInDegrees };
};

// export function getRandomColor(timestamp: any, darkness = 0.9) {
//   if (timestamp === undefined) return "#2091ff";
//   // Convert timestamp to a number (if it's a string).
//   const numericValue = Number(timestamp);
//
//   // Use a hashing function.
//   let hash = 0;
//   const timestampString = numericValue.toString();
//   for (let i = 0; i < timestampString.length; i++) {
//     hash = timestampString.charCodeAt(i) + ((hash << 5) - hash);
//   }
//
//   hash = Math.abs(hash);
//
//   let red = hash % 256;
//   let green = (hash * 3) % 256;
//   let blue = (hash * 7) % 256;
//
//   // Apply darkness factor
//   red = Math.floor(red * darkness);
//   green = Math.floor(green * darkness);
//   blue = Math.floor(blue * darkness);
//
//   return `#${(red | (1 << 8)).toString(16).slice(1)}${(green | (1 << 8)).toString(16).slice(1)}${(blue | (1 << 8)).toString(16).slice(1)}`;
// }

export function getRandomColor(timestamp: any, darkness = 0.9) {
  const normalizedTimestamp = (timestamp % 1000) / 1000;
  const colors = [
    '#D45246', // Original Red
    '#F68136', // Original Orange
    '#6C61DF', // Original Violet
    '#46BA43', // Original Green
    '#359AD4', // Original Cyan
    '#408ACF', // Original Blue
    '#D95574', // Original Pink
  ];

  const colorInterval = 10; // Adjust this value to control color change frequency

  const intervalIndex = Math.floor(timestamp / colorInterval);
  return colors[intervalIndex % colors.length];
}

export function calculatePercentage(
  part: number,
  total: number,
  precision?: number,
): number {
  // if (total === 0) {
  //   throw new Error('Total cannot be zero.');
  // }
  const percentage = (part / total) * 100;
  return precision !== undefined
    ? parseFloat(percentage.toFixed(precision))
    : percentage;
}
