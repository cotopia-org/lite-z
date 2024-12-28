import { WorkspaceRoomShortType } from "@/types/room";
import { WorkspaceUserType } from "@/types/user";
import RoomTypesTabs from "./room-types-tabs";
import CTabs from "@/components/shared-ui/c-tabs";
import { roomSeparatorByType } from "@/lib/utils";
import WorkspaceRoom from "./room";
import { LayoutGrid } from "lucide-react";
import { useRoomContext } from "../../room/room-context";
import RoomsHolder from "./rooms-holder";

type Props = {
  rooms: WorkspaceRoomShortType[];
  workspace_id: number;
  selected_room_id?: number;
  workspaceUsers: WorkspaceUserType[];
};

export default function WorkspaceRooms({
  workspace_id,
  rooms,
  selected_room_id,
  workspaceUsers,
}: Props) {
  // const { room } = useRoomContext();

  // let default_value = "flow";
  // if (room?.type === "grid") {
  //   default_value = "grid";
  // }

  if (rooms.length === 0) return null;

  // const { flowRooms, gridRooms } = roomSeparatorByType(rooms);

  let rooms_view = (
    <>
      {rooms.map((room) => {
        return (
          <WorkspaceRoom
            selected_room_id={selected_room_id}
            key={room.id}
            workspace_id={workspace_id}
            room={room}
            participants={workspaceUsers.filter(
              (x) => x.room_id === room.id && x.status === "online",
            )}
          />
        );
      })}
    </>
  );
  //
  // if (gridRooms.length > 0) {
  //   rooms_view = (
  //     <RoomTypesTabs>
  //       <RoomsHolder title="Canvas Room">
  //         {flowRooms.map((room) => {
  //           return (
  //             <WorkspaceRoom
  //               selected_room_id={selected_room_id}
  //               key={room.id}
  //               workspace_id={workspace_id}
  //               room={room}
  //               participants={workspaceUsers.filter(
  //                 (x) => x.room_id === room.id && x.status === "online"
  //               )}
  //             />
  //           )
  //         })}
  //       </RoomsHolder>
  //       <hr className="my-4" />
  //       <RoomsHolder title="Grid Room">
  //         {gridRooms.map((room) => {
  //           return (
  //             <WorkspaceRoom
  //               selected_room_id={selected_room_id}
  //               key={room.id}
  //               workspace_id={workspace_id}
  //               room={room}
  //               participants={workspaceUsers.filter(
  //                 (x) => x.room_id === room.id && x.status === "online"
  //               )}
  //             />
  //           )
  //         })}
  //       </RoomsHolder>
  //     </RoomTypesTabs>
  //   )
  // }

  return (
    <div className="flex flex-col justify-start gap-y-1 w-full">
      {rooms_view}
    </div>
  );
}
