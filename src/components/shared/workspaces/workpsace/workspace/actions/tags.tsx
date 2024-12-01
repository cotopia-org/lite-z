import {colors} from "@/const/varz"
import {TrashIcon} from "@/components/icons"
import CotopiaButton from "@/components/shared-ui/c-button"
import CDialog from "@/components/shared-ui/c-dialog"
import useLoading from "@/hooks/use-loading"
import {Tag} from "lucide-react";
import Tags from "components/shared/workspaces/tags";
import {WorkspaceType} from "@/types/workspace";


export default function TagsOption({workspace}: { workspace: WorkspaceType }) {
    const {startLoading, stopLoading, isLoading} = useLoading()


    return (
        <CDialog
            trigger={(open) => (
                <CotopiaButton
                    variant={"ghost"}
                    startIcon={<Tag size={20}/>}
                    onClick={open}
                    className="text-sm"
                    disabled={isLoading}
                >
                    Tags
                </CotopiaButton>
            )}
        >
            {(close) => (
                <Tags workspace={workspace}/>
            )}
        </CDialog>
    )
}
