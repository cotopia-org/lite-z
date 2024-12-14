import CotopiaDropdown from "@/components/shared-ui/c-dropdown"

type Props = {
    onChange: (value: string) => void
}
export default function PaymentTab({onChange}: Props) {
  return (
    <CotopiaDropdown label="Payment Status" items={[{title: 'All', value: 'all'}, {title: 'OnGoing', value: 'ongoing'}, {title: 'Paid', value: 'paid'}, {title: 'Should Pay', value: 'pending'}]} onSelect={(item) => onChange(item.value)} />
  )
}
