import { IconPropsType, defaultColor } from "."

function LockIcon({ size = 24, color = defaultColor }: IconPropsType) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M38 22H10C7.79086 22 6 23.7909 6 26V40C6 42.2091 7.79086 44 10 44H38C40.2091 44 42 42.2091 42 40V26C42 23.7909 40.2091 22 38 22Z"
        stroke={color}
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M14 22V14C14 11.3478 15.0536 8.8043 16.9289 6.92893C18.8043 5.05357 21.3478 4 24 4C26.6522 4 29.1957 5.05357 31.0711 6.92893C32.9464 8.8043 34 11.3478 34 14V22"
        stroke={color}
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export default LockIcon
