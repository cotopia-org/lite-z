import { Chat2ItemType } from "./chat2";
import { AttachmentFileType } from "./file";

export type MessageType = {
  chat_id: number;
  created_at: number;
  deleted_at: string | null;
  files: AttachmentFileType[];
  id: number;
  is_edited: boolean | null;
  is_pinned: 0 | 1;
  links: any[];
  mentions: any[];
  nonce_id: number;
  reply_to: Chat2ItemType;
  reply_id?: number
  seens: number[];
  text: string;
  updated_at: number;
  user: number;
  user_id?: number;
};
