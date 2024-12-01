import ParticipantsWithPopover from "@/components/shared/participants/with-popover";
import {UserMinimalType, WorkspaceUserType} from "@/types/user";
import moment from "moment";
import CotopiaIconButton from "@/components/shared-ui/c-icon-button";
import {EditIcon, TickCircleIcon, TrashIcon} from "@/components/icons";
import {colors} from "@/const/varz";
import {TagType} from "@/types/tag";
import User from "@/components/shared/workspaces/tags/user";
import axiosInstance from "@/services/axios";
import {toast} from "sonner";
import {useState} from "react";
import {Plus, X} from "lucide-react";
import UserSelector from "@/components/shared/user-selector";
import {boolean} from "yup";
import EditTag from "@/components/shared/workspaces/tags/edit-tag";

type Props = {
    tag: TagType,
    removeTag: (tag_id: number) => void,
    handleUpdate: (title: string, tag: TagType) => void,
};
export default function TagItem({tag, removeTag, handleUpdate}: Props) {


    const [tagItem, setTagItem] = useState<TagType>(tag);
    const [userAdd, setUserAdd] = useState(false);

    const handleRemove = async (tag: TagType, user: UserMinimalType) => {

        const data = await axiosInstance({
            url: '/tags/' + tag.id + '/removeMember',
            method: 'POST',
            data: {
                user_id: user.id
            },
        })
        setTagItem(data.data.data)
        toast.success(user.username + ' has been removed from ' + tag.title)


    }

    const handeAddUser = async (user: UserMinimalType) => {
        const data = await axiosInstance({
            url: '/tags/' + tag.id + '/addMember',
            method: 'POST',
            data: {
                user_id: user.id
            },
        })
        setTagItem(data.data.data)
        toast.success(user.username + ' has been added to ' + tag.title)
        setUserAdd(false)

    }

    return (
        <div
            className='flex flex-col gap-y-4 items-start w-full py-4 px-6 border border-grayscale-border rounded-2xl shadow-app-bar'>
            <div className='flex w-full justify-between flex-row items-center gap-x-2'>
        <span className='text-lg text-grayscale-paragraph whitespace-nowrap truncate'>
          {tag.title}
        </span>
                <div className='flex flex-row gap-x-3 items-center'>
                    {/*<JobActions*/}
                    {/*    job={item}*/}
                    {/*    onPause={mutate}*/}
                    {/*    onStart={mutate}*/}
                    {/*    onDelete={mutate}*/}
                    {/*    onDone={mutate}*/}
                    {/*/>*/}
                    {/*<EditJobButton job={item} fetchAgain={mutate}/>*/}


                    <CotopiaIconButton
                        onClick={() => {
                            setUserAdd(!userAdd)
                        }}
                        disabled={false}
                        className="hover:text-black w-5 h-5"
                    >
                        {userAdd ? <X color={colors.error.default} size={16}/> :
                            <Plus color={colors.success.default} size={16}/>}
                    </CotopiaIconButton>


                    <CotopiaIconButton
                        onClick={() => {
                            removeTag(tag.id)
                        }}
                        disabled={false}
                        className="hover:text-black w-5 h-5"
                    >
                        <TrashIcon color={colors.error.default} size={16}/>
                    </CotopiaIconButton>


                    <EditTag handleUpdate={handleUpdate} tag={tag}/>


                </div>
            </div>

            <div>
                {
                    userAdd && <UserSelector onPick={async (user) => {
                        await handeAddUser(user)

                    }}/>
                }
            </div>
            <div className='flex flex-wrap w-full items-center gap-4'>


                {tagItem.members.length > 0 ? tagItem.members.map(item => {
                    return <User user={item} tag={tag} handleRemove={handleRemove}/>

                }) : <span className={'text-sm'}>No users on this tag</span>}

            </div>
        </div>
    );
}
