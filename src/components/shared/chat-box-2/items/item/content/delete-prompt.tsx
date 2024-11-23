import { useChatItem } from "..";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import CotopiaPromptContent from "@/components/shared-ui/c-prompt/content";

export default function DeletePrompt() {
  const { isShowDeletePrompt, showDeletePrompt } = useChatItem();

  return (
    <>
      <Dialog open={isShowDeletePrompt} onOpenChange={showDeletePrompt}>
        <DialogContent>
          <CotopiaPromptContent
            title='Do you want to delete this message?'
            onSubmit={() => {}}
            onClose={() => {
              showDeletePrompt(false);
            }}
          />
        </DialogContent>
      </Dialog>
    </>
  );
}
