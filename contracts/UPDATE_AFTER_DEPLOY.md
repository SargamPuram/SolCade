# 📝 Checklist: After Deploying New Contract

## Files to Update with New Program ID

After deploying on Solana Playground, you'll get a new Program ID.
Update it in these locations:

### 1. Backend Configuration
**File**: `backend/src/config/solana.ts`
**Line**: ~22

```typescript
// OLD:
export const programId = new PublicKey("uqF9WXM1GkHE2nKFAPUVX1BSiWys59yzuWZW9GR9Fky");

// NEW:
export const programId = new PublicKey("YOUR_NEW_PROGRAM_ID");
```

### 2. Backend IDL
**File**: `backend/arcade_game.json`

Replace the entire file with the one downloaded from Solana Playground.

```bash
cp ~/Downloads/arcade_game.json /home/viscanum853/SolCade/backend/arcade_game.json
```

### 3. Contract Declaration (Optional - only if you redeploy from local later)
**File**: `contracts/arcade_game/programs/arcade_game/src/lib.rs`
**Line**: 3

```rust
// OLD:
declare_id!("uqF9WXM1GkHE2nKFAPUVX1BSiWys59yzuWZW9GR9Fky");

// NEW:
declare_id!("YOUR_NEW_PROGRAM_ID");
```

### 4. Anchor Configuration (Optional - only if you redeploy from local later)
**File**: `contracts/Anchor.toml`
**Line**: 9

```toml
[programs.localnet]
arcade_game = "YOUR_NEW_PROGRAM_ID"
```

## Quick Update Script

Save this as `update-program-id.sh` and run it:

```bash
#!/bin/bash

NEW_PROGRAM_ID="$1"

if [ -z "$NEW_PROGRAM_ID" ]; then
    echo "Usage: ./update-program-id.sh YOUR_NEW_PROGRAM_ID"
    exit 1
fi

echo "Updating Program ID to: $NEW_PROGRAM_ID"

# Update backend config
sed -i "s/uqF9WXM1GkHE2nKFAPUVX1BSiWys59yzuWZW9GR9Fky/$NEW_PROGRAM_ID/g" \
    ../backend/src/config/solana.ts

# Update contract (optional)
sed -i "s/uqF9WXM1GkHE2nKFAPUVX1BSiWys59yzuWZW9GR9Fky/$NEW_PROGRAM_ID/g" \
    arcade_game/programs/arcade_game/src/lib.rs

# Update Anchor.toml (optional)
sed -i "s/uqF9WXM1GkHE2nKFAPUVX1BSiWys59yzuWZW9GR9Fky/$NEW_PROGRAM_ID/g" \
    Anchor.toml

echo "✅ Program ID updated!"
echo ""
echo "Next steps:"
echo "1. Copy the new IDL: cp ~/Downloads/arcade_game.json ../backend/"
echo "2. Rebuild backend: cd ../backend && npm run build"
echo "3. Restart server: npm start"
```

Usage:
```bash
chmod +x update-program-id.sh
./update-program-id.sh AbC123YourNewProgramIdXyZ789
```

## Rebuild & Restart

After updating all files:

```bash
cd /home/viscanum853/SolCade/backend

# Rebuild
npm run build

# Restart (choose one)
npm start

# OR if using PM2:
pm2 restart solcade-backend

# OR if running in background:
pkill -f "node dist/server.js" && npm start &
```

## Verify It's Working

Check your logs for:

```
Server running on port 3001
Wallet public key: EBqS9jFz8VNE9tWoTkzmRpzv4qkt1EJ8wrpGYJX6HtQW
Connected to Solana devnet: https://api.devnet.solana.com
Initializing cron jobs...
✅ Cron jobs initialized successfully
```

When cron runs (every 15 min):
```
🕐 Cron job triggered at: 2025-11-02T...
✅ Transaction succeeded on-chain
✅ Winners paid for flappy_bird pot #XXXX
```

## Test Immediately

Don't want to wait 15 minutes? Test the distribution manually:

```bash
# Call the API to distribute winners
curl -X POST http://localhost:3001/pot/distribute-winners \
  -H "Content-Type: application/json" \
  -d '{
    "gameId": "68210f89681811dd521231f4",
    "potPublicKey": "YOUR_POT_PUBLIC_KEY",
    "winners": [
      "winner1...",
      "winner2...",
      "winner3...",
      "winner4...",
      "winner5..."
    ]
  }'
```

Expected response:
```json
{
  "success": true,
  "message": "Winnings distributed...",
  "transaction": "signature...",
  "potAddress": "...",
  "winners": [...]
}
```

## 🎉 Done!

Your contract is now deployed and your backend is using it!
