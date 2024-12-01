import User from "@/components/shared/workspaces/tags/user";
import {useApi} from "@/hooks/swr";
import axiosInstance, {FetchDataType} from "@/services/axios";
import {WorkspaceType} from "@/types/workspace";
import {TagType} from "@/types/tag";
import FullLoading from "@/components/shared/full-loading";
import {toast} from "sonner";
import AddTag from "@/components/shared/workspaces/tags/add-tag";
import TagItem from "@/components/shared/workspaces/tags/tag-item";


export default function Tags({workspace}: { workspace: WorkspaceType }) {


    const {data, isLoading, mutate} =
        useApi<FetchDataType<TagType[]>>(`/workspaces/` + workspace.id + '/tags');


    const handleCreate = async (title: string) => {

        await axiosInstance({
            url: '/tags/',
            method: 'POST',
            data: {
                title: title,
                workspace_id: workspace.id
            },
        })
        toast.success(title + ' Tag has been created!')
        await mutate()


    }

    const handleUpdate = async (title: string, tag: TagType) => {

        await axiosInstance({
            url: '/tags/' + tag.id,
            method: 'PUT',
            data: {
                title: title,
            },
        })
        toast.success(tag.title + ' Tag has been updated!')
        await mutate()


    }

    const handleRemoveTag = async (tag_id: number) => {
        await axiosInstance({
            url: '/tags/' + tag_id,
            method: 'DELETE'
        })
        toast.success('Tag has been deleted!')
        await mutate()
    }

    return <div className={'flex flex-col gap-y-2'}>

        {isLoading && <FullLoading/>}

        {!isLoading && data?.data.map(tag => {
            return <TagItem tag={tag} removeTag={handleRemoveTag} handleUpdate={handleUpdate}/>
        })}


        <AddTag handleCreate={handleCreate}/>


    </div>
}