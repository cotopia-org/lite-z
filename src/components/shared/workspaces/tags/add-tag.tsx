import {useState} from "react";
import {FullModalBox} from "@/components/shared/modal-box";
import CotopiaButton from "@/components/shared-ui/c-button";
import {Plus} from "lucide-react";
import TitleEl from "@/components/shared/title-el";
import CotopiaInput from "@/components/shared-ui/c-input";

export default function AddTag({handleCreate}: { handleCreate: (title: string) => void }) {


    const [title, setTitle] = useState("");

    return <FullModalBox
        title="Add Tag"
        trigger={(open) => (
            <CotopiaButton
                className="min-w-[100px] !bg-primary"
                startIcon={<Plus size={16}/>}
                onClick={open}
            >
                Add Tag
            </CotopiaButton>
        )}
        className="w-[464px] [&_.dialog-title]:text-lg [&_.dialog-header]:pb-4 [&_.dialog-header]:border-b"
    >
        {(open, close) => {
            return (
                <form onSubmit={async (e) => {
                    e.preventDefault();
                    await handleCreate(title)
                    close()
                }} className="flex flex-col gap-y-5 px-4">
                    <TitleEl title="Title">
                        <CotopiaInput
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
                                Create
                            </CotopiaButton>
                        </div>
                    </div>

                </form>

            )
        }}
    </FullModalBox>
}
