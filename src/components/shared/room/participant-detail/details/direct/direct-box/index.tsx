import CotopiaButton from "@/components/shared-ui/c-button";
import CotopiaTextarea from "@/components/shared-ui/c-textarea";
import { ArrowRight } from "lucide-react";

export default function DirectBox() {
  return (
    <div className='w-[300px] max-w-full flex flex-col gap-y-4'>
      <CotopiaTextarea placeholder='Send something ...' />
      <CotopiaButton endIcon={<ArrowRight />}>Send</CotopiaButton>
    </div>
  );
}
