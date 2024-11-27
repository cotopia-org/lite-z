import { useRoomContext } from "@/components/shared/room/room-context";
import { useApi } from "@/hooks/swr";
import JobItem from "./job-item";
import FullLoading from "@/components/shared/full-loading";
import AddJobHandler from "../add-job";
import { urlWithQueryParams } from "@/lib/utils";
import { FetchDataType } from "@/services/axios";
import JobItems from "@/components/shared/job-items";
import {JobType} from "@/types/job";
import JobStatus from "@/components/shared/room/tools/top-left/job-button/shapes/job-table/job-item/job-status";
import JobEstimate from "@/components/shared/room/tools/top-left/job-button/shapes/job-table/job-item/estimate";

interface Props {
  items:JobType[],
  loading:boolean,
}

const JobTable = (props: Props) => {


  if (!props.loading && props.items.length === 0)
    return <span className='w-full text-lg text-grayscale-paragraph font-medium text-center py-4'>
        There is no job to show!
      </span>

  if (props.loading) return <FullLoading/>;

  return (
      <div className='w-full max-h-[400px] overflow-auto'>

        <table className="table-auto w-full">
            <thead className={''}>
            <tr>
              <th></th>
              <th></th>
              <th className={'text-sm text-left'}>Time/Estimated</th>
            </tr>
            </thead>
          <tbody>
          {
            props.items.map(job => {
              return <tr>
                <td><JobStatus status={job.status}/></td>
                <td className={'text-sm'}>{job.title.length > 20 ? job.title.slice(0, 20) + '... ':job.title}</td>
                <td className={'text-xs'}>{Math.round(job.total_hours / 60)} hrs / {job.estimate === null ? 0 : job.estimate}</td>
              </tr>
            })
          }


          <tr>
            <td><strong>Total</strong></td>
            <td></td>
            <td><strong>~{Math.round(props.items.reduce((sum, item) => sum + item.total_hours,0) / 60)} hrs / {Math.round(props.items.reduce((sum,item)=>sum + item.estimate,0) )} hrs</strong></td>
          </tr>

          </tbody>
        </table>


        {/*<div className={'flex flex-row items-end  gap-x-4 w-full bg-slate-200 p-2 rounded  sticky bottom-0'}>*/}
        {/*  <strong>Total</strong>*/}
        {/*  <strong></strong>*/}
        {/*  <strong></strong>*/}
        {/*</div>*/}
      </div>
  );
};

export default JobTable;
