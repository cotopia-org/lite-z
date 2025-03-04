import { UserType } from './user';

export type LeaderboardType = {
  idle_minutes: number;
  sum_minutes: number;
  user: UserType;
  working_minutes: number;
};
export type CommitmentLeaderboardType = {
  percentage: number;
  min_commitment_percent: number;
  done: number;
  user: UserType;
};
