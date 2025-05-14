//@ts-nocheck
import { useWallet } from "@solana/wallet-adapter-react";
import {
  Connection,
  PublicKey,
  Transaction,
  SystemProgram,
} from "@solana/web3.js";
//@ts-ignore
import * as anchor from "@coral-xyz/anchor";
import { useCallback } from "react";
import { ROOT_URL } from "@/lib/imports";
const PROGRAM_ID = new PublicKey("uqF9WXM1GkHE2nKFAPUVX1BSiWys59yzuWZW9GR9Fky");

type PayEntryFeeProps = {
  gameId: string;
  potPublicKey: string;
  amount: number; // in lamports
};

export function usePayEntryFee() {
  const { publicKey, signTransaction, sendTransaction } = useWallet();
  const connection = new Connection(
    "https://api.devnet.solana.com",
    "confirmed"
  );

  const payEntryFee = useCallback(
    async ({ gameId, potPublicKey, amount }: PayEntryFeeProps) => {
      if (!publicKey || !signTransaction || !sendTransaction) {
        throw new Error("Wallet not connected");
      }

      // Step 1: Get the pot address and create an unsigned transaction
      const response = await fetch(
        `${ROOT_URL}/pot/create-entry-fee-transaction`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            gameId,
            potPublicKey,
            amount,
            playerPublicKey: publicKey.toString(),
          }),
        }
      );

      const { serializedTransaction, potAddress } = await response.json();

      if (!serializedTransaction) {
        throw new Error("Failed to create transaction");
      }

      // Step 2: Deserialize, sign, and send the transaction
      const transaction = Transaction.from(
        Buffer.from(serializedTransaction, "base64")
      );

      // Make sure the transaction is recent
      const { blockhash } = await connection.getLatestBlockhash();
      transaction.recentBlockhash = blockhash;
      transaction.feePayer = publicKey;

      const signedTx = await signTransaction(transaction);

      // Step 3: Send to blockchain
      const signature = await connection.sendRawTransaction(
        signedTx.serialize()
      );

      console.log("Transaction sent:", signature);

      // Step 4: Wait for confirmation
      const confirmation = await connection.confirmTransaction(
        signature,
        "confirmed"
      );

      if (confirmation.value.err) {
        throw new Error(
          `Transaction failed: ${confirmation.value.err.toString()}`
        );
      }

      console.log("Transaction confirmed!");

      // Step 5: Verify payment with backend
      const verifyResponse = await fetch(`${ROOT_URL}/pot/verify-payment`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          gameId,
          potPublicKey,
          signature,
          playerPublicKey: publicKey.toString(),
        }),
      });

      const result = await verifyResponse.json();

      if (!result.success) {
        throw new Error("Payment verification failed");
      }

      return {
        signature,
        potAddress,
        verified: true,
        ...result,
      };
    },
    [publicKey, signTransaction, sendTransaction, connection]
  );

  return { payEntryFee };
}