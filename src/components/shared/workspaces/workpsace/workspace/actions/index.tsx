import CotopiaIconButton from "@/components/shared-ui/c-icon-button";
import {WorkspaceType} from "@/types/workspace";
import {MoreHorizontal} from "lucide-react";
import CotopiaPopover from "@/components/shared-ui/c-popover";
import {colors} from "@/const/varz";
import TagsOption from "./tags";

type Props = {
    item: WorkspaceType;
};
export default function WorkspaceActions({item}: Props) {
    return (

        <CotopiaPopover
            trigger={
                <CotopiaIconButton
                    type='button'
                    className=' w-6 h-6'
                >
                    <MoreHorizontal color={colors.primary.default} size={16}/>
                </CotopiaIconButton>
            }
            contentClassName='w-auto p-1 flex flex-col [&_button]:justify-between'
        >
            <TagsOption workspace={item}/>
        </CotopiaPopover>
    );
}
