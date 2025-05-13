import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Wallet, Loader2 } from "lucide-react";
import { usePayEntryFee } from "@/hooks/use-payEntryFee";
import { toast } from "sonner"; 

function EntryFeeButton({
  gameId,
  potPublicKey,
  checkUserPlayedGame,
}: {
  gameId: string;
  potPublicKey: string;
  checkUserPlayedGame: () => void;
}) {
  const [isProcessing, setIsProcessing] = useState(false);
  const { payEntryFee } = usePayEntryFee();
  const handlePayment = async () => {
    if (isProcessing) return;

    setIsProcessing(true);
    try {
      await payEntryFee({
        gameId,
        potPublicKey,
        amount: 10000000, // 0.01 SOL in lamports
      });

      // If you have toast notifications
      toast.success("Payment successful!");
      checkUserPlayedGame();
      // Add any success handling here
    } catch (error) {
      console.error("Payment failed:", error);
      // If you have toast notifications
      toast.error(
        `Payment failed: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
      // Add any error handling here
    } finally {
      setIsProcessing(false); // Reset the button state whether successful or not
    }
  };

  return (
    <div className="mt-3">
      <Button
        onClick={handlePayment}
        className="w-full h-8 text-xs bg-green-500 hover:bg-green-400 shadow-[0_0_8px_rgba(0,255,136,0.3)] hover:shadow-[0_0_12px_rgba(0,255,136,0.5)] transition-all duration-300"
        disabled={isProcessing}
      >
        {isProcessing ? (
          <>
            <Loader2 className="mr-1 h-3 w-3 animate-spin" />
            Waiting for signature...
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
