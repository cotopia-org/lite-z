import useAuth from '@/hooks/auth';
import { Chat2ItemType } from '@/types/chat2';
import { Check, CheckCheck, Clock } from 'lucide-react';

type Props = {
  chat: Chat2ItemType;
};

export default function MessageDeliveredState({ chat }: Props) {
  const { user } = useAuth();

  let content = chat.is_pending ? <Clock size={16} /> : <Check size={16} />;

  const seenWitoutMe = chat?.seens?.filter((a) => a !== user.id) ?? [];

  if (seenWitoutMe?.length > 0) content = <CheckCheck size={16} />;

  if (user.id !== chat.user.id) return null;

  return <div>{content}</div>;
}
