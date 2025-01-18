import CotopiaPrompt from '@/components/shared-ui/c-prompt';
import { useLoading } from '@/hooks';
import useAuth from '@/hooks/auth';
import { useSocket } from '@/routes/private-wrarpper';
import axiosInstance from '@/services/axios';
import { TalkType } from '@/types/talk';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

export default function TalkDidntRespondBox() {
  const navigate = useNavigate();

  const { user: profile } = useAuth();

  const { startLoading, stopLoading, isLoading } = useLoading();

  const [talk, setTalk] = useState<TalkType>();

  useSocket(
    'talkExpired',
    (talk: TalkType) => {
      if (profile.id !== talk.user.id) {
        return;
      }

      setTalk(talk);
    },
    [profile],
  );

  const handleUnGhost = () => {
    startLoading();
    axiosInstance
      .get(`/users/unGhost`)
      .then((res) => {
        stopLoading();
        toast.success('You are back again!');
        setTalk(undefined);
      })
      .catch((err) => {
        stopLoading();
      });
  };

  return (
    <CotopiaPrompt
      isPortal
      open={!!talk}
      onSubmit={handleUnGhost}
      loading={isLoading}
      submitText="I’m Back"
      cancelText="Leave workspace"
      onClose={() => {
        navigate(`/workspaces`);
      }}
      title="You didn’t respond!"
      description="You became inactive because you didn’t respond to an invitation. Are you there?"
      dialogContentClassName="!pt-6"
    />
  );
}
