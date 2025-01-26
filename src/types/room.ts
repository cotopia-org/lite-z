import { AttachmentFileType } from './file';
import { RoomJoinType } from './room-join';
import { UserMinimalType } from './user';

export type RoomViewType = 'grid' | 'flow';

export type WorkspaceRoomType = {
  active: 1 | 0;
  created_at: null | string;
  id: number;
  is_private: 0 | 1;
  landing_spot: null | string;
  password: null | string;
  is_megaphone?: boolean | null;
  status: null | string;
  title: string;
  updated_at: null | string;
  type: RoomViewType;
  user_id: number;
  workspace_id: number;
  participants: UserMinimalType[];
  background: string;
  unseens: number;
};

export type WorkspaceRoomShortType = {
  background: AttachmentFileType;
  id: number;
  landing_spot?: any;
  token?: string;
  workspace_id?: number;
  is_private: 0 | 1;
  logo: null | AttachmentFileType;
  title: string;
  unseens: number;
  participants: UserMinimalType[];
  type?: RoomViewType;
};

export type WorkspaceRoomJoinType = RoomJoinType & {
  participants: UserMinimalType[];
};
