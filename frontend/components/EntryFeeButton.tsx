import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Wallet, Loader2 } from "lucide-react";
import { usePayEntryFee } from "@/hooks/use-payEntryFee";
import { toast } from "sonner";

function EntryFeeButton({
  gameId,
  potPublicKey,
  mode,
  checkUserPlayedGame,
}: {
  gameId: string;
  potPublicKey: string;
  checkUserPlayedGame: () => void;
  mode: string;
}) {
  const [isProcessing, setIsProcessing] = useState(false);
  const { payEntryFee } = usePayEntryFee();

  const handlePayment = async () => {
    if (isProcessing || mode === "Fun") return;

    setIsProcessing(true);
    try {
      await payEntryFee({
        gameId,
        potPublicKey,
        amount: 10000000, // 0.01 SOL in lamports
      });

      toast.success("Payment successful!");
      checkUserPlayedGame();
    } catch (error) {
      console.error("Payment failed:", error);
      toast.error(
        `Payment failed: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    } finally {
      setIsProcessing(false);
    }
  };

  const isDisabled = isProcessing || mode === "Fun";

  return (
    <div className="mt-3">
      <Button
        onClick={handlePayment}
        className="w-full h-8 text-xs bg-green-500 hover:bg-green-400 shadow-[0_0_8px_rgba(0,255,136,0.3)] hover:shadow-[0_0_12px_rgba(0,255,136,0.5)] transition-all duration-300"
        disabled={isDisabled}
      >
        {isProcessing ? (
          <>
            <Loader2 className="mr-1 h-3 w-3 animate-spin" />
            Waiting for signature...
          </>
        ) : mode === "Fun" ? (
          <>
            <Wallet className="mr-1 h-3 w-3" />
            Only available in Bet mode
          </>
        ) : (
          <>
            <Wallet className="mr-1 h-3 w-3" />
            Pay & Play (0.01 SOL)
          </>
        )}
      </Button>
    </div>
  );
}

export default EntryFeeButton;
