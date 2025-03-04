import { Chat2ItemType } from './chat2';
import { AttachmentFileType } from './file';
import { UserMinimalType } from '@/types/user';

export type MessageType = {
  chat_id: number;
  created_at: number;
  deleted_at: string | null;
  files: AttachmentFileType[];
  voice_id?: number;
  voice?: AttachmentFileType;
  id: number;
  is_edited: boolean | null;
  is_pinned: 0 | 1;
  links: any[];
  mentions: any[];
  nonce_id: number;
  reply_to: Chat2ItemType;
  reply_id?: number;
  seens: number[];
  text?: string;
  translated_text?: string | null;
  updated_at: number;
  user: UserMinimalType;
  user_id?: number;
};
