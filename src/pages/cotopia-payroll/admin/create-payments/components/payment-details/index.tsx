import CotopiaInput from "@/components/shared-ui/c-input";

interface PaymentDetailsProps {
    formik: any;
    contractAmount: number | null;
    calculatedTotalAmount: number;
}

const PaymentDetails = ({ formik, contractAmount, calculatedTotalAmount }: PaymentDetailsProps) => (
    <>
        <CotopiaInput
            {...formik.getFieldProps("type")}
            placeholder="Enter the type"
            label="Payment type"
            hasError={formik.touched.type && !!formik.errors.type}
            helperText={formik.touched.type && formik.errors.type}
        />

        <CotopiaInput
            value={contractAmount || ""}
            placeholder="Calculated amount"
            label="Amount"
            type="number"
            disabled
        />

        <CotopiaInput
            {...formik.getFieldProps("hours")}
            placeholder="Enter the hours"
            label="Hours"
            type="number"
            hasError={formik.touched.hours && !!formik.errors.hours}
            helperText={formik.touched.hours && formik.errors.hours}
        />

        <CotopiaInput
            value={calculatedTotalAmount || ""}
            placeholder="Total amount"
            label="Total amount"
            type="number"
            disabled
        />

        <CotopiaInput
            {...formik.getFieldProps("bonus")}
            placeholder="Enter the bonus"
            label="Bonus"
            type="number"
            hasError={formik.touched.bonus && !!formik.errors.bonus}
            helperText={formik.touched.bonus && formik.errors.bonus}
        />
    </>
);

export default PaymentDetails;
