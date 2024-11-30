import {useState} from "react";
import {FullModalBox} from "@/components/shared/modal-box";
import CotopiaButton from "@/components/shared-ui/c-button";
import {Plus} from "lucide-react";
import TitleEl from "@/components/shared/title-el";
import CotopiaInput from "@/components/shared-ui/c-input";
import {TagType} from "@/types/tag";
import CotopiaIconButton from "@/components/shared-ui/c-icon-button";
import {EditIcon, TrashIcon} from "@/components/icons";
import {colors} from "@/const/varz";

export default function EditTag({handleUpdate, tag}: {
    handleUpdate: (title: string, tag: TagType) => void,
    tag: TagType
}) {


    const [title, setTitle] = useState(tag.title);

    return <FullModalBox
        title="Update Tag"
        trigger={(open) => (
            <CotopiaIconButton
                className="hover:text-black w-5 h-5"
                onClick={open}
            >
                <EditIcon color={colors.warning.default} size={16}/>

            </CotopiaIconButton>
        )}
        className="w-[464px] [&_.dialog-title]:text-lg [&_.dialog-header]:pb-4 [&_.dialog-header]:border-b"
    >
        {(open, close) => {
            return (
                <form onSubmit={async (e) => {
                    e.preventDefault();
                    await handleUpdate(title, tag)
                    close()
                }} className="flex flex-col gap-y-5 px-4">
                    <TitleEl title="Title">
                        <CotopiaInput
                            value={title}
                            onChange={e => {
                                setTitle(e.target.value);
                            }}
                            placeholder="Enter Tag Title"
                        />
                    </TitleEl>
                    <div className="flex flex-row justify-between w-full gap-x-8">

                        <div className="flex items-center w-full justify-end gap-x-2">
                            <CotopiaButton
                                variant={"outline"}
                                className="min-w-[80px]"
                                onClick={() => {
                                    close()
                                }}
                            >
                                Close
                            </CotopiaButton>
                            <CotopiaButton
                                type="submit"
                                className="min-w-[138px]"
                                startIcon={<Plus size={16}/>}
                                loading={false}
                                disabled={false}
                            >
                                Update
                            </CotopiaButton>
                        </div>
                    </div>

                </form>

            )
        }}
    </FullModalBox>
}
