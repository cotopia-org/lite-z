import { UserMinimalType } from "./user";

export type JobStatusType = "in_progress" | "paused" | "completed" | "started";

export type JobType = {
  created_at: string;
  description: string;
  estimate: number;
  id: number;
  status: JobStatusType;
  title: string;
  updated_at: string;
  workspace_id: number;
  members: UserMinimalType[];
  total_hours: number;
  parent?: JobType;
  job_id: number;
  level: number;
};
