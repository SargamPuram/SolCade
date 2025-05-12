export default function ModeToggle({
  mode,
  setMode,
  className,
}: {
  mode: "Fun" | "Bet";
  setMode: (mode: "Fun" | "Bet") => void;
  className?: string;
}) {
  return (
    <div
      className={`flex items-center justify-center p-1 bg-gray-800 rounded-full w-[180px] shadow-inner border border-gray-700 ${className}`}
    >
      {["Fun", "Bet"].map((option) => (
        <button
          key={option}
          onClick={() => {
            setMode(option as "Fun" | "Bet");
            console.log(option);
          }}
          className={`flex-1 py-1 text-sm font-medium rounded-full transition-all duration-200 ${
            mode === option
              ? "bg-gradient-to-r from-cyan-500 to-green-500 text-black shadow-md"
              : "text-gray-400 hover:text-white"
          }`}
        >
          {option}
        </button>
      ))}
    </div>
  );
}
