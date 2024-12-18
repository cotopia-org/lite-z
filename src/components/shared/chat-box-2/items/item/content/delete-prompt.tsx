import { useChatItem } from "..";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import CotopiaPromptContent from "@/components/shared-ui/c-prompt/content";
import { useChat2 } from "@/hooks/chat/use-chat-2";
import { Chat2ItemType } from "@/types/chat2";

export default function DeletePrompt({ item }: { item: Chat2ItemType }) {
  const { deleteFn } = useChat2();

  const { isShowDeletePrompt, showDeletePrompt } = useChatItem();

  return (
    <>
      <Dialog open={isShowDeletePrompt} onOpenChange={showDeletePrompt}>
        <DialogContent>
          <CotopiaPromptContent
            title='Do you want to delete this message?'
            onSubmit={() => {
              deleteFn(item);
              showDeletePrompt(false);
            }}
            onClose={() => {
              showDeletePrompt(false);
            }}
          />
        </DialogContent>
      </Dialog>
    </>
  );
}
