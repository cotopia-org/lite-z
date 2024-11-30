import ParticipantsWithPopover from "@/components/shared/participants/with-popover";
import {UserMinimalType, WorkspaceUserType} from "@/types/user";
import moment from "moment";
import CotopiaIconButton from "@/components/shared-ui/c-icon-button";
import {TrashIcon} from "@/components/icons";
import {colors} from "@/const/varz";
import {TagType} from "@/types/tag";

type Props = {
    user: UserMinimalType,
    handleRemove: (tag: TagType, user: UserMinimalType) => void,
    tag: TagType
};
export default function User({user, handleRemove, tag}: Props) {

    return (
        <div className='flex flex-row items-center gap-x-2'>
            <ParticipantsWithPopover className='!pb-0' participants={[user]}/>
            <div className={'flex flex-col text-xs'}>
                <span>{user.name}</span>
                <span className='text-xs text-black/70'>
                   <div className='flex flex-row items-center gap-x-1'>
                          <CotopiaIconButton
                              onClick={() => {
                                  handleRemove(tag, user)
                              }}
                              disabled={false}
                              className="hover:text-black w-3 h-3"
                          >
                              <TrashIcon color={colors.error.default} size={10}/>
                            </CotopiaIconButton>
                   </div>
                </span>
            </div>
        </div>
    );
}
