import StatusBox from "@/components/shared/status-box";
import {cn, getTimeFormat} from "@/lib/utils";
import {JobType} from "@/types/job";

type Props = {
    job: JobType;
};
export default function JobTag({job}: Props) {


    return (
        <div className={'flex flex-row gap-x-2 border rounded-full items-center p-2'}>
            <strong className={'text-xs'}>Tags</strong>
            {job.tags.map(tag => {
                return <StatusBox
                    label={
                        <div className='flex flex-row items-center gap-x-1'>

                            <span>{tag.title}</span>
                        </div>
                    }
                    variant='default'
                />
            })}

        </div>
    );
}
