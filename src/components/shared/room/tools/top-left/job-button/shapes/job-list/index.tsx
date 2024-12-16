import { useRoomContext } from "@/components/shared/room/room-context";
import { useApi } from "@/hooks/swr";
import JobItem from "./job-item";
import FullLoading from "@/components/shared/full-loading";
import AddJobHandler from "../add-job";
import { urlWithQueryParams } from "@/lib/utils";
import { FetchDataType } from "@/services/axios";
import JobItems from "@/components/shared/job-items";

interface Props {}

const JobList = (props: Props) => {
  return "Jobs";
};

export default JobList;
