import CotopiaButton from '@/components/shared-ui/c-button';
import { useTalk } from '..';
import axiosInstance from '@/services/axios';
import { useLoading } from '@/hooks';

type Props = {};

export default function Accept() {
  const { talk } = useTalk();

  const { startLoading, stopLoading, isLoading } = useLoading();

  const handleAccept = () => {
    startLoading();
    axiosInstance
      .post(`/talks/${talk.id}/respond`, {
        response: 'accepted',
      })
      .then((res) => {
        stopLoading();
      })
      .catch((err) => {
        stopLoading();
      });
  };

  return (
    <CotopiaButton
      onClick={handleAccept}
      className="bg-primary"
      loading={isLoading}
    >
      Accept
    </CotopiaButton>
  );
}
