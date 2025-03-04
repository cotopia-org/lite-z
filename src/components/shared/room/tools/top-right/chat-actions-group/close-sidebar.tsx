import { ArrowRightIcon } from "@/components/icons"
import CotopiaIconButton from "@/components/shared-ui/c-icon-button"
import useKeyPress from "@/hooks/use-key-press"

type Props = {
  onClick: () => void
}
export default function CloseSidebar({ onClick }: Props) {
  useKeyPress("Escape", onClick)

  return (
    <CotopiaIconButton className="text-black" onClick={onClick}>
      <ArrowRightIcon size={20} />
    </CotopiaIconButton>
  )
}
