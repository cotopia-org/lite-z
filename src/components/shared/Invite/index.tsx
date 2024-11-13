import useLoading from "@/hooks/use-loading";
import { useRoomContext } from "../room/room-context";
import axiosInstance from "@/services/axios";
import CotopiaPrompt from "@/components/shared-ui/c-prompt";
import UserSelector from "@/components/shared/user-selector";
import { ReactNode, useState } from "react";
import { UserMinimalType } from "@/types/user";
import { toast } from "sonner";
import SelectedUser from "./selected-user";
import { InviteType } from "@/types/invite";
import { CodePicker } from "./code-picker";
import { WorkspaceRoomShortType } from "@/types/room";

type Props = {
  room: WorkspaceRoomShortType;
  render: (open: () => void) => ReactNode;
};

export default function InviteButtonTool({ render, room }: Props) {
  const [selectedUser, setSelectedUser] = useState<UserMinimalType>();

  const { startLoading, stopLoading, isLoading } = useLoading();

  const [invite, setInvite] = useState<InviteType>();

  const handleInviteUser = () => {
    if (room?.id === undefined) return;

    if (selectedUser === undefined) {
      toast.error("Please select at least a user to invite");
      return;
    }

    startLoading();
    axiosInstance
      .post(`/invites`, {
        model: "room",
        model_id: room.id,
        user_id: selectedUser.id,
      })
      .then((res) => {
        setInvite(res.data.data);
        setSelectedUser(undefined);
        stopLoading();
      })
      .catch((res) => {
        stopLoading();
      });
  };

  return (
    <>
      {invite !== undefined && (
        <CodePicker
          code={invite.code}
          onCancel={() => setInvite(undefined)}
          onCopy={() => {}}
        />
      )}
      {invite === undefined && (
        <CotopiaPrompt
          onClose={() => {
            setInvite(undefined);
          }}
          onSubmit={handleInviteUser}
          title='Invite user'
          description=''
          // description='You are inviting user to this room, are you sure?'
          afterDesc={
            <>
              <UserSelector
                defaultSelectedId={selectedUser?.id}
                onPick={setSelectedUser}
                afterTitle={
                  selectedUser !== undefined && (
                    <SelectedUser
                      user={selectedUser}
                      onDelete={() => setSelectedUser(undefined)}
                    />
                  )
                }
              />
            </>
          }
          trigger={render}
        />
      )}
    </>
  );
}
