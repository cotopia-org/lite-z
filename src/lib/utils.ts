import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
const querystring = require("querystring")

export const getQueryParams = (obj: object) => querystring.stringify(obj)

export function urlWithQueryParams(url: string, object: any) {
  if (typeof object !== "object") return ""

  if (!url) return ""

  const params = getQueryParams(object)
  const hasParams = Object.keys(params).length > 0

  return `${url}${hasParams ? `?${params}` : ``}`
}

export const getTimeFormat = (
  seconds: number,
  hasHours: boolean = false
): string => {
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  const remainingSeconds = seconds % 60

  const formattedHours = hours.toString().padStart(2, "0")
  const formattedMinutes = minutes.toString().padStart(2, "0")
  const formattedSeconds = remainingSeconds.toString().padStart(2, "0")

  if (hasHours)
    return `${formattedHours}:${formattedMinutes}:${formattedSeconds}`

  return `${formattedMinutes}:${formattedSeconds}`
}

export function persianToEnglishNumbers(inputStr: string): string {
  const persianNumbers = ["۰", "۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹"]
  const englishNumbers = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"]

  const translationMap: { [key: string]: string } = {}
  persianNumbers.forEach((persian, index) => {
    translationMap[persian] = englishNumbers[index]
  })

  return inputStr.replace(/[۰-۹]/g, (match) => translationMap[match])
}
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
