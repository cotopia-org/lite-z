import { UserType } from './user';

export type TalkType = {
  created_at: string;
  id: number;
  owner: UserType;
  response: string | null;
  type: string | null;
  user: UserType;
};
