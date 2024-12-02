import { Progress } from "@/components/ui/progress";
import { useEffect, useState } from "react";

export default function Loading() {
  const [progress, setProgress] = useState<number>(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        const nextValue = prev + Math.random() * 10;
        return nextValue >= 100 ? 100 : nextValue;
      });
    }, 5); // Update every 500ms

    return () => clearInterval(interval);
  }, []);

  return <Progress value={progress} className='h-1 rounded-none' />;
}
