import { IconPropsType, defaultColor } from "."

function MobileIcon({ size = 24, color = defaultColor }: IconPropsType) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M34 4H14C11.7909 4 10 5.79086 10 8V40C10 42.2091 11.7909 44 14 44H34C36.2091 44 38 42.2091 38 40V8C38 5.79086 36.2091 4 34 4Z"
        stroke={color}
        strokeOpacity="0.87"
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M24 36H24.02"
        stroke={color}
        strokeOpacity="0.87"
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export default MobileIcon
