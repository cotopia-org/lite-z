import colors from "tailwindcss/colors"

export { default as GridIcon } from "./grid"
export { default as CalendarIcon } from "./calendar"
export { default as BriefcaseIcon } from "./briefcase"
export { default as ClockIcon } from "./clock"
export { default as ProfileAddIcon } from "./profile-add"
export { default as SettingIcon } from "./setting"
export { default as ArrowRightIcon } from "./arrow-right"
export { default as LogoutIcon } from "./logout"
export { default as ArrowLeftIcon } from "./arrow-left"
export { default as SoundIcon } from "./sound"
export { default as Profile2UserIcon } from "./profile-2-user"
export { default as MessagesIcon } from "./messages"
export { default as MoreHorizontalIcon } from "./more-horiz"
export { default as TrashIcon } from "./trash"
export { default as MicrophoneIcon } from "./microphone"
export { default as VideoIcon } from "./video"
export { default as VideoOffIcon } from "./video-off"
export { default as MirrorScreenIcon } from "./mirror-screen"
export { default as PauseCircleIcon } from "./pause-circle"
export { default as TickCircleIcon } from "./tick-circle"
export { default as PlayCircleIcon } from "./play-circle"
export { default as GpsIcon } from "./gps"
export { default as EditIcon } from "./edit"
export { default as TickIcon } from "./tick"
export { default as MicIcon } from "./mic"
export { default as MicOffIcon } from "./mic-off"
export { default as GoldMedalIcon } from "./gold-medal"
export { default as SilverMedalIcon } from "./silver-medal"
export { default as BronzeMedalIcon } from "./bronze-medal"

export const defaultColor = colors.black

export type IconProps = {
  color?: string
  size?: number
}
