import * as anchor from "@coral-xyz/anchor";
import { Connection, PublicKey, Keypair } from "@solana/web3.js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

// Get directory name for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Setup Solana connection on devnet
export const connection = new Connection(
  "https://api.devnet.solana.com",
  "confirmed"
);

// Load wallet from your local keypair
let keypair: Keypair;
try {
  const walletPath = path.join(__dirname, "..", "..", "server-wallet.json");
  const walletKey = JSON.parse(fs.readFileSync(walletPath, "utf-8"));
  keypair = Keypair.fromSecretKey(new Uint8Array(walletKey));
} catch (err) {
  console.error("Error loading wallet:", err);
  process.exit(1);
}

export const wallet = new anchor.Wallet(keypair);

export const provider = new anchor.AnchorProvider(connection, wallet, {
  commitment: "confirmed",
});

// Use the IDL from your pasted content
const idlPath = path.join(__dirname, "..", "..", "arcade_game.json");
const idl = JSON.parse(fs.readFileSync(idlPath, "utf-8"));

// Program ID from your deployed contract
export const programId = new PublicKey(
  "CZaMq67eAriU6qcvPEaxojMgjFnbfZxGUwaGCfVgioET"
);

// Initialize the program
export const program = new anchor.Program(idl, provider);

export { keypair };
