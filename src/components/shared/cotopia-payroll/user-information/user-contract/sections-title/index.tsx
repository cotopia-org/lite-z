interface Props {
    title: string
}

export default function PayrollSectionTitle({ title }: Props) {
    return (
        <div className="relative text-center text-lg font-semibold">
            <span className="absolute left-0 top-1/2 transform -translate-y-1/2 w-2/5 border-t border-gray-100"></span>
            <span className="relative z-10">{title}</span>
            <span className="absolute right-0 top-1/2 transform -translate-y-1/2 w-2/5 border-t border-gray-100"></span>
        </div>
    )
}