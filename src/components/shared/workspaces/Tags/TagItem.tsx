import ParticipantsWithPopover from "@/components/shared/participants/with-popover";
import {UserMinimalType, WorkspaceUserType} from "@/types/user";
import moment from "moment";
import CotopiaIconButton from "@/components/shared-ui/c-icon-button";
import {TickCircleIcon, TrashIcon} from "@/components/icons";
import {colors} from "@/const/varz";
import {TagType} from "@/types/tag";
import User from "@/components/shared/workspaces/Tags/user";
import axiosInstance from "@/services/axios";
import {toast} from "sonner";
import {useState} from "react";
import {Plus} from "lucide-react";
import UserSelector from "@/components/shared/user-selector";

type Props = {
    tag: TagType
};
export default function TagItem({tag}: Props) {


    const [tagItem, setTagItem] = useState<TagType>(tag);

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

    return (
        <div
            className='flex flex-col gap-y-4 items-start w-full py-4 px-6 border border-grayscale-border rounded-2xl shadow-app-bar'>
            <div className='flex w-full justify-between flex-row items-center gap-x-2'>
        <span className='text-lg text-grayscale-paragraph whitespace-nowrap truncate'>
          {tagItem.title}
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
                            console.log('here')
                        }}
                        disabled={false}
                        className="hover:text-black w-5 h-5"
                    >
                        <Plus color={colors.success.default} size={16}/>
                    </CotopiaIconButton>



                    <UserSelector/>


                </div>
            </div>

            <div className='flex flex-wrap w-full items-center gap-2'>

                {tagItem.members.map(item => {
                    return <User user={item} tag={tag} handleRemove={handleRemove}/>

                })}

            </div>
        </div>
    );
}
