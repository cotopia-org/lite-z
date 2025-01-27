import axiosInstance from '@/services/axios';
import { useAppSelector } from '@/store';

const useSetting = () => {
  const setting = useAppSelector((store) => store.setting);

  const enableAudioSetting = () => {
    return axiosInstance.post('/settings', { key: 'audio', value: 'on' });
  };
  const enableVideoSetting = () => {
    return axiosInstance.post('/settings', { key: 'video', value: 'on' });
  };
  const disableAudioSetting = () => {
    return axiosInstance.post('/settings', { key: 'audio', value: 'off' });
  };
  const disableVideoSetting = () => {
    return axiosInstance.post('/settings', { key: 'video', value: 'off' });
  };

  return {
    reduxSettings: setting,
    enableAudioSetting,
    enableVideoSetting,
    disableVideoSetting,
    disableAudioSetting,
  };
};

export default useSetting;
