import {
  BronzeMedalIcon,
  GoldMedalIcon,
  SilverMedalIcon,
} from "@/components/icons"

type Props = {
  rank: number
}
export default function Rank({ rank }: Props) {
  let clss =
    "rounded-full w-6 h-6 flex items-center bg-transparent justify-center text-xs text-grayscale-subtitle font-medium"

  let view = <div className={clss}>{rank}</div>

  if (rank === 1) {
    view = <GoldMedalIcon size={24} />
  } else if (rank === 2) {
    view = <SilverMedalIcon size={24} />
  } else if (rank === 3) {
    view = <BronzeMedalIcon size={24} />
  }
  return view
}
