import { useEffect } from "react";
export type DisconnectLayoutProps = {
  onReTry?: () => void;
};

//@ts-ignore
export default function DisconnectedInvisible({
  onReTry,
}: DisconnectLayoutProps) {
  const onReloadHandler = async () => {
    if (onReTry) onReTry();
  };

  useEffect(() => {
    const timeout = setInterval(() => {
      onReloadHandler();
    }, 2000);

    return () => {
      clearTimeout(timeout);
    };
  }, []);

  return null;
}
