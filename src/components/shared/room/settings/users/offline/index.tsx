import TitleEl from "@/components/shared/title-el";
import { useState } from "react";
import { useRoomContext } from "../../../room-context";
import moment from "moment";
import * as emoji from "node-emoji";
import User from "./user";
import CotopiaButton from "@/components/shared-ui/c-button";
import { Plus } from "lucide-react";
import {UserType, WorkspaceUserType} from "@/types/user";

type Props = {
  allOfflineParticipants: WorkspaceUserType[];
};
export default function OfflineUsers({allOfflineParticipants}:Props) {
  const [isExpand, setIsExpand] = useState(false);



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
