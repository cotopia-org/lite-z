
interface Props {
    title: string;
    altTitle: string;
}

export default function PayrollUserInformationHeader({ title, altTitle }: Props) {
    return (
        <div>
            <h1 className="text-lg font-semibold">{title}</h1>
            <p className="text-sm font-semibold text-gray-400">{altTitle}</p>
        </div>
    )
}