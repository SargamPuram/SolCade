import React, { useEffect, useState } from "react";

function LiveIndicator() {
  const [timeLeft, setTimeLeft] = useState(5 * 60); // e.g., 5 minutes

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const formatTime = (seconds: number) => {
    const mins = String(Math.floor(seconds / 60)).padStart(2, "0");
    const secs = String(seconds % 60).padStart(2, "0");
    return `${mins}:${secs}`;
  };
  return (
    <div className="flex items-center space-x-2 mb-4 justify-end">
      <div className="relative w-3 h-3 flex justify-center items-center">
        <span className="absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75 animate-ping "></span>
        <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
      </div>
      <span className="text-xs text-green-400 font-mono">
        Final results for this pot in {formatTime(timeLeft)}
      </span>
    </div>
  );
}

export default LiveIndicator;
