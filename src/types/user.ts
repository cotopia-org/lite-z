import { AttachmentFileType } from "./file";
import { JobType } from "./job";

export type UserType = {
  active: null | 0 | 1;
  avatar: AttachmentFileType | null;
  bio: null | string;
  coordinates: null | string;
  email: string;
  workspaces: {
    id: number;
    role: string;
    title: string;
  }[];
  id: number;
  name: string;
  room_id: null | number;
  workspace_id: null | number;
  screenshare_coordinates: null | string;
  screenshare_size: null | string;
  status: null | string;
  username: string;
  video_coordinates: null | string;
  video_size: null | string;
  video_status: null | string;
  voice_status: null | string;
};

export type UserMinimalTypeScheduleType = {
  hours: string;
  minutes: number;
};

export type UserMinimalType = {
  avatar: null | AttachmentFileType;
  id: number;
  name: string;
  username: string;
  coordinates: string | null;
  video_coordinates: null | string;
  video_size: null | string;
  video_status: null | string;
  voice_status: null | string;
  screenshare_coordinates: null | string;
  screenshare_size: null | string;
  schedule_hours_in_week?: number;
};

export type WorkspaceUserType = {
  active_job: JobType | null;
  avatar: AttachmentFileType;
  coordinates: string;
  id: number;
  last_login: string;
  name: string;
  status: string;
  username: string;
  has_video?: boolean;
  has_screen_share?: boolean;
  has_mic?: boolean;
  verified: boolean;
  room_id: number | null;
  schedule_hours_in_week?: {
    hours: string;
    minutes: number;
  };
};
