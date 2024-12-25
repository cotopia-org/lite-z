import { UserMinimalType } from "./user";
import { TagType } from "@/types/tag";
import { MentionType } from "@/types/mention";
import { AttachmentFileType } from "@/types/file";

export type JobStatusType = "in_progress" | "paused" | "completed" | "started";

export type UserJobType = {
  id: number;
  avatar: AttachmentFileType;
  total_minutes: number;
  role: string;
  created_at: string;
  status: JobStatusType;
  username: string;
};
export type JobType = {
  created_at: string;
  description: string;
  estimate: number;
  id: number;
  status: JobStatusType;
  title: string;
  updated_at: string;
  workspace_id: number;
  members: UserJobType[];
  total_hours: number;
  parent?: JobType;
  job_id: number;
  level: number;
  old: boolean;
  joinable: number;
  role?: string;
  total_minutes?: number;

  mentions: MentionType[];
};
