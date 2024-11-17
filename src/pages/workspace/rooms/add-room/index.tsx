import { DialogDescription, DialogTitle } from "@/components/ui/dialog";
import AddRoomForm from "./form";
import { WorkspaceRoomShortType } from "@/types/room";

type Props = {
  workspace_id: string;
  onAdd: (room: WorkspaceRoomShortType) => void;
};
export default function AddRoom({ workspace_id, onAdd }: Props) {
  return (
    <>
      <DialogTitle>{`Adding room to workspace`}</DialogTitle>
      <DialogDescription>{`You are going to create room in your workspace`}</DialogDescription>
      <AddRoomForm
        workspace_id={workspace_id}
        onSubmit={close}
        onCreated={onAdd}
      />
    </>
  );
}
