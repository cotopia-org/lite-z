import { getTimeFormat } from "@/lib/utils";
import { useEffect, useState } from "react";

const useTimer = (timeout: number) => {
  let timeouter: NodeJS.Timeout;

  const [localTimeout, setLocalTimeout] = useState(0); // in second
  const [isDisabled, setDisabled] = useState(false);
  // function for reset the counter
  const resetTimer = () => {
    clearInterval(timeouter);
    setLocalTimeout(timeout / 1000);
    setDisabled(false);
  };
  // function for stop the counter
  const stopTimer = () => {
    resetTimer();
    setDisabled(true);
  };
  // function for start the counter
  const startTimer = () => {
    stopTimer();
    timeouter = setInterval(() => {
      setLocalTimeout((val) => {
        if (val > 0) {
          return val - 1;
        } else {
          resetTimer();
          return 0;
        }
      });
    }, 1000);
  };
  const time = getTimeFormat(localTimeout);

  useEffect(() => {
    return () => {
      resetTimer();
    };
  }, []);

  return {
    resetTimer,
    stopTimer,
    startTimer,
    seconds: localTimeout,
    time,
    isDisabled,
  };
};
export default useTimer;
