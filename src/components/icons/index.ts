import colors from "tailwindcss/colors"

export { default as MobileIcon } from "./mobile"
export { default as LockIcon } from "./lock"
export { default as WarningIcon } from "./warning"
export { default as UsersIcon } from "./users"
export { default as WalletIcon } from "./wallet"
export { default as ListIcon } from "./list"
export { default as CalendarIcon } from "./calendar"

export type IconPropsType = {
  size?: number
  color?: string
}

export const defaultColor = colors.black
