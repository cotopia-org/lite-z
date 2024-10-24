import { useAppSelector } from "@/store";

const useSetting = () => {
  const setting = useAppSelector((store) => store.setting);

  return setting;
};

export default useSetting;
