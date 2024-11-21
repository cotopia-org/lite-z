import CotopiaInput from "@/components/shared-ui/c-input";
import PayrollWrapper from "../payroll-wrapper";
import CotopiaTextarea from "@/components/shared-ui/c-textarea";
import CotopiaButton from "@/components/shared-ui/c-button";
import { toast } from "sonner";
import { FormEvent } from "react";

export default function PayrollReports() {

    function handleSubmit(e: FormEvent) {
        e.preventDefault();
        toast.success("Thanks for your submit!")
    }

    return (
        <PayrollWrapper>
            <div className="w-full flex items-center justify-center flex-col gap-y-5">

                <h1 className="text-xl font-semibold">Send you're report</h1>


                <form className="flex flex-col items-center w-full gap-y-8" onSubmit={handleSubmit}>
                    <div className="w-4/5">
                        <CotopiaInput
                            placeholder='Title'
                            label="Your Issue"
                            className="py-7"
                        />
                    </div>

                    <div className="w-4/5">
                        <CotopiaTextarea
                            placeholder="Eg: updating profile doesn't work properly ..."
                            label='Your description'
                            rows={10}
                        />
                    </div>

                    <CotopiaButton
                        type='submit'
                        className='w-4/5 py-6'
                    >
                        Submit
                    </CotopiaButton>
                </form>


            </div>
        </PayrollWrapper>
    )
}