import { MessageType } from "./message";
import { UserMinimalType } from "./user";

export type Chat2ItemType = MessageType & {
  is_delivered: boolean;
  is_rejected: boolean;
  is_pending: boolean;
};

export type ChatType = {
  id: number;
  last_message: MessageType;
  mentioned_messages: number;
  participants: UserMinimalType[];
  pinned_messages: MessageType[];
  title: string;
  unseens: number;
  muted: boolean;
  workspace_id: string;
};
