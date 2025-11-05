# 🚀 Smart Contract Deployment Guide

## What Was Fixed

The `distribute_winners` function was failing with a `PrivilegeEscalation` error because:
- The pot account was trying to transfer funds without proper signing authority
- **Fix**: Added PDA (Program Derived Address) signing using the pot's seeds

## Prerequisites

1. **Solana CLI** installed
2. **Anchor CLI** installed
3. **Rust** installed
4. A wallet with SOL on devnet

## Step 1: Verify Your Wallet

```bash
# Check your Solana configuration
solana config get

# Should show:
# - RPC URL: https://api.devnet.solana.com
# - Keypair Path: ~/.config/solana/id.json (or custom path)

# Check your wallet balance
solana balance

# If you need SOL for devnet:
solana airdrop 2
```

## Step 2: Build the Program

```bash
cd /home/viscanum853/SolCade/contracts

# Build the program
anchor build

# This creates:
# - target/deploy/arcade_game.so (the compiled program)
# - target/idl/arcade_game.json (the interface definition)
```

## Step 3: Get Your Program ID

```bash
# View the program ID from the build
solana address -k target/deploy/arcade_game-keypair.json

# OR if you want to generate a new one:
anchor keys list
```

## Step 4: Update Program ID in Code

**IMPORTANT**: If the program ID changed, update it in:

1. **contracts/arcade_game/programs/arcade_game/src/lib.rs** (line 3):
```rust
declare_id!("YOUR_NEW_PROGRAM_ID_HERE");
```

2. **contracts/Anchor.toml** (line 9):
```toml
[programs.localnet]
arcade_game = "YOUR_NEW_PROGRAM_ID_HERE"
```

3. **backend/src/config/solana.ts** (line 22):
```typescript
export const programId = new PublicKey("YOUR_NEW_PROGRAM_ID_HERE");
```

4. **Re-build after changing program ID**:
```bash
anchor build
```

## Step 5: Deploy to Devnet

```bash
# Deploy the program
anchor deploy --provider.cluster devnet

# You should see:
# Program Id: <YOUR_PROGRAM_ID>
# Successfully deployed!
```

## Step 6: Verify Deployment

```bash
# Check if program is deployed
solana program show YOUR_PROGRAM_ID --url devnet

# Should show program details and size
```

## Step 7: Update Backend IDL

```bash
# Copy the new IDL to backend
cp target/idl/arcade_game.json /home/viscanum853/SolCade/backend/arcade_game.json

# Rebuild backend
cd /home/viscanum853/SolCade/backend
npm run build
```

## Step 8: Restart Your Backend

```bash
# Stop existing server
pm2 stop solcade-backend
# OR
pkill -f "node dist/server.js"

# Start with new program
npm start
# OR if using pm2:
pm2 restart solcade-backend
```

## Troubleshooting

### Error: "Insufficient funds"
```bash
# Get more SOL
solana airdrop 2
```

### Error: "Program account already in use"
You're trying to deploy to an existing address. Either:
1. Use `anchor upgrade` instead of `deploy`
2. OR generate a new program keypair

### Error: "Failed to verify program"
```bash
# Make sure you're on devnet
solana config set --url devnet

# Check your config
solana config get
```

## Quick Commands Reference

```bash
# Build only
anchor build

# Deploy to devnet
anchor deploy --provider.cluster devnet

# Upgrade existing program
anchor upgrade target/deploy/arcade_game.so --program-id YOUR_PROGRAM_ID --provider.cluster devnet

# Run tests
anchor test

# View program logs
solana logs YOUR_PROGRAM_ID --url devnet
```

## What Happens After Deployment

Once deployed successfully:
1. ✅ The `PrivilegeEscalation` error will be fixed
2. ✅ The cron job will be able to distribute winnings properly
3. ✅ Both Flappy Bird and Pacman pots will close and pay winners

## Monitoring

Watch the backend logs to see successful distribution:
```bash
# If using pm2
pm2 logs solcade-backend

# OR direct logs
tail -f /path/to/your/logs
```

You should see:
```
✅ Transaction succeeded on-chain
Database updated with winners
✅ Winners paid for flappy_bird pot #XXXX
```
