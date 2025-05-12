import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Wallet, Loader2 } from "lucide-react";
import { usePayEntryFee } from "@/hooks/use-payEntryFee";
import { toast } from "sonner"; // Assuming you have a toast library, if not you can remove this

function EntryFeeButton() {
  const [isProcessing, setIsProcessing] = useState(false);
  const { payEntryFee } = usePayEntryFee();
  const handlePayment = async () => {
    if (isProcessing) return;

    setIsProcessing(true);
    try {
      const result = await payEntryFee({
        gameId: "68210f89681811dd521231f4",
        potNumber: 4,
        amount: 10000000, // 0.1 SOL in lamports
      });

      console.log("Payment successful:", result);
      // If you have toast notifications
      toast.success("Payment successful!");
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
            Pay & Play (0.1 SOL)
          </>
        )}
      </Button>
    </div>
  );
}

export default EntryFeeButton;
