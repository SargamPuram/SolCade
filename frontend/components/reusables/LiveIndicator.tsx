import { ROOT_URL } from "@/lib/imports";
import { ROOT_DIR_ALIAS } from "next/dist/lib/constants";
import React, { useEffect, useState } from "react";

function LiveIndicator() {
  const [timeLeft, setTimeLeft] = useState(5 * 60); // Default fallback time
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Function to fetch time remaining from the server
    const fetchTimeRemaining = async () => {
      try {
        const response = await fetch(`${ROOT_URL}/api/next-cron-time`);
        if (!response.ok) {
          throw new Error("Failed to fetch next cron time");
        }

        const data = await response.json();
        // Convert from milliseconds to seconds
        const secondsRemaining = Math.floor(data.timeRemaining / 1000);
        setTimeLeft(secondsRemaining);
        setIsLoading(false);
      } catch (err) {
        console.error("Error fetching cron time:", err);
        // Keep using the default time if fetch fails
        setIsLoading(false);
      }
    };

    // Initial fetch
    fetchTimeRemaining();

    // Update the countdown every second
    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        // When we reach 0, try to refresh from the server
        if (prev <= 1) {
          fetchTimeRemaining();
        }
        return prev > 0 ? prev - 1 : 0;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const formatTime = (seconds: number) => {
    const mins = String(Math.floor(seconds / 60)).padStart(2, "0");
    const secs = String(seconds % 60).padStart(2, "0");
    return `${mins}:${secs}`;
  };

  // Determine color based on time remaining
  const getColorClass = () => {
    if (timeLeft < 60) return "text-red-500"; // Less than 1 minute
    if (timeLeft < 180) return "text-yellow-400"; // Less than 3 minutes
    return "text-green-400"; // Default
  };

  // Determine pulse color based on time remaining
  const getPulseColorClass = () => {
    if (timeLeft < 60) return "bg-red-500";
    if (timeLeft < 180) return "bg-yellow-400";
    return "bg-green-500";
  };

  // Determine animation speed based on time remaining
  const getAnimationClass = () => {
    if (timeLeft < 60) return "animate-ping-fast";
    return "animate-ping";
  };

  return (
    <div className="flex items-center space-x-2 mb-4 justify-end">
      <div className="relative w-3 h-3 flex justify-center items-center">
        <span
          className={`absolute inline-flex h-full w-full rounded-full ${getPulseColorClass()} opacity-75 ${getAnimationClass()}`}
        ></span>
        <span
          className={`relative inline-flex rounded-full h-2 w-2 ${getPulseColorClass()}`}
        ></span>
      </div>
      <span className={`text-xs ${getColorClass()} font-mono`}>
        {isLoading
          ? "Loading..."
          : `Final results for this pot in ${formatTime(timeLeft)}`}
      </span>
    </div>
  );
}

export default LiveIndicator;
