#!/bin/bash

set -e

echo "🚀 SolCade Smart Contract Deployment Script"
echo "==========================================="
echo ""

# Check if we're in the contracts directory
if [ ! -f "Anchor.toml" ]; then
    echo "❌ Error: Please run this script from the contracts directory"
    exit 1
fi

# Check Solana config
echo "📋 Checking Solana configuration..."
CLUSTER=$(solana config get | grep "RPC URL" | awk '{print $3}')
echo "   Cluster: $CLUSTER"

WALLET=$(solana config get | grep "Keypair Path" | awk '{print $3}')
echo "   Wallet: $WALLET"

BALANCE=$(solana balance 2>/dev/null || echo "0 SOL")
echo "   Balance: $BALANCE"
echo ""

# Check balance
if [[ "$BALANCE" == *"0 SOL"* ]] || [[ "$BALANCE" == *"0.0"* ]]; then
    echo "⚠️  Low balance detected. Requesting airdrop..."
    solana airdrop 2 || echo "   Airdrop failed - you may need to wait or request manually"
    echo ""
fi

# Build the program
echo "🔨 Building program..."
anchor build
echo "✅ Build complete"
echo ""

# Get program ID
PROGRAM_ID=$(solana address -k target/deploy/arcade_game-keypair.json)
echo "📝 Program ID: $PROGRAM_ID"
echo ""

# Check if program exists
echo "🔍 Checking if program already deployed..."
if solana program show $PROGRAM_ID --url devnet &>/dev/null; then
    echo "⚠️  Program already exists. This will be an UPGRADE."
    read -p "   Continue with upgrade? (y/n) " -n 1 -r
    echo ""
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        echo "❌ Deployment cancelled"
        exit 1
    fi

    echo "🔄 Upgrading program..."
    anchor upgrade target/deploy/arcade_game.so --program-id $PROGRAM_ID --provider.cluster devnet
else
    echo "📦 Deploying new program..."
    anchor deploy --provider.cluster devnet
fi

echo ""
echo "✅ Deployment successful!"
echo ""

# Copy IDL to backend
echo "📋 Copying IDL to backend..."
BACKEND_PATH="../backend/arcade_game.json"
if [ -f "$BACKEND_PATH" ]; then
    cp target/idl/arcade_game.json $BACKEND_PATH
    echo "✅ IDL copied to backend"
else
    echo "⚠️  Backend path not found at $BACKEND_PATH"
    echo "   Manual copy needed: cp target/idl/arcade_game.json ../backend/"
fi

echo ""
echo "🎉 Deployment Complete!"
echo ""
echo "Next steps:"
echo "1. Update program ID in backend/src/config/solana.ts if it changed"
echo "2. Rebuild backend: cd ../backend && npm run build"
echo "3. Restart backend server"
echo ""
echo "Program ID: $PROGRAM_ID"
