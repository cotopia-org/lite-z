import { cn } from "@/lib/utils"

type Props = {
    title: string
    className?: string
}
export default function ParticipantBadge({title, className}: Props) {
  return (
    <div className={cn('flex items-center justify-center p-1 py-[2px] rounded bg-primary-light', className)}>
        <span className='text-xs font-medium text-primary-label capitalize'>
            {title}
        </span>
    </div>
  )
}
