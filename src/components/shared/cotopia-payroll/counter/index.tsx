import { useState, useEffect } from "react";

function MonthCountdown() {
    const [timeLeft, setTimeLeft] = useState<{
        days: number;
        hours: number;
        minutes: number;
        seconds: number;
    }>({
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0,
    });

    const calculateTimeLeft = () => {
        const now = new Date();
        const lastDayOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);
        let timeDiff = lastDayOfMonth.getTime() - now.getTime();

        if (timeDiff <= 0) {
            const nextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1, 0, 0, 0);
            timeDiff = nextMonth.getTime() - now.getTime();
        }

        const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((timeDiff % (1000 * 60)) / 1000);

        return { days, hours, minutes, seconds };
    };

    useEffect(() => {
        const updateCountdown = () => {
            setTimeLeft(calculateTimeLeft());
        };

        updateCountdown();
        const intervalId = setInterval(updateCountdown, 1000);

        return () => clearInterval(intervalId);
    }, []);

    return (
        <div className="w-full my-4 flex items-center justify-between px-2">
            <h3 className="text-xl font-semibold">Time Remaining</h3>
            {timeLeft.days > 0 || timeLeft.hours > 0 || timeLeft.minutes > 0 || timeLeft.seconds > 0 ? (
                <div className="flex items-center gap-4 text-gray-800">
                    {/* Days */}
                    <div className="flex flex-col items-center">
                        <span className="text-2xl font-bold">{timeLeft.days}</span>
                        <span className="text-sm font-medium">Days</span>
                    </div>

                    <span className="text-2xl font-bold">:</span>

                    {/* Hours */}
                    <div className="flex flex-col items-center">
                        <span className="text-2xl font-bold">
                            {timeLeft.hours.toString().padStart(2, "0")}
                        </span>
                        <span className="text-sm font-medium">Hours</span>
                    </div>

                    <span className="text-2xl font-bold">:</span>

                    {/* Minutes */}
                    <div className="flex flex-col items-center">
                        <span className="text-2xl font-bold">
                            {timeLeft.minutes.toString().padStart(2, "0")}
                        </span>
                        <span className="text-sm font-medium">Minutes</span>
                    </div>

                    <span className="text-2xl font-bold">:</span>

                    {/* Seconds */}
                    <div className="flex flex-col items-center">
                        <span className="text-2xl font-bold">
                            {timeLeft.seconds.toString().padStart(2, "0")}
                        </span>
                        <span className="text-sm font-medium">Seconds</span>
                    </div>
                </div>
            ) : <p className="text-sm font-medium">The month has ended. Wishing you all the best for the upcoming month!</p>}
        </div>
    );
}

export default MonthCountdown;
