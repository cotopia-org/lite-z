import User from "@/components/shared/workspaces/Tags/user";
import {useApi} from "@/hooks/swr";
import axiosInstance, {FetchDataType} from "@/services/axios";
import {WorkspaceType} from "@/types/workspace";
import {TagType} from "@/types/tag";
import FullLoading from "@/components/shared/full-loading";
import {UserMinimalType} from "@/types/user";
import {toast} from "sonner";
import TagItem from "@/components/shared/workspaces/Tags/TagItem";

export default function Tags({workspace}: { workspace: WorkspaceType }) {


    const {data, isLoading} =
        useApi<FetchDataType<TagType[]>>(`/workspaces/` + workspace.id + '/tags');
    const items: TagType[] = !!data ? data?.data : [];



    return <div className={'flex flex-row gap-y-2'}>

        {isLoading && <FullLoading/>}

        {!isLoading && items.map(tag => {
            return <TagItem tag={tag}/>
        })}


    </div>
}