# 🎮 Deploy Using Solana Playground (beta.solpg.io)

## Easy Browser-Based Deployment - No Installation Required!

### Step 1: Go to Solana Playground

Visit: **https://beta.solpg.io**

### Step 2: Create New Project

1. Click **"New Project"** or **"+"** button
2. Select **"Anchor"** framework
3. Name it: `arcade_game`
4. Click **Create**

### Step 3: Replace the Code

1. In the file explorer, open `src/lib.rs`
2. **Delete all existing code**
3. Copy the entire content from your file:
   `/home/viscanum853/SolCade/contracts/arcade_game/programs/arcade_game/src/lib.rs`
4. Paste it into the Solana Playground editor

### Step 4: Update Cargo.toml

1. Open `Cargo.toml` in Solana Playground
2. Make sure it has:

```toml
[package]
name = "arcade_game"
version = "0.1.0"
edition = "2021"

[lib]
crate-type = ["cdylib", "lib"]

[dependencies]
anchor-lang = "0.29.0"
```

### Step 5: Connect Your Wallet

1. Click **"Connect"** button at the top right
2. Choose your Solana wallet (Phantom, Solflare, etc.)
3. Approve the connection
4. Switch to **Devnet** in your wallet

### Step 6: Get Devnet SOL

1. Click the **"Airdrop"** button (💰) in Solana Playground
2. This will give you 5 SOL on Devnet
3. Wait a few seconds for confirmation

### Step 7: Build the Program

1. Click the **"Build"** button (🔨) on the left sidebar
2. Wait for build to complete (30-60 seconds)
3. You'll see: ✅ Build successful

### Step 8: Deploy!

1. Click the **"Deploy"** button (🚀)
2. Confirm the transaction in your wallet
3. Wait for deployment (can take 1-2 minutes)
4. **IMPORTANT**: Copy the Program ID that appears!

Example:
```
Program Id: AbC123...XyZ789
```

### Step 9: Download the IDL

1. After successful deployment, click the **"Download IDL"** button
2. This downloads `arcade_game.json`
3. Save this file - you'll need it for the backend

### Step 10: Update Your Backend

Now update these files with your new Program ID:

#### 1. Update backend/src/config/solana.ts

```typescript
export const programId = new PublicKey("YOUR_NEW_PROGRAM_ID_HERE");
```

#### 2. Replace the IDL file

```bash
# Copy the downloaded arcade_game.json to:
cp ~/Downloads/arcade_game.json /home/viscanum853/SolCade/backend/arcade_game.json
```

#### 3. Rebuild and restart backend

```bash
cd /home/viscanum853/SolCade/backend
npm run build
npm start
```

## 🎯 Quick Reference

| Step | Action | Button/Location |
|------|--------|----------------|
| 1 | Visit | https://beta.solpg.io |
| 2 | Create Project | New Project → Anchor |
| 3 | Paste Code | src/lib.rs |
| 4 | Connect Wallet | Top right "Connect" |
| 5 | Get SOL | Click 💰 Airdrop |
| 6 | Build | Click 🔨 Build |
| 7 | Deploy | Click 🚀 Deploy |
| 8 | Copy Program ID | Shows after deploy |
| 9 | Download IDL | Click download button |

## ✅ Verification

After deployment, you can verify your program:

1. **In Solana Playground**: You'll see your program in the explorer
2. **In Solana Explorer**: Visit https://explorer.solana.com
   - Switch to Devnet
   - Search for your Program ID
   - You should see your program's transactions

3. **Test in your backend**:
   - The cron job should now work without errors
   - Check logs for: `✅ Transaction succeeded on-chain`

## 🐛 Troubleshooting

### "Insufficient funds"
- Click the Airdrop button (💰) again
- You need ~2-5 SOL for deployment

### "Build failed"
- Check for syntax errors in the code
- Make sure you copied the complete file
- Try clicking Build again

### "Deployment timed out"
- This is normal on devnet sometimes
- Check Solana Explorer to see if it actually deployed
- Try deploying again if needed

### "Transaction failed"
- Make sure you're on Devnet in your wallet
- Try the airdrop again
- Refresh the page and try again

## 🎉 Success!

Once deployed, your contract will:
- ✅ Fix the PrivilegeEscalation error
- ✅ Allow proper winner distribution
- ✅ Complete the full cron cycle

Your new Program ID will be different from the old one (`uqF9WXM1GkHE2nKFAPUVX1BSiWys59yzuWZW9GR9Fky`), so make sure to update it everywhere!
