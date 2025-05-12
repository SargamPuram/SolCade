import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { ArcadeGame } from "../target/types/arcade_game";
import { PublicKey, SystemProgram } from "@solana/web3.js";
import { expect } from "chai";

describe("arcade_game", () => {
  // Set provider
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);

  // Get reference to the program
  const program = anchor.workspace.ArcadeGame as Program<ArcadeGame>;

  let potPda: PublicKey;
  let player: anchor.web3.Keypair;
  let initialLamports: number;
  const gameId = "flappy_bird";
  const potNumber = new anchor.BN(1);
  const entryFee = 50000000; // 0.05 SOL (in lamports)

  before(async () => {
    // Derive PDA using same seeds as contract
    [potPda] = await PublicKey.findProgramAddressSync(
      [
        Buffer.from("pot"),
        Buffer.from(gameId),
        potNumber.toArrayLike(Buffer, "le", 8),
      ],
      program.programId
    );

    // Create a player (signer)
    player = anchor.web3.Keypair.generate();

    // Airdrop SOL to player
    await provider.connection.confirmTransaction(
      await provider.connection.requestAirdrop(player.publicKey, entryFee * 2)
    );

    // Verify initial lamports balance for the player
    initialLamports = await provider.connection.getBalance(player.publicKey);
  });

  it("Initializes a game pot", async () => {
    // Call initialize_pot
    await program.methods
      .initializePot(gameId, potNumber)
      .accounts({
        potAccount: potPda,
        signer: provider.wallet.publicKey,
        systemProgram: SystemProgram.programId,
      })
      .rpc();

    // Fetch the account back
    const potAccount = await program.account.gamePot.fetch(potPda);

    // Assertions
    expect(potAccount.gameId).to.equal(gameId);
    expect(potAccount.potNumber.toNumber()).to.equal(1);
    expect(potAccount.totalLamports.toNumber()).to.equal(0);
    expect(Object.keys(potAccount.status)[0]).to.equal("active");
  });

  it("Allows a player to pay entry fee", async () => {
    // Call pay_entry_fee
    await program.methods
      .payEntryFee(new anchor.BN(entryFee))
      .accounts({
        potAccount: potPda,
        player: player.publicKey,
        systemProgram: SystemProgram.programId,
      })
      .signers([player])
      .rpc();

    // Fetch the pot account
    const potAccount = await program.account.gamePot.fetch(potPda);

    // Check if pot balance is updated
    expect(potAccount.totalLamports.toNumber()).to.equal(entryFee);

    // Check if player's balance is reduced
    const playerBalance = await provider.connection.getBalance(player.publicKey);
    expect(playerBalance).to.equal(initialLamports - entryFee);
  });

  it("Can check pot status and balance", async () => {
    const pot = await program.account.gamePot.fetch(potPda);
    console.log("🪙 Pot balance (lamports):", pot.totalLamports.toNumber());
    console.log("📦 Pot status:", Object.keys(pot.status)[0]);
  
    expect(pot.totalLamports.toNumber()).to.equal(entryFee);
  });
});
