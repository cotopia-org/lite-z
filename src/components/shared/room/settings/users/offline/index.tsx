import TitleEl from "@/components/shared/title-el";
import { useState } from "react";
import { useRoomContext } from "../../../room-context";
import moment from "moment";
import * as emoji from "node-emoji";
import User from "./user";
import CotopiaButton from "@/components/shared-ui/c-button";
import { Plus } from "lucide-react";

export default function OfflineUsers() {
  const [isExpand, setIsExpand] = useState(false);

  const { workspaceUsers, leaderboard, room_id } = useRoomContext();

  const onlines = leaderboard
    ?.filter((x) => x.user.status === "online" && x.user.room_id !== null)
    .map((x) => x.user.id);

  const allOfflineParticipants = workspaceUsers
    .filter((x) => !onlines.includes(x.id))
    .filter((x) => x.last_login !== null)
    .sort((a, b) => moment(b.last_login).unix() - moment(a.last_login).unix());

  let finalShowParticipants = [...allOfflineParticipants];

  if (isExpand === false)
    finalShowParticipants = finalShowParticipants.slice(0, 6);

  return (
    <TitleEl
      title={`Offline (${allOfflineParticipants.length}) ${emoji.get("zzz")}`}
    >
      <div className='flex flex-col items-start gap-y-3 mb-6'>
        {finalShowParticipants.map((item) => (
          <User user={item} key={item.id} />
        ))}
      </div>
      <CotopiaButton
        variant={"outline"}
        onClick={() => setIsExpand((prev) => !prev)}
        startIcon={<Plus size={16} />}
      >
        {isExpand ? "Show less" : "Show more"}
      </CotopiaButton>
    </TitleEl>
  );
}
