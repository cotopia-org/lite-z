import { UserMinimalType, WorkspaceUserType } from "@/types/user";
import Avatars, { MinimalParticipantType } from "../avatars";
import { ReactNode } from "react";

type ParticipantType = WorkspaceUserType | UserMinimalType;

export type ParticipantsProps = {
  participants: ParticipantType[];
  customTitle?: (user: ParticipantType) => string;
  render?: (item: MinimalParticipantType, content: ReactNode) => ReactNode;
  avatarClss?: string;
  className?: string;
};

export default function Participants({
  participants,
  customTitle,
  render,
  avatarClss,
  className,
}: ParticipantsProps) {
  if (participants.length === 0) return null;

  return (
    <div className={`pb-4 ${className ?? ""}`}>
      <Avatars
        items={participants.map((x) => ({
          id: x?.id,
          src: x?.avatar?.url,
          title: x?.name ?? "",
          date: x?.created_at ?? 0,
          toolTipTitle: customTitle !== undefined ? customTitle(x) : undefined,
          className: avatarClss,
          render,
        }))}
        render={render}
      />
    </div>
  );
}
